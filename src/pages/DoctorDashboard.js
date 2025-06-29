import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare } from 'lucide-react';
import DoctorNavbar from '../components/Doctor/DoctorNavbar';
import axios from 'axios';

const DoctorDashboard = () => {
  const [doctorName, setDoctorName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!token) return;

      try {
        const res = await axios.get('/api/doctor/me', {
          baseURL: 'http://localhost:5000', // Explicitly set backend URL
          headers: { Authorization: `Bearer ${token}` },
        });
        const fullName = `${res.data.firstName} ${res.data.lastName}`;
        setDoctorName(fullName);
        localStorage.setItem('doctorName', fullName); // Update local storage
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        const storedName = localStorage.getItem('doctorName');
        setDoctorName(storedName || 'Doctor');
      }
    };

    const storedName = localStorage.getItem('doctorName');
    if (storedName) {
      setDoctorName(storedName);
    } else if (token) {
      fetchDoctorProfile();
    } else {
      setDoctorName('Doctor');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome, Dr. {doctorName}
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 mt-3 border-blue-500">
            <p className="text-gray-600 italic text-lg">
              "The good physician treats the disease; the great physician treats the patient. – William Osler"
            </p>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-5 mt-5">
          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col h-80 justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Appointments</h2>
              </div>
              <p className="text-gray-600 mb-3 leading-relaxed flex-grow">
                Manage your patient appointments, accept new requests, and track progress.
              </p>
            </div>
            <Link
              to="/doctor-appointment"
              className="w-full bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Appointments
            </Link>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col h-80 justify-between">
            <div>
              <div className="flex items-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Patient Feedback</h2>
              </div>
              <p className="text-gray-600 mb-3 leading-relaxed flex-grow">
                Review feedback from your patients and improve your care quality.
              </p>
            </div>
            <Link
              to="/doctor-feedback"
              className="w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View Feedback
            </Link>
          </div>
        </div>

        {/* Statistic Cards */}
        {/* <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600 font-medium">New Appointments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">8</div>
            <div className="text-gray-600 font-medium">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">45</div>
            <div className="text-gray-600 font-medium">Completed Today</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DoctorDashboard;