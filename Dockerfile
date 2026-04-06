FROM python:3.10

WORKDIR /app

COPY backend /app/backend
COPY frontend /app/frontend

WORKDIR /app/backend

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]