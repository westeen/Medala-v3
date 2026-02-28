import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Activity, User, Heart, AlertCircle, Calendar, Pill, Stethoscope, Phone } from 'lucide-react';
import { api } from '../utils/api';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    
    // Chronic Illness Information
    primaryDiagnosis: '',
    diagnosisDate: '',
    secondaryConditions: [] as string[],
    allergens: '',
    
    // Current Medications
    medications: [{ name: '', dosage: '', frequency: '', prescribedBy: '' }],
    
    // Healthcare Providers
    primaryCarePhysician: { name: '', specialty: '', phone: '', email: '' },
    specialists: [{ name: '', specialty: '', phone: '', email: '' }],
    
    // Baseline Vitals
    baselineBloodPressure: '',
    baselineGlucose: '',
    baselineWeight: '',
    baselineHeight: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
  });

  const commonConditions = [
    'Type 1 Diabetes',
    'Type 2 Diabetes',
    'Hypertension',
    'Heart Disease',
    'COPD',
    'Asthma',
    'Chronic Kidney Disease',
    'Arthritis',
    'Thyroid Disorder',
    'Other',
  ];

  const secondaryConditionsList = [
    'High Cholesterol',
    'Obesity',
    'Sleep Apnea',
    'Depression',
    'Anxiety',
    'Osteoporosis',
    'Chronic Pain',
  ];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const newMeds = [...formData.medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setFormData((prev) => ({ ...prev, medications: newMeds }));
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', prescribedBy: '' }],
    }));
  };

  const toggleSecondaryCondition = (condition: string) => {
    setFormData((prev) => {
      const conditions = prev.secondaryConditions.includes(condition)
        ? prev.secondaryConditions.filter((c) => c !== condition)
        : [...prev.secondaryConditions, condition];
      return { ...prev, secondaryConditions: conditions };
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      // Generate a temporary user ID (in production, this would come from auth)
      const userId = `user_${Date.now()}`;
      
      // Save profile to backend
      try {
        await api.saveProfile(userId, formData);
      } catch (error) {
        console.error('Backend save error:', error);
        // Continue with local storage as fallback
      }

      // Store userId and profile locally as well
      localStorage.setItem('medala_user_id', userId);
      localStorage.setItem('medala_profile', JSON.stringify(formData));
      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MEDALA</h1>
              <p className="text-sm text-gray-600">Clinical Intelligence</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Health Profile Setup</h2>
          <p className="text-gray-600">Help us understand your health journey to provide personalized care</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-1/5 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">Step {step} of 5</div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold">Personal Information</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Chronic Illness Information */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold">Chronic Illness Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Diagnosis *
                  </label>
                  <select
                    value={formData.primaryDiagnosis}
                    onChange={(e) => updateField('primaryDiagnosis', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select primary condition</option>
                    {commonConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Diagnosis
                  </label>
                  <input
                    type="month"
                    value={formData.diagnosisDate}
                    onChange={(e) => updateField('diagnosisDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Conditions (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {secondaryConditionsList.map((condition) => (
                      <label
                        key={condition}
                        className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.secondaryConditions.includes(condition)}
                          onChange={() => toggleSecondaryCondition(condition)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Known Allergens (medications, foods, etc.)
                  </label>
                  <textarea
                    value={formData.allergens}
                    onChange={(e) => updateField('allergens', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    rows={3}
                    placeholder="List any known allergies..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Current Medications */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Pill className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold">Current Medications</h3>
              </div>

              <div className="space-y-4">
                {formData.medications.map((med, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medication Name
                        </label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => updateMedication(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., Metformin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dosage
                        </label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency
                        </label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prescribed By
                        </label>
                        <input
                          type="text"
                          value={med.prescribedBy}
                          onChange={(e) => updateMedication(index, 'prescribedBy', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Dr. Name"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addMedication}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  + Add Another Medication
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Healthcare Providers */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Stethoscope className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold">Healthcare Providers</h3>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Primary Care Physician</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.primaryCarePhysician.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryCarePhysician: { ...prev.primaryCarePhysician, name: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Dr. Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.primaryCarePhysician.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            primaryCarePhysician: { ...prev.primaryCarePhysician, phone: e.target.value },
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyName}
                        onChange={(e) => updateField('emergencyName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relation
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyRelation}
                        onChange={(e) => updateField('emergencyRelation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g., Spouse"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => updateField('emergencyPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Baseline Vitals */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold">Baseline Health Metrics</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Pressure (if known)
                    </label>
                    <input
                      type="text"
                      value={formData.baselineBloodPressure}
                      onChange={(e) => updateField('baselineBloodPressure', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Glucose Level (if known)
                    </label>
                    <input
                      type="text"
                      value={formData.baselineGlucose}
                      onChange={(e) => updateField('baselineGlucose', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 95 mg/dL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={formData.baselineWeight}
                      onChange={(e) => updateField('baselineWeight', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 150 lbs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height
                    </label>
                    <input
                      type="text"
                      value={formData.baselineHeight}
                      onChange={(e) => updateField('baselineHeight', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 5'8&quot;"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> These baseline measurements will help MEDALA provide more accurate health predictions and risk analysis. You can update these values anytime in your settings.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}