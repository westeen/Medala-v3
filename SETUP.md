# Frontend-Backend Connection Setup

Your frontend and backend are now connected! Here's how to run them:

## Backend Setup (FastAPI)

1. **Navigate to the app directory:**
   ```bash
   cd /Users/bokhodirjonrakhimjonov/Desktop/HackathonFeb
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server:**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend will be available at `http://localhost:8000`

## Frontend Setup (React + Vite)

1. **Navigate to the frontend directory:**
   ```bash
   cd "App MEDALA (1)"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will typically be available at `http://localhost:5173`

## API Endpoints Connected

Your frontend now calls these FastAPI endpoints:

- **POST** `/log_entry_meals` - Log meal with text and/or images
- **POST** `/log_entry_docs` - Upload lab result documents
- **POST** `/log_entry_general_text` - Log general health text
- **POST** `/log_entry_general_voice` - Log voice notes
- **GET** `/nutrition_logs` - Get all nutrition logs
- **GET** `/lab_results` - Get all lab results
- **GET** `/text_records` - Get all text records
- **GET** `/daily_calorie` - Get today's calorie summary
- **GET** `/ai_insights` - Get AI-generated insights
- **GET** `/health_index` - Get overall health index
- **GET** `/food_index` - Get food quality index
- **POST** `/health` - Get health summary from logs

## CORS Configuration

CORS is enabled on the backend to allow requests from the frontend. Adjust `allow_origins` in `app/main.py` for production use.

## Environment Variables

Make sure your `.env` file in the `app` directory contains:
- `GEMINI_API_KEY` - Your Google Gemini API key
- Any database configuration if needed
