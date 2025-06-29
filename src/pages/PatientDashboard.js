import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import PatientNavbar from '../components/Patient/PatientNavbar';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem('patientToken');
      if (!token) {
        return navigate('/patient-login');
      }

      const response = await axios.get('http://localhost:5000/api/patient/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      navigate('/patient-login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    navigate('/');
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <PatientNavbar onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <Heart className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="text-4xl font-extrabold text-gray-900 mt-4">
            Hello, <span className="text-blue-700">{patient.firstName} {patient.lastName}</span> 👋
          </h2>
          <p className="text-lg text-gray-600 mt-2">Welcome back to your health dashboard</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-xl mb-8 shadow-sm">
          <p className="text-blue-800 font-medium">
            💡 <strong>Daily Tip:</strong> Stay hydrated and follow your medication schedule diligently!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            onClick={() => navigate('/book-appointment')}
            className="bg-gradient-to-tr from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-8 rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <h3 className="text-2xl font-bold mb-2">📅 Book Appointment</h3>
            <p className="text-sm text-blue-100">Schedule your visit with a healthcare provider</p>
          </div>
          <div
            onClick={() => navigate('/patient-appointments')}
            className="bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white p-8 rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <h3 className="text-2xl font-bold mb-2">📖 View Appointments</h3>
            <p className="text-sm text-emerald-100">Check your upcoming and completed appointments</p>
          </div>
        </div>

      <div className="text-center mb-8">
  <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
    Patients can only book 2 appointments per day
  </h1>
</div>

        {/* <div className="bg-white p-6 rounded-xl shadow-xl grid grid-cols-1 gap-6 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">📌 Upcoming Appointments</span>
            <span className="font-bold text-blue-600">{patient.upcomingAppointments || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">✅ Completed Visits</span>
            <span className="font-bold text-green-600">{patient.completedVisits || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">💊 Active Prescriptions</span>
            <span className="font-bold text-purple-600">{patient.activePrescriptions || 0}</span>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default PatientDashboard;
