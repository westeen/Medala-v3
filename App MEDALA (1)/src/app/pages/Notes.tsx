import { FileText, Download } from 'lucide-react';

export function Notes() {
  const notes = [
    {
      id: 1,
      title: 'Hypertension',
      date: 'February 27, 2026 at 07:47 PM',
      tags: [
        { label: 'Elevated Risk', color: 'red' },
        { label: 'Voice Note', color: 'blue' },
      ],
      sections: {
        subjective: 'Patient reports dizziness and fatigue over the past 3 days. Sleep has been inconsistent (5-6 hours/night). Patient acknowledges missing medication doses on Tuesday and Thursday.',
        objective: 'BP 152/95 mmHg. Medication adherence inconsistent (missed 2 doses this week).',
        assessment: 'Possible uncontrolled hypertension with medication non-adherence. Sleep deprivation may be contributing factor.',
        plan: 'Recommend medication review and reinforcement of adherence protocol. Cardiology follow-up within 2-4 weeks. Sleep hygiene assessment recommended. Monitor BP daily for next 7 days.',
      },
    },
    {
      id: 2,
      title: 'Diabetes & Hypertension',
      date: 'February 20, 2026 at 07:47 PM',
      tags: [
        { label: 'Monitor Risk', color: 'orange' },
        { label: 'Text Entry', color: 'purple' },
      ],
      sections: {
        subjective: 'Patient reports improved energy levels. Morning glucose readings have been stable. No recent episodes of dizziness.',
        objective: 'BP 138/88 mmHg. Fasting glucose 128 mg/dL. Medication adherence 95% over past week.',
        assessment: 'Improved blood pressure control with better medication adherence. Glucose levels remain slightly elevated but showing improvement.',
        plan: 'Continue current medication regimen. Encourage continued adherence. Dietary consultation scheduled for next week. Follow-up in 2 weeks.',
      },
    },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Clinical Notes</h1>
        <p className="text-gray-600">Your clinical documentation history</p>
      </div>

      {/* Notes List */}
      <div className="space-y-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Note Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{note.title}</h3>
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs ${
                            tag.color === 'red'
                              ? 'bg-red-100 text-red-700'
                              : tag.color === 'orange'
                              ? 'bg-orange-100 text-orange-700'
                              : tag.color === 'blue'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{note.date}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Note Content */}
            <div className="p-6 space-y-4">
              {/* Subjective */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="text-xs font-semibold text-blue-700 mb-2">S – SUBJECTIVE</div>
                <p className="text-gray-700">{note.sections.subjective}</p>
              </div>

              {/* Objective */}
              <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4">
                <div className="text-xs font-semibold text-teal-700 mb-2">O – OBJECTIVE</div>
                <p className="text-gray-700">{note.sections.objective}</p>
              </div>

              {/* Assessment */}
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                <div className="text-xs font-semibold text-orange-700 mb-2">A – ASSESSMENT</div>
                <p className="text-gray-700">{note.sections.assessment}</p>
              </div>

              {/* Plan */}
              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
                <div className="text-xs font-semibold text-purple-700 mb-2">P – PLAN</div>
                <p className="text-gray-700">{note.sections.plan}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documentation Standard Note */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 flex gap-3">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs">i</span>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Clinical Documentation Standard</span>
          <br />
          All notes follow standard SOAP format (Subjective, Objective, Assessment, Plan) for consistency with medical documentation practices.
        </div>
      </div>
    </div>
  );
}