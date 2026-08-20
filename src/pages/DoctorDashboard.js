import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, FileText, CheckCircle2, Clock, Star, ArrowRight, UserCheck } from 'lucide-react';
import DoctorNavbar from '../components/Doctor/DoctorNavbar';
import axios from 'axios';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalAppointments: 0,
    prescriptions: 0,
    feedbacksCount: 0,
    avgRating: 'N/A',
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate('/doctor-login');
        return;
      }

      try {
        // 1. Fetch Doctor Profile
        const profileRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/doctor/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(profileRes.data);
        const fullName = `${profileRes.data.firstName} ${profileRes.data.lastName}`;
        localStorage.setItem('doctorName', fullName);

        // 2. Fetch Appointments
        const apptRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointments = apptRes.data || [];

        const pending = appointments.filter((a) =>
          ['pending', 'new'].includes((a.status || '').toLowerCase())
        ).length;
        const inProgress = appointments.filter((a) =>
          ['accepted', 'in-progress'].includes((a.status || '').toLowerCase())
        ).length;
        const completed = appointments.filter(
          (a) => (a.status || '').toLowerCase() === 'completed'
        ).length;

        // 3. Fetch Prescriptions
        const presRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/prescriptions/doctor/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const prescriptions = presRes.data || [];

        // 4. Fetch Feedbacks
        const fbRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/feedbacks/doctor/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const feedbacks = fbRes.data || [];
        const avg = feedbacks.length > 0
          ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
          : 'N/A';

        setStats({
          pending,
          inProgress,
          completed,
          totalAppointments: appointments.length,
          prescriptions: prescriptions.length,
          feedbacksCount: feedbacks.length,
          avgRating: avg,
        });
      } catch (err) {
        console.error('Error fetching doctor dashboard data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/doctor-login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading doctor dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Doctor Practice Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Welcome, Dr. {doctor?.firstName} {doctor?.lastName}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Specialization: <strong className="text-gray-800">{doctor?.specialization || 'Healthcare Specialist'}</strong>
              {doctor?.qualification && ` • ${doctor.qualification}`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/doctor-appointment"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md transition"
            >
              Manage Appointments
            </Link>
            <Link
              to="/doctor-profile"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-sm font-medium text-gray-600">Pending Requests</span>
              <Clock size={22} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
            <p className="text-xs text-gray-400 mt-1">Requires approval</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-sm font-medium text-gray-600">In Progress / Accepted</span>
              <UserCheck size={22} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.inProgress}</div>
            <p className="text-xs text-gray-400 mt-1">Active consultations</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-sm font-medium text-gray-600">Completed Visits</span>
              <CheckCircle2 size={22} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
            <p className="text-xs text-gray-400 mt-1">Consultations finished</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-yellow-500 mb-2">
              <span className="text-sm font-medium text-gray-600">Patient Rating</span>
              <Star size={22} className="fill-yellow-400 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.avgRating} <span className="text-sm text-gray-400 font-normal">/ 5.0</span></div>
            <p className="text-xs text-gray-400 mt-1">{stats.feedbacksCount} patient reviews</p>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Appointments Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                  <Calendar size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Review incoming patient appointment requests, accept or reject schedules, and complete consultations.
              </p>
            </div>
            <Link
              to="/doctor-appointment"
              className="w-full bg-blue-600 text-white text-center py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-1"
            >
              Manage Appointments <ArrowRight size={16} />
            </Link>
          </div>

          {/* Prescriptions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-3">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Prescriptions</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                View previously generated digital prescriptions, medication records, and dosage instructions.
              </p>
            </div>
            <Link
              to="/doctor-prescriptions"
              className="w-full bg-purple-600 text-white text-center py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center gap-1"
            >
              View Prescriptions <ArrowRight size={16} />
            </Link>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-3">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Patient Feedback</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Check ratings and feedback submitted by patients after completed consultations to improve care quality.
              </p>
            </div>
            <Link
              to="/doctor-feedback"
              className="w-full bg-emerald-600 text-white text-center py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center justify-center gap-1"
            >
              Review Feedback <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;