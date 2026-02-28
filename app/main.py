from sys import builtin_module_names
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from enum import Enum
from typing import List, Optional, Dict
from datetime import date, datetime, timezone, timedelta
import tempfile
import os
from google import genai
import json
from dotenv import load_dotenv

from .database import init_db, SessionLocal
from .models import NutritionLog, LabResult, TextRecord

# Load environment variables from the project root
load_dotenv()
GEMINI_API_KEY = "AIzaSyAvjzbwuzsmd3Ctiz-ll3mwRFeEWW_6pRU"

class HealthIndex(BaseModel):
    health_index: float

class FoodIndex(BaseModel):
    food_index: float

class CalorieModel(BaseModel):
    calories: int
    protein: int
    fat: int
    carbohydrates: int
    description: str

class MedicalSummary(BaseModel):
    summary: str

class Sentiment(str, Enum):
    VERY_POSITIVE = "very positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATICE = "negative"
    VERY_NEGATIVE = "very_negative"
    DISTRESSED = "distressed"


class Logs(BaseModel):
    symptom_log: str
    food: str
    mood: str

class Daily_Review(BaseModel):
    sentiment: Sentiment
    date: date
    quick_summary: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (nothing to do for now)


app = FastAPI(title="Hackathon API", lifespan=lifespan)

# Add CORS middleware - MUST be added before other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}



@app.post("/log_entry_meals")
async def log_meal_entry(text: str = Form(default=""),
    files: Optional[List[UploadFile]] = File(None)):
    gemini_api_key = GEMINI_API_KEY
    client = genai.Client(api_key=gemini_api_key)
    prompt = f'''You are an Assistant that receives pictures and text from the user about his daily meal intake, your task is to convert that information into json output with following logic:
    calories: int (total calories of the meals in kcal)
    protein: int (total protein of the meals in gramms)
    fat: int (total fat of the meals in gramms)
    carbohydrates: int (total carbohydrates of the meal in gramms)
    description: str (the brief description of the meal and review of how healthy it is and why)
    Here is the input from the user:
    {text}
    '''
    content = [prompt]
    
    if files:
        for file in files:
            suffix = os.path.splitext(file.filename)[1]  
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())  
                tmp_path = tmp.name

            myfile = client.files.upload(
                file=tmp_path
            )

            content.append(myfile)

            os.remove(tmp_path)

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=content,
        config={
        "response_mime_type": "application/json",
        "response_schema": CalorieModel,
    },
    )
    gemini_response = json.loads(str(response.text))

    # Persist nutrition log to the database
    session = SessionLocal()
    try:
        log_entry = NutritionLog(
            calories=gemini_response.get("calories"),
            protein=gemini_response.get("protein"),
            fats=gemini_response.get("fat"),
            carbs=gemini_response.get("carbohydrates"),
            description=gemini_response.get("description"),
        )
        session.add(log_entry)
        session.commit()
        session.refresh(log_entry)
    finally:
        session.close()

    return gemini_response


@app.post("/log_entry_docs")
async def log_docs_entry(files: Optional[List[UploadFile]] = File(None)):
    gemini_api_key = GEMINI_API_KEY 
    client = genai.Client(api_key=gemini_api_key)
    prompt = f'''You are an Assistant that receives files from the user about his/her clinical lab results, your task is to convert it into a brief summary of the results and identify weak spots. Your summary should be 200 words at most and should be in the schema below:
    summary: str (summary of the medical file)
    '''
    content = [prompt]
    
    if files:
        for file in files:
            suffix = os.path.splitext(file.filename)[1]  
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())  
                tmp_path = tmp.name

            myfile = client.files.upload(
                file=tmp_path
            )

            content.append(myfile)

            os.remove(tmp_path)

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=content,
        config={
        "response_mime_type": "application/json",
        "response_schema": MedicalSummary,
    },
    )
    gemini_response = json.loads(str(response.text))

    # Persist lab result summary to the database
    session = SessionLocal()
    try:
        lab_result = LabResult(
            lab_results_summary=gemini_response.get("summary"),
        )
        session.add(lab_result)
        session.commit()
        session.refresh(lab_result)
    finally:
        session.close()

    return gemini_response

@app.post("/log_entry_general_text")
async def log_general_text_entry(text: str = Form(default="")):
    gemini_api_key = GEMINI_API_KEY  
    client = genai.Client(api_key=gemini_api_key)
    prompt = f'''You are a health Assistant that receives text from the user about his/her today mood, activity and general health, your task is to convert it into a brief summary . Your summary should be 200 words at most and should be in the schema below:
    summary: str (summary of the user input)

    user's input:
    {text}
    '''
    content = [prompt]
    

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=content,
        config={
        "response_mime_type": "application/json",
        "response_schema": MedicalSummary,
    },
    )
    gemini_response = json.loads(str(response.text))

    # Persist general text summary to the database
    session = SessionLocal()
    try:
        record = TextRecord(
            ai_summary=gemini_response.get("summary"),
        )
        session.add(record)
        session.commit()
        session.refresh(record)
    finally:
        session.close()

    return gemini_response



@app.post("/log_entry_general_voice")
async def log_general_voice_entry(files: Optional[List[UploadFile]] = File(None)):
    gemini_api_key = GEMINI_API_KEY 
    client = genai.Client(api_key=gemini_api_key)
    prompt = f'''You are a health Assistant that receives voice input from the user about his/her today mood, activity and general health, your task is to convert it into a brief summary . Your summary should be 200 words at most and should be in the schema below:
    summary: str (summary of the user input)
    '''
    content = [prompt]
    
    if files:
        for file in files:
            suffix = os.path.splitext(file.filename)[1]  
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())  
                tmp_path = tmp.name

            myfile = client.files.upload(
                file=tmp_path
            )

            content.append(myfile)

            os.remove(tmp_path)

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=content,
        config={
        "response_mime_type": "application/json",
        "response_schema": MedicalSummary,
    },
    )
    gemini_response = json.loads(str(response.text))

    # Persist voice-based general text summary to the database
    session = SessionLocal()
    try:
        record = TextRecord(
            ai_summary=gemini_response.get("summary"),
        )
        session.add(record)
        session.commit()
        session.refresh(record)
    finally:
        session.close()

    return gemini_response

@app.get("/ai_insights")
async def ai_insights():
    # Collect all relevant health data from the database
    session = SessionLocal()
    try:
        nutrition_logs = session.query(NutritionLog).all()
        lab_results = session.query(LabResult).all()
        text_records = session.query(TextRecord).all()
    finally:
        session.close()

    # If no data logged yet, return default message
    if not nutrition_logs and not lab_results and not text_records:
        return {"summary": "Start logging your meals, health notes, and lab results to receive personalized health insights. Your AI assistant will analyze your data and provide recommendations every hour."}

    db_info = {
        "nutrition_logs": [
            {
                "datetime": log.datetime.isoformat() if log.datetime else None,
                "calories": log.calories,
                "protein": log.protein,
                "fats": log.fats,
                "carbs": log.carbs,
                "description": log.description,
            }
            for log in nutrition_logs
        ],
        "lab_results": [
            {
                "date": result.date.isoformat() if result.date else None,
                "summary": result.lab_results_summary,
            }
            for result in lab_results
        ],
        "text_records": [
            {
                "date": record.date.isoformat() if record.date else None,
                "summary": record.ai_summary,
            }
            for record in text_records
        ],
    }

    db_info_str = json.dumps(db_info)

    try:
        gemini_api_key = GEMINI_API_KEY 
        client = genai.Client(api_key=gemini_api_key)
        prompt = f'''You are a health Assistant that receives structured data about the user's various health related information from a database, your task is to convert it into insights and suggestions if needed that would be usefull for the user . Remember that you are talking to the user Directly, so keep your insights brief (1-2 sentence) and understandable. Your insights should be 200 words at most and should be in the schema below:
        summary: str (summary of the user input)

        db_info (JSON with nutrition logs, lab results, and text records):
        {db_info_str}
        '''
        content = [prompt]

        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=content,
            config={
            "response_mime_type": "application/json",
            "response_schema": MedicalSummary,
        },
        )
        gemini_response = json.loads(str(response.text))
        return gemini_response
    except Exception as e:
        # Return summary of logged data if API fails
        print(f"Error generating AI insights: {e}")
        summary = f"You have logged {len(nutrition_logs)} meals, {len(lab_results)} lab results, and {len(text_records)} health notes. Continue logging your data for personalized insights."
        return {"summary": summary}


@app.get("/nutrition_logs")
async def get_nutrition_logs():
    session = SessionLocal()
    try:
        logs = session.query(NutritionLog).all()
    finally:
        session.close()

    return [
        {
            "id": str(log.id),
            "datetime": log.datetime.isoformat() if log.datetime else None,
            "calories": log.calories,
            "protein": log.protein,
            "fats": log.fats,
            "carbs": log.carbs,
            "description": log.description,
        }
        for log in logs
    ]


@app.get("/lab_results")
async def get_lab_results():
    session = SessionLocal()
    try:
        results = session.query(LabResult).all()
    finally:
        session.close()

    return [
        {
            "id": str(result.id),
            "date": result.date.isoformat() if result.date else None,
            "lab_results_summary": result.lab_results_summary,
        }
        for result in results
    ]


@app.get("/text_records")
async def get_text_records():
    session = SessionLocal()
    try:
        records = session.query(TextRecord).all()
    finally:
        session.close()

    return [
        {
            "id": str(record.id),
            "date": record.date.isoformat() if record.date else None,
            "ai_summary": record.ai_summary,
        }
        for record in records
    ]


@app.get("/daily_calorie")
async def daily_calorie():
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())

    session = SessionLocal()
    try:
        logs = (
            session.query(NutritionLog)
            .filter(
                NutritionLog.datetime >= start_of_day,
                NutritionLog.datetime <= end_of_day,
            )
            .all()
        )
    finally:
        session.close()

    totals = {
        "calories": 0.0,
        "protein": 0.0,
        "fat": 0.0,
        "carbohydrates": 0.0,
    }

    for log in logs:
        if log.calories is not None:
            totals["calories"] += log.calories
        if log.protein is not None:
            totals["protein"] += log.protein
        if log.fats is not None:
            totals["fat"] += log.fats
        if log.carbs is not None:
            totals["carbohydrates"] += log.carbs

    return totals


def db_index() -> str:
    """
    Return a summary of recent data from the database:
    - All NutritionLog entries from the last 7 days
    - Last 7 TextRecord entries
    - Last 7 LabResult entries
    The response is returned as a single string (JSON-encoded).
    """
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)

    session = SessionLocal()
    try:
        nutrition_logs = (
            session.query(NutritionLog)
            .filter(NutritionLog.datetime >= seven_days_ago)
            .order_by(NutritionLog.datetime.desc())
            .all()
        )

        text_records = (
            session.query(TextRecord)
            .order_by(TextRecord.date.desc())
            .limit(7)
            .all()
        )

        lab_results = (
            session.query(LabResult)
            .order_by(LabResult.date.desc())
            .limit(7)
            .all()
        )
    finally:
        session.close()

    data = {
        "nutrition_logs": [
            {
                "id": str(log.id),
                "datetime": log.datetime.isoformat() if log.datetime else None,
                "calories": log.calories,
                "protein": log.protein,
                "fats": log.fats,
                "carbs": log.carbs,
                "description": log.description,
            }
            for log in nutrition_logs
        ],
        "text_records": [
            {
                "id": str(record.id),
                "date": record.date.isoformat() if record.date else None,
                "summary": record.ai_summary,
            }
            for record in text_records
        ],
        "lab_results": [
            {
                "id": str(result.id),
                "date": result.date.isoformat() if result.date else None,
                "summary": result.lab_results_summary,
            }
            for result in lab_results
        ],
    }

    # Return as a plain string, as requested
    return json.dumps(data)

@app.get("/health_index")
async def health_index():
    try:
        gemini_api_key = GEMINI_API_KEY 
        client = genai.Client(api_key=gemini_api_key)
        prompt = f'''You are a health Assistant that receives text from the database about the users general info regarding his/her meals , health conditions, and lab results, your task is to convert it into a single Health index which should be a float number between 0 and 10 . Your response should be in the schema below:
        health_index: float 

        database info:
        {db_index()}
        '''
        content = [prompt]
        

        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=content,
            config={
            "response_mime_type": "application/json",
            "response_schema": HealthIndex,
        },
        )
        gemini_response = json.loads(str(response.text))

        return gemini_response
    except Exception as e:
        print(f"Error generating health index: {e}")
        return {"health_index": 5.0}

@app.get("/food_index")
async def food_index():
    # Collect last 7 days of nutrition logs
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)

    session = SessionLocal()
    try:
        nutrition_logs = (
            session.query(NutritionLog)
            .filter(NutritionLog.datetime >= seven_days_ago)
            .order_by(NutritionLog.datetime.desc())
            .all()
        )
    finally:
        session.close()

    # If no data logged yet, return default value
    if not nutrition_logs:
        return {"food_index": 5.0}

    foods_data = [
        {
            "id": str(log.id),
            "datetime": log.datetime.isoformat() if log.datetime else None,
            "calories": log.calories,
            "protein": log.protein,
            "fats": log.fats,
            "carbs": log.carbs,
            "description": log.description,
        }
        for log in nutrition_logs
    ]

    foods = json.dumps(foods_data)
    try:
        gemini_api_key = GEMINI_API_KEY 
        client = genai.Client(api_key=gemini_api_key)
        prompt = f'''You are a health Assistant that receives structured data from the database about the users info regarding his/her meals, your task is to convert it into a single food index which should be a float number between 0 and 10 based on the quality of food the person is consuming. Your response should be in the schema below:
        food_index: float 

        foods (JSON with the last 7 days of nutrition logs):
        {foods}
        '''
        content = [prompt]
        

        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=content,
            config={
            "response_mime_type": "application/json",
            "response_schema": FoodIndex,
        },
        )
        gemini_response = json.loads(str(response.text))

        return gemini_response
    except Exception as e:
        print(f"Error generating food index: {e}")
        return {"food_index": 5.0}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)