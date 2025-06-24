import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PatientNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('patientToken'); // remove token
    navigate('/'); // redirect to home
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-extrabold text-white tracking-tight">
        <Link to="/" className="hover:text-blue-200 transition-colors duration-300">MediTrack</Link>
      </h1>
      <div className="flex items-center space-x-6">
        <Link 
          to="/patient-appointments" 
          className="text-white text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300"
        >
          Appointments
        </Link>
        <Link 
          to="/prescriptions" 
          className="text-white text-sm font-medium hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300"
        >
          Prescriptions
        </Link>
        <button 
          onClick={handleLogout} 
          className="text-white text-sm font-semibold bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default PatientNavbar;
