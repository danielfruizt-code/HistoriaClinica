# app/main.py
import os
import re
import json
import datetime
from fastapi import FastAPI, HTTPException, Request, Header
from pydantic import BaseModel
from extractor import extract_fields, extract_with_model, load_model
from db import SessionLocal, init_db, save_feedback
from models import TrainingExample
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY", "changeme")
MODEL_DIR = os.getenv("MODEL_DIR", "models/current")

app = FastAPI(title="OCR -> Estructuración API")

# intenta cargar el modelo entrenado (si existe)
nlp = load_model(MODEL_DIR)

class TextIn(BaseModel):
    text: str

class FeedbackIn(BaseModel):
    text: str
    labels: dict   # {"nombre":"...", "edad":"...", ...}

@app.on_event("startup")
def startup():
    init_db()

@app.post("/procesar")
def procesar(payload: TextIn):
    text = payload.text
    # Primero intenta con el modelo spaCy (si cargado)
    if nlp:
        parsed = extract_with_model(nlp, text)
    else:
        parsed = {}

    # Si el modelo no extrae algo, fallback por regex/simple heuristics
    fallback = extract_fields(text)
    # Merge: preferencia al modelo cuando devuelve valor
    result = {**fallback, **{k: v for k, v in (parsed or {}).items() if v}}
    # añade id y timestamp
    result["id"] = f"HC-{int(datetime.datetime.utcnow().timestamp())}"
    return result

@app.post("/feedback")
def feedback(payload: FeedbackIn, x_api_key: str = Header(None)):
    # protección simple: api key
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Guardar feedback para futuras rondas de entrenamiento
    save_feedback(payload.text, payload.labels)
    return {"status":"ok"}

@app.post("/retrain")
def retrain(x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Este endpoint lanza un reentrenamiento (sincronamente)
    from train import train_from_db_and_save
    model_path = train_from_db_and_save()
    # recargar modelo en memoria
    global nlp
    nlp = load_model(model_path)
    return {"status":"trained", "model_path": model_path}
