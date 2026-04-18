# ─────────────────────────────────────────
# Stage 1: Build React frontend
# ─────────────────────────────────────────
FROM node:20-slim AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Python backend + serve frontend
# ─────────────────────────────────────────
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV EASYOCR_MODULE_PATH=/app/models
ENV PORT=7860

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Bake EasyOCR models into the image at build time
RUN python -c "import easyocr; easyocr.Reader(['en'], gpu=False)"

COPY backend/ .

# Copy the React build output into FastAPI's static folder
COPY --from=frontend-build /frontend/dist ./static

EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
