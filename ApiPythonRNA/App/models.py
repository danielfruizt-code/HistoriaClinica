# app/models.py
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Text, DateTime
import datetime

Base = declarative_base()

class TrainingExample(Base):
    __tablename__ = "training_examples"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    labels = Column(Text, nullable=False)  # JSON string: {"nombre": "...", ...}
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
