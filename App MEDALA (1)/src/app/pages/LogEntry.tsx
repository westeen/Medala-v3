import { useState, useRef, useEffect } from 'react';
import { Mic, FileText, FlaskConical, UtensilsCrossed, Upload, Camera, Square, Trash2, Loader } from 'lucide-react';

type TabType = 'voice' | 'text' | 'lab' | 'meal';

export function LogEntry() {
  const [activeTab, setActiveTab] = useState<TabType>('meal');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textEntry, setTextEntry] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labAnalysis, setLabAnalysis] = useState<any>(null);
  const [mealPhotos, setMealPhotos] = useState<File[]>([]);
  const [mealDescription, setMealDescription] = useState('');
  const [mealAnalysis, setMealAnalysis] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setRecordingTime(0);
    setAnalysis(null);
  };

  const analyzeVoiceNote = async () => {
    if (!audioBlob) return;
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('files', audioBlob, 'voice_note.webm');

      const response = await fetch('http://localhost:8000/log_entry_general_voice', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis({ summary: data.summary });
      }
    } catch (error) {
      console.error('Error analyzing voice note:', error);
      alert('Error analyzing voice note');
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeTextEntry = async () => {
    if (!textEntry.trim()) {
      alert('Please enter some text');
      return;
    }
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('text', textEntry);

      const response = await fetch('http://localhost:8000/log_entry_general_text', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis({ summary: data.summary });
      }
    } catch (error) {
      console.error('Error analyzing text entry:', error);
      alert('Error analyzing text entry');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMealPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setMealPhotos(Array.from(files));
    }
  };

  const analyzeMealEntry = async () => {
    if (mealPhotos.length === 0 && !mealDescription.trim()) {
      alert('Please add a photo or description of your meal');
      return;
    }
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('text', mealDescription);
      mealPhotos.forEach((photo) => {
        formData.append('files', photo);
      });

      const response = await fetch('http://localhost:8000/log_entry_meals', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMealAnalysis({
          calories: data.calories,
          protein: data.protein,
          fat: data.fat,
          carbohydrates: data.carbohydrates,
          description: data.description,
        });
        setMealPhotos([]);
        setMealDescription('');
      }
    } catch (error) {
      console.error('Error analyzing meal:', error);
      alert('Error analyzing meal');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLabFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLabFile(file);
      analyzeLabResults(file);
    }
  };

  const analyzeLabResults = async (file: File) => {
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('http://localhost:8000/log_entry_docs', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setLabAnalysis({ summary: data.summary });
      }
    } catch (error) {
      console.error('Error analyzing lab results:', error);
      alert('Error analyzing lab results');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Log Entry</h1>
        <p className="text-gray-600">Record clinical observations, lab results, and track nutrition</p>
      </div>

      <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'voice' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span className="text-sm md:text-base">Voice Note</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'text' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm md:text-base">Text Entry</span>
        </button>
        <button
          onClick={() => setActiveTab('lab')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'lab' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span className="text-sm md:text-base">Lab Results</span>
        </button>
        <button
          onClick={() => setActiveTab('meal')}
          className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'meal' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-sm md:text-base">Meal Tracker</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200">
        {activeTab === 'voice' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Voice Clinical Note</h3>
            {!audioURL ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {isRecording ? <Square className="w-16 h-16 text-white" /> : <Mic className="w-16 h-16 text-white" />}
                </div>
                {isRecording ? (
                  <>
                    <p className="text-2xl font-semibold text-gray-900 mb-2">{formatTime(recordingTime)}</p>
                    <p className="text-gray-600 mb-6">Recording in progress...</p>
                    <button onClick={stopRecording} className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      Stop Recording
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 text-lg mb-6">Click to start recording your clinical note</p>
                    <button onClick={startRecording} className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Mic className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Voice Recording</p>
                        <p className="text-sm text-gray-600">{formatTime(recordingTime)}</p>
                      </div>
                    </div>
                    <button onClick={deleteRecording} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <audio src={audioURL} controls className="w-full" />
                </div>
                {!analysis && (
                  <button onClick={analyzeVoiceNote} disabled={analyzing} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                )}
                {analysis && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                      <p className="text-gray-700">{analysis.summary}</p>
                    </div>
                    <button onClick={() => setAnalysis(null)} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                      Record Another
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Clinical Text Entry</h3>
            <textarea value={textEntry} onChange={(e) => setTextEntry(e.target.value)} className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4" placeholder="Type your clinical observations, symptoms, or notes here..." />
            <button onClick={analyzeTextEntry} disabled={analyzing || !textEntry.trim()} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {analyzing ? 'Analyzing...' : 'Analyze Entry'}
            </button>
            {analysis && (
              <div className="mt-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                  <p className="text-gray-700">{analysis.summary}</p>
                </div>
                <button onClick={() => {
                  setAnalysis(null);
                  setTextEntry('');
                }} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                  Log Another Entry
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lab' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Lab Results Analysis</h3>
            {!labFile ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FlaskConical className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Upload Lab Document</h4>
                <p className="text-gray-600 mb-6">Upload a PDF or image of your lab results</p>
                <label className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                  Select File
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleLabFileUpload} />
                </label>
              </div>
            ) : (
              <div>
                {!labAnalysis ? (
                  <div className="text-center py-8">
                    <p className="text-gray-700 mb-4">File: {labFile.name}</p>
                    <button onClick={() => analyzeLabResults(labFile)} disabled={analyzing} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                      {analyzing ? 'Analyzing...' : 'Analyze Results'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Lab Summary</h4>
                      <p className="text-gray-700">{labAnalysis.summary}</p>
                    </div>
                    <button onClick={() => {
                      setLabAnalysis(null);
                      setLabFile(null);
                    }} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                      Upload Another
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'meal' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
              <h3 className="text-xl font-semibold">Log Meal Entry</h3>
            </div>
            {!mealAnalysis ? (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Describe your meal (optional)</label>
                  <textarea value={mealDescription} onChange={(e) => setMealDescription(e.target.value)} placeholder="E.g., Grilled chicken with rice and vegetables..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-gray-900" rows={3} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload meal photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Add Meal Photos</h4>
                    <p className="text-gray-600 mb-6">Upload photos of your meals for AI analysis</p>
                    <label className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                      Select Photos
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleMealPhotoUpload} />
                    </label>
                  </div>
                </div>
                {mealPhotos.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Selected Photos ({mealPhotos.length})</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {mealPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img src={URL.createObjectURL(photo)} alt={`Meal photo ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <p className="text-sm text-gray-600 mt-1">{photo.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={analyzeMealEntry} disabled={analyzing || (mealPhotos.length === 0 && !mealDescription.trim())} className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {analyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Analyze Meal
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border border-emerald-200">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-emerald-200">
                      <div className="text-sm text-gray-600 mb-1">Calories</div>
                      <div className="text-3xl font-bold text-emerald-600">{mealAnalysis.calories}</div>
                      <div className="text-xs text-gray-500">kcal</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="text-sm text-gray-600 mb-1">Protein</div>
                      <div className="text-3xl font-bold text-red-600">{mealAnalysis.protein}</div>
                      <div className="text-xs text-gray-500">g</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">Carbs</div>
                      <div className="text-3xl font-bold text-blue-600">{mealAnalysis.carbohydrates}</div>
                      <div className="text-xs text-gray-500">g</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="text-sm text-gray-600 mb-1">Fat</div>
                      <div className="text-3xl font-bold text-yellow-600">{mealAnalysis.fat}</div>
                      <div className="text-xs text-gray-500">g</div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Meal Analysis</h4>
                  <p className="text-gray-700">{mealAnalysis.description}</p>
                </div>
                <button onClick={() => {
                  setMealAnalysis(null);
                  setMealPhotos([]);
                  setMealDescription('');
                }} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                  Log Another Meal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
