from sqlalchemy import Column, String, Text, Float, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime, date, timezone
import uuid


class Base(DeclarativeBase):
    pass


class LabResult(Base):
    """
    Table 1: lab_results
    Stores uploaded lab result as AI-generated summary.
    """
    __tablename__ = "lab_results"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lab_results_summary = Column(Text, nullable=True)  # AI-generated summary of the lab result
    date  = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class NutritionLog(Base):
    """
    Table 2: nutrition_logs
    Stores daily nutrition data — calories, macros.
    """
    __tablename__ = "nutrition_logs"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    datetime    = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    calories    = Column(Float, nullable=True)
    protein     = Column(Float, nullable=True)        # grams
    fats        = Column(Float, nullable=True)        # grams
    carbs       = Column(Float, nullable=True)        # grams
    description = Column(String, nullable=True)       # text description of the log


class TextRecord(Base):
    """
    Table 3: text_records
    Stores health text as an AI-generated summary.
    """
    __tablename__ = "text_records"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date       = Column(Date, nullable=False, default=date.today)
    ai_summary = Column(Text, nullable=True)           # AI summary of the raw text

