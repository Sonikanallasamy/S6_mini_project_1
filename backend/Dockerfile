FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

# Install system deps required for OpenCV + EasyOCR
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Pre-download EasyOCR model (important optimization)
RUN python -c "import easyocr; easyocr.Reader(['en'])"

# Copy project
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]