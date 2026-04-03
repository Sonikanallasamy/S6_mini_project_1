#!/usr/bin/env bash
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# preload OCR model
python -c "import easyocr; easyocr.Reader(['en'], gpu=False)"