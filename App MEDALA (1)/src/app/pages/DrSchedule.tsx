import { Calendar, Clock, MapPin, Phone, Plus, AlertCircle, CheckCircle } from 'lucide-react';

export function DrSchedule() {
  const aiRecommendedAppointments = [
    {
      type: 'Cardiology',
      priority: 'urgent',
      reason: 'Elevated blood pressure readings for 3+ consecutive days',
      recommendedTimeframe: 'Within 2-4 weeks',
      status: 'pending',
    },
    {
      type: 'Endocrinology',
      priority: 'routine',
      reason: 'Quarterly diabetes management review and HbA1c trending above target',
      recommendedTimeframe: 'Within 4-6 weeks',
      status: 'pending',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Mitchell',
      specialty: 'Primary Care Physician',
      date: '2026-03-15',
      time: '10:00 AM',
      location: 'Main Street Medical Center',
      address: '123 Main St, Suite 200',
      phone: '(555) 123-4567',
      status: 'confirmed',
      type: 'Follow-up',
    },
    {
      id: 2,
      doctor: 'Dr. James Rodriguez',
      specialty: 'Cardiologist',
      date: '2026-03-22',
      time: '2:30 PM',
      location: 'Heart & Vascular Institute',
      address: '456 Oak Avenue',
      phone: '(555) 987-6543',
      status: 'confirmed',
      type: 'Consultation',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2">Doctor Schedule</h1>
          <p className="text-gray-600">Manage appointments and view AI recommendations</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors w-full md:w-auto justify-center">
          <Plus className="w-5 h-5" />
          Add Appointment
        </button>
      </div>

      {/* AI Recommendations */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold">AI Recommended Appointments</h2>
        </div>

        <div className="space-y-4">
          {aiRecommendedAppointments.map((rec, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 border-2 ${
                rec.priority === 'urgent' ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold">{rec.type}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.priority === 'urgent'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-orange-200 text-orange-800'
                      }`}
                    >
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Reason:</span> {rec.reason}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Recommended:</span> {rec.recommendedTimeframe}
                  </p>
                </div>
                <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap">
                  Schedule Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
        </div>

        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                {/* Left Side - Main Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold">{appointment.doctor}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{appointment.specialty}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{appointment.location}</div>
                        <div className="text-sm text-gray-500">{appointment.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                    Reschedule
                  </button>
                  <button className="flex-1 lg:flex-none px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
