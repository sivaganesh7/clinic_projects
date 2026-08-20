import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Calendar, Clock, CheckCircle2, FileText, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import PatientNavbar from '../components/Patient/PatientNavbar';
import { useNavigate, Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    upcoming: 0,
    completed: 0,
    prescriptions: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('patientToken');

  const fetchDashboardData = async () => {
    if (!token) {
      return navigate('/patient-login');
    }

    try {
      // 1. Fetch patient profile
      const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/patient/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(userRes.data);

      // 2. Fetch appointments for summary counts
      const apptRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appointments = apptRes.data || [];
      setRecentAppointments(appointments.slice(0, 3));

      // 3. Fetch prescriptions count
      const presRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/prescriptions/patient/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const prescriptions = presRes.data || [];

      const pendingCount = appointments.filter((a) =>
        ['pending', 'new'].includes((a.status || '').toLowerCase())
      ).length;
      const upcomingCount = appointments.filter((a) =>
        ['accepted', 'in-progress'].includes((a.status || '').toLowerCase())
      ).length;
      const completedCount = appointments.filter(
        (a) => (a.status || '').toLowerCase() === 'completed'
      ).length;

      setStats({
        total: appointments.length,
        pending: pendingCount,
        upcoming: upcomingCount,
        completed: completedCount,
        prescriptions: prescriptions.length,
      });
    } catch (error) {
      console.error('Error fetching patient dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('patientToken');
        navigate('/patient-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    navigate('/');
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600 bg-gray-50">
        Loading your health dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <PatientNavbar onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Heart className="h-9 w-9 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Hello, <span className="text-blue-600">{patient?.firstName} {patient?.lastName}</span> 👋
              </h2>
              <p className="text-gray-600 text-sm mt-1">Welcome back to your MediTrack health portal</p>
            </div>
          </div>
          <Link
            to="/book-appointment"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md transition transform hover:scale-[1.02]"
          >
            <Plus size={18} /> Book Appointment
          </Link>
        </div>

        {/* Health Tip Alert */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl mb-8 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm font-medium">
              <strong>Health Tip:</strong> Keep your digital prescriptions organized and adhere to doctor recommendations carefully.
            </p>
          </div>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full hidden sm:inline-block">Max 2 Bookings/Day</span>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-sm font-medium text-gray-600">Upcoming Visits</span>
              <Calendar size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.upcoming}</div>
            <p className="text-xs text-gray-400 mt-1">Confirmed appointments</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-sm font-medium text-gray-600">Pending Approval</span>
              <Clock size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
            <p className="text-xs text-gray-400 mt-1">Awaiting doctor review</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-sm font-medium text-gray-600">Completed Visits</span>
              <CheckCircle2 size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
            <p className="text-xs text-gray-400 mt-1">Consultations finished</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-purple-600 mb-2">
              <span className="text-sm font-medium text-gray-600">Prescriptions</span>
              <FileText size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.prescriptions}</div>
            <p className="text-xs text-gray-400 mt-1">Digital medical records</p>
          </div>
        </div>

        {/* Quick Action Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => navigate('/book-appointment')}
            className="bg-white hover:bg-blue-50/50 p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-blue-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Book New Appointment</h3>
              <p className="text-sm text-gray-600 mb-4">Discover specialists and choose your preferred consultation date & time.</p>
            </div>
            <span className="text-blue-600 font-semibold text-sm flex items-center gap-1">
              Book now <ArrowRight size={16} />
            </span>
          </div>

          <div
            onClick={() => navigate('/prescriptions')}
            className="bg-white hover:bg-purple-50/50 p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-purple-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Digital Prescriptions</h3>
              <p className="text-sm text-gray-600 mb-4">Access medications, dosage instructions, and download consultation records.</p>
            </div>
            <span className="text-purple-600 font-semibold text-sm flex items-center gap-1">
              View records <ArrowRight size={16} />
            </span>
          </div>

          <div
            onClick={() => navigate('/patient-feedback')}
            className="bg-white hover:bg-emerald-50/50 p-6 rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-emerald-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Feedback History</h3>
              <p className="text-sm text-gray-600 mb-4">Review all feedback and star ratings submitted for your consultations.</p>
            </div>
            <span className="text-emerald-600 font-semibold text-sm flex items-center gap-1">
              Review feedback <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* Recent Activity Section */}
        {recentAppointments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Appointments</h3>
              <Link to="/patient-appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentAppointments.map((appt) => (
                <div key={appt._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {appt.doctor?.name || 'Doctor Consultation'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {appt.doctor?.specialization} • {appt.date} at {appt.time}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${
                      ['pending', 'new'].includes((appt.status || '').toLowerCase())
                        ? 'bg-amber-100 text-amber-800'
                        : ['accepted', 'in-progress'].includes((appt.status || '').toLowerCase())
                        ? 'bg-blue-100 text-blue-800'
                        : appt.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {appt.status?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
