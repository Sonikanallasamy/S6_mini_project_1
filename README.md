# 💊 Real vs Fake Medicine Detector

A web application that detects whether a medicine is **real or fake** by extracting text from medicine images using OCR and matching it against a verified medicine database.

---

## 🔍 How It Works

1. **User uploads** an image of a medicine (strip, box, or label)
2. **EasyOCR** extracts the text from the image
3. **RapidFuzz** matches the extracted text against a CSV database of verified medicines
4. If the match score is **≥ 70%** → medicine is **✅ Real**
5. If the match score is **< 70%** → medicine is **❌ Fake**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| OCR | EasyOCR |
| Fuzzy Matching | RapidFuzz |
| Database | CSV (verified medicine data) |
| Containerization | Docker |
| Deployment | HuggingFace Spaces |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional)

### Backend
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --reload

### Frontend
cd frontend
npm install
npm run dev

### Using Docker
docker-compose up --build

---

## 📁 Project Structure

mini_project_1_real_vs_fake_medicine/
├── backend/
│   ├── app.py           # FastAPI main app
│   ├── auth.py          # Authentication
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── database.py      # DB connection
│   ├── data/            # Medicine CSV data
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   └── assets/
│   ├── public/
│   └── package.json
├── docker-compose.yml
└── .env.example

---

## 🌐 Live Demo

🤗 HuggingFace Spaces: https://huggingface.co/spaces/sonika22/mini_project_1_sem_6

---

## 📌 Key Features

- 📸 Upload medicine images directly from your device
- 🔎 Automatic text extraction using EasyOCR
- 🧪 Fuzzy matching with 70% threshold for accuracy
- 📊 Scan history tracking
- 🔐 User authentication
- 🐳 Fully containerized with Docker

---

## 📄 License

MIT License

---

## 👩‍💻 Author

Sonikanallasamy — Semester 6 Mini Project