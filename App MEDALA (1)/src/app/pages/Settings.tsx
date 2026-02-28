import { User, Stethoscope, Bell, AlertTriangle, Calendar, Database } from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const [alerts, setAlerts] = useState({
    criticalHealth: true,
    medicationReminders: true,
    appointmentReminders: true,
    weeklyHealthSummary: true,
  });

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Settings</h1>
        <p className="text-gray-600">Configure your MEDALA preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold">Account Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Profile Information */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium mb-1">Profile Information</div>
              <div className="text-sm text-gray-600">Update your health profile and medical history</div>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">Edit Profile</button>
          </div>

          {/* Healthcare Provider */}
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-medium mb-1">Healthcare Provider</div>
              <div className="text-sm text-gray-600">Manage your primary care physician details</div>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">Update</button>
          </div>
        </div>
      </div>

      {/* Clinical Alerts */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold">Clinical Alerts</h2>
        </div>

        <div className="space-y-4">
          {/* Critical Health Alerts */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium mb-1">Critical Health Alerts</div>
              <div className="text-sm text-gray-600">Get notified of critical health metrics</div>
            </div>
            <button
              onClick={() => toggleAlert('criticalHealth')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                alerts.criticalHealth ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alerts.criticalHealth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Medication Reminders */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium mb-1">Medication Reminders</div>
              <div className="text-sm text-gray-600">Reminders for medication adherence</div>
            </div>
            <button
              onClick={() => toggleAlert('medicationReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                alerts.medicationReminders ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alerts.medicationReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Appointment Reminders */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium mb-1">Appointment Reminders</div>
              <div className="text-sm text-gray-600">Notifications for upcoming appointments</div>
            </div>
            <button
              onClick={() => toggleAlert('appointmentReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                alerts.appointmentReminders ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alerts.appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Weekly Health Summary */}
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-medium mb-1">Weekly Health Summary</div>
              <div className="text-sm text-gray-600">Receive weekly AI-generated insights</div>
            </div>
            <button
              onClick={() => toggleAlert('weeklyHealthSummary')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                alerts.weeklyHealthSummary ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  alerts.weeklyHealthSummary ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold">Data Management</h2>
        </div>

        <div className="space-y-4">
          {/* Export Clinical Data */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium mb-1">Export Clinical Data</div>
              <div className="text-sm text-gray-600">Download all your health records and notes</div>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">Export</button>
          </div>

          {/* Data Retention */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium mb-1">Data Retention Policy</div>
              <div className="text-sm text-gray-600">Manage how long your data is stored</div>
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 font-medium">Configure</button>
          </div>

          {/* Delete Account */}
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-medium mb-1 text-red-600">Delete Account</div>
              <div className="text-sm text-gray-600">Permanently remove your account and all data</div>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}