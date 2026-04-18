# Real vs Fake Medicine Detector

A web application that detects whether a medicine is real or fake by extracting text from medicine images using OCR and matching it against a verified medicine database.

## How It Works

1. User uploads an image of a medicine (strip, box, or label)
2. EasyOCR extracts the text from the image
3. RapidFuzz matches the extracted text against a CSV database of verified medicines
4. If the match score is 70% or above - medicine is Real
5. If the match score is below 70% - medicine is Fake

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI (Python)
- OCR: EasyOCR
- Fuzzy Matching: RapidFuzz
- Database: CSV (verified medicine data)
- Containerization: Docker
- Deployment: HuggingFace Spaces

## Key Features

- Upload medicine images directly from your device
- Automatic text extraction using EasyOCR
- Fuzzy matching with 70% threshold for accuracy
- Scan history tracking
- User authentication
- Fully containerized with Docker

## Live Demo

HuggingFace Spaces: https://huggingface.co/spaces/sonika22/mini_project_1_sem_6

## License

MIT License

## Author

Sonikanallasamy - Semester 6 Mini Project
