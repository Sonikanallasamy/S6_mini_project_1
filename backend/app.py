from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import easyocr
import pandas as pd
from PIL import Image
import numpy as np
import io
import cv2
import re
import os
from uuid import uuid4
from rapidfuzz import fuzz
from dotenv import load_dotenv

from database import engine, SessionLocal
from models import Base, User, ScanHistory
from schemas import ScanHistoryResponse
from auth import hash_password, verify_password, create_access_token

from jose import jwt, JWTError

# ─────────────────────────────────────────
# ENV
# ─────────────────────────────────────────
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set. Add it in HF Space secrets.")

# ─────────────────────────────────────────
# App setup
# ─────────────────────────────────────────
Base.metadata.create_all(bind=engine)
app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Upload folder
# ─────────────────────────────────────────
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ─────────────────────────────────────────
# EasyOCR — lazy load (already baked into image)
# ─────────────────────────────────────────
_reader = None

def get_reader():
    global _reader
    if _reader is None:
        print("Initialising EasyOCR reader...")
        _reader = easyocr.Reader(['en'], gpu=False)
        print("EasyOCR ready.")
    return _reader

# ─────────────────────────────────────────
# Load medicine CSV
# ─────────────────────────────────────────
try:
    df = pd.read_csv("data/modified_medicine_data.csv")
    medicine_list = df["medicine_name"].dropna().str.lower().tolist()
    print(f"Loaded {len(medicine_list)} medicines from CSV.")
except Exception as e:
    print(f"CSV load error: {e}")
    medicine_list = []

# ─────────────────────────────────────────
# DB
# ─────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─────────────────────────────────────────
# Auth helpers
# ─────────────────────────────────────────
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ─────────────────────────────────────────
# API Routes
# ─────────────────────────────────────────
@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password too short")
    if not username.strip():
        raise HTTPException(status_code=400, detail="Invalid username")
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    user = User(username=username, password=hash_password(password))
    db.add(user)
    db.commit()
    return {"message": "Registered successfully"}


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_access_token(data={"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    filename = f"{uuid4()}.png"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or unreadable image")

    reader = get_reader()
    result = reader.readtext(thresh, detail=1, paragraph=True)
    raw_text = " ".join([text[1] for text in result]).lower()

    dosage = list(set(re.findall(
        r'\b\d+\s?(?:mg|ml|g|mcg|mg/ml)\b', raw_text
    )))

    clean_text = re.sub(r'[^a-zA-Z0-9\s]', ' ', raw_text)
    clean_text = " ".join([w for w in clean_text.split() if len(w) > 2])
    clean_text = " ".join(dict.fromkeys(clean_text.split()))

    stopwords = {
        "tablet", "capsule", "dosage", "use", "only", "store",
        "keep", "away", "children", "india"
    }
    clean_text = " ".join([w for w in clean_text.split() if w not in stopwords])
    detected_text = clean_text.strip()

    if not detected_text:
        return {
            "medicine_name": "Unknown",
            "dosage": [],
            "detected_text": "",
            "status": "Possible Fake"
        }

    best_score = 0
    best_match = "Unknown"

    for med in medicine_list:
        score = max(
            fuzz.token_set_ratio(med, detected_text),
            fuzz.partial_ratio(med, detected_text),
            fuzz.token_sort_ratio(med, detected_text)
        )
        if med in detected_text:
            score += 10
        if score > best_score:
            best_score = score
            best_match = med

    if best_score >= 70:
        medicine_name = best_match
        status = "Real Medicine"
    else:
        medicine_name = "Unknown"
        status = "Possible Fake"

    scan = ScanHistory(
        username=username,
        medicine_name=medicine_name,
        detected_text=detected_text,
        status=status,
        image=file_path
    )
    db.add(scan)
    db.commit()

    return {
        "medicine_name": medicine_name,
        "dosage": dosage,
        "detected_text": detected_text,
        "status": status
    }


@app.get("/history", response_model=list[ScanHistoryResponse])
def history(
    username: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(ScanHistory).filter(
        ScanHistory.username == username
    ).all()


# ─────────────────────────────────────────
# Serve React frontend — MUST BE LAST
# ─────────────────────────────────────────
STATIC_DIR = os.path.join(os.getcwd(), "static")

if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_react(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        return FileResponse(index)