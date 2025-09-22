# app/db.py
import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from App.models import Base, TrainingExample
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./feedback.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def save_feedback(text, labels: dict):
    db = SessionLocal()
    ex = TrainingExample(text=text, labels=json.dumps(labels))
    db.add(ex)
    db.commit()
    db.close()
