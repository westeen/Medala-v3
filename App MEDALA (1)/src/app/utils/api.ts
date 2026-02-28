const BASE_URL = 'http://localhost:8000';

export const api = {
  // Meal logging endpoint
  async logMealEntry(text: string, files?: File[]) {
    const formData = new FormData();
    formData.append('text', text);
    
    if (files) {
      for (const file of files) {
        formData.append('files', file);
      }
    }

    const response = await fetch(`${BASE_URL}/log_entry_meals`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to log meal entry');
    }

    return response.json();
  },

  // Document upload endpoint (lab results)
  async uploadLabResult(files: File[]) {
    const formData = new FormData();
    
    for (const file of files) {
      formData.append('files', file);
    }

    const response = await fetch(`${BASE_URL}/log_entry_docs`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload lab result');
    }

    return response.json();
  },

  // General text logging
  async logGeneralText(text: string) {
    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch(`${BASE_URL}/log_entry_general_text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to log general text');
    }

    return response.json();
  },

  // Voice note logging
  async logVoiceNote(files: File[]) {
    const formData = new FormData();
    
    for (const file of files) {
      formData.append('files', file);
    }

    const response = await fetch(`${BASE_URL}/log_entry_general_voice`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to log voice note');
    }

    return response.json();
  },

  // Get all nutrition logs
  async getNutritionLogs() {
    const response = await fetch(`${BASE_URL}/nutrition_logs`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition logs');
    }

    return response.json();
  },

  // Get all lab results
  async getLabResults() {
    const response = await fetch(`${BASE_URL}/lab_results`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lab results');
    }

    return response.json();
  },

  // Get all text records
  async getTextRecords() {
    const response = await fetch(`${BASE_URL}/text_records`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch text records');
    }

    return response.json();
  },

  // Get today's calorie summary
  async getDailyCalorie() {
    const response = await fetch(`${BASE_URL}/daily_calorie`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch daily calorie');
    }

    return response.json();
  },

  // Get AI insights
  async getAIInsights() {
    const response = await fetch(`${BASE_URL}/ai_insights`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI insights');
    }

    return response.json();
  },

  // Get health index
  async getHealthIndex() {
    const response = await fetch(`${BASE_URL}/health_index`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch health index');
    }

    return response.json();
  },

  // Get food index
  async getFoodIndex() {
    const response = await fetch(`${BASE_URL}/food_index`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch food index');
    }

    return response.json();
  },

  // Get health summary
  async getHealthSummary(symptomLog: string, food: string, mood: string) {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptom_log: symptomLog,
        food: food,
        mood: mood,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch health summary');
    }

    return response.json();
  },
};