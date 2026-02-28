# MEDALA - AI-Powered Clinical Intelligence Platform

**MEDALA** is a modern, mobile-first health application designed for chronic disease management with AI-powered capabilities for lab result interpretation, voice note analysis, and predictive risk assessment.

## 🏥 Key Features

### 1. **Comprehensive Onboarding**
- Multi-step health profile setup
- Chronic illness information collection
- Medication tracking
- Healthcare provider management
- Baseline health metrics
- Emergency contact information

### 2. **Health Overview Dashboard**
- **Health Stability Score** (0-100) with visual risk indicators
- Real-time health metrics monitoring:
  - Blood Pressure (with critical/warning/normal status)
  - Glucose Levels (with trend analysis)
  - Medication Adherence
  - Sleep Quality
- **AI Clinical Summary** with:
  - Critical alerts and warnings
  - Predictive risk analysis (30-day cardiovascular event risk, diabetes complications)
  - Preventive action suggestions
  - Clinical note generation

### 3. **Log Entry System**

#### **Voice Notes** 🎤
- Real voice recording functionality using Web Audio API
- AI-powered transcript generation
- Automated clinical analysis identifying:
  - Symptoms
  - Metrics
  - Behavioral patterns
- Risk score calculation
- Clinical recommendations

#### **Text Entry** 📝
- Manual clinical observation logging
- AI analysis of text entries
- Key findings extraction
- Automated recommendations

#### **Lab Results** 🔬
- PDF/Image upload support
- AI-powered lab result interpretation
- **Visual Risk Indicators:**
  - Color-coded results (Red = Critical, Orange = Warning, Green = Normal)
  - Trend indicators (increasing/stable/decreasing)
  - Abnormal value highlighting with borders
- Detailed analysis for:
  - Glucose levels
  - HbA1c
  - Cholesterol (Total, LDL, HDL)
  - Blood pressure
- Critical alerts for out-of-range values
- Overall risk level assessment
- Personalized recommendations

#### **Meal Tracker** 🍽️
- Nutrition tracking (Calories, Protein, Carbs, Fats)
- Photo upload for AI nutritional analysis

### 4. **Clinical Notes**
- Structured SOAP format (Subjective, Objective, Assessment, Plan)
- Color-coded sections for easy reading
- Tags for entry type and risk level
- PDF export functionality

### 5. **Doctor Schedule**
- AI-recommended appointments based on health metrics
- Upcoming appointment management
- Detailed appointment information (date, time, location, contact)

### 6. **Privacy & Security**
- Healthcare-grade security architecture
- End-to-end encryption (AES-256)
- GDPR and HIPAA ready
- Role-based access control
- Synthetic data demonstration

### 7. **Settings**
- Account management
- Clinical alerts configuration with toggles:
  - Critical health alerts
  - Medication reminders
  - Appointment reminders
  - Weekly health summaries
- Data management (export, retention, account deletion)

## 🎨 Design Features

- **Mobile-First UI**: Fully responsive design optimized for mobile devices
- **Modern Color Scheme**: Emerald/teal primary colors for healthcare branding
- **Visual Risk Indicators**: Color-coded health metrics (red/orange/green)
- **Status Badges**: Clear visual indicators for metric statuses
- **Trend Icons**: Arrows showing health metric trends
- **Progressive Disclosure**: Multi-step onboarding process
- **Bottom Navigation**: Mobile-optimized navigation bar

## 🔧 Technical Stack

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- **Web Audio API** for voice recording

### Backend
- **Supabase** for database and storage
- **Hono** web server framework
- **Deno** runtime for edge functions
- **Key-Value Store** for data persistence
- **Supabase Storage** for file uploads (lab results, voice recordings)

## 📱 Mobile Responsiveness

- Desktop: Full sidebar navigation + main content
- Mobile: Bottom navigation bar + mobile header
- Responsive grid layouts (2-column on mobile, 4-column on desktop)
- Touch-optimized buttons and controls
- Horizontal scrolling tabs on mobile

## 🚀 Getting Started

### First Time Setup
1. Open the application
2. Complete the 5-step onboarding process:
   - Step 1: Personal Information
   - Step 2: Chronic Illness Information
   - Step 3: Current Medications
   - Step 4: Healthcare Providers
   - Step 5: Baseline Health Metrics

### Daily Usage
1. **Overview**: Check your health dashboard and AI insights
2. **Log Entry**: Record symptoms via voice, text, or upload lab results
3. **Notes**: Review your clinical documentation history
4. **Dr Schedule**: Manage appointments and view AI recommendations

## 🔒 Data Storage

- **LocalStorage**: User profile and user ID (fallback)
- **Supabase KV Store**: Profile, metrics, clinical notes
- **Supabase Storage**: Lab result PDFs, voice recordings
- **Persistent**: Data syncs across devices when online

## 🎯 AI Capabilities

### Predictive Risk Analysis
- 30-day cardiovascular event risk calculation
- Diabetes complication risk assessment
- Medication adherence pattern recognition
- Sleep quality impact analysis

### Lab Result Interpretation
- Automatic value comparison with normal ranges
- Trend detection (increasing/stable/decreasing)
- Critical value alerts
- Comprehensive health insights
- Personalized recommendations

### Voice Note Analysis
- Automated transcription
- Key finding extraction (symptoms, metrics, behaviors)
- Severity classification
- Risk score calculation
- Clinical recommendation generation

## ⚠️ Important Notes

- **Demo Mode**: This is a demonstration application using simulated AI analysis
- **Not for Production**: Not intended for storing real patient health information (PHI)
- **Synthetic Data**: All demo data is synthetic and for illustration only
- **Development Purpose**: Built for prototype and development purposes

## 🔮 Future Enhancements

- Real AI/ML model integration
- Wearable device integration
- Medication reminder push notifications
- Telemedicine video consultation
- Family caregiver dashboard
- Multi-language support
- Offline mode with sync

## 📄 License

This is a demonstration project built with Figma Make.

---

**MEDALA** - Empowering patients with AI-powered preventive healthcare insights.
