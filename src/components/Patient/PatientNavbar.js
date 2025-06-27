import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, FileText, LogOut } from 'lucide-react';

const PatientNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    navigate('/');
  };

  return (
    <nav className="backdrop-blur-md bg-blue-600/80 border-b border-white/10 shadow-md py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
        <Link to="/" className="hover:text-gray-100 transition duration-200">MediTrack</Link>
      </h1>

      <div className="flex items-center space-x-4">
        <Link 
          to="/patient-appointments" 
          className="flex items-center gap-1 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
        >
          <Calendar size={18} />
          <span className="text-sm font-medium">Appointments</span>
        </Link>

        <Link 
          to="/prescriptions" 
          className="flex items-center gap-1 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
        >
          <FileText size={18} />
          <span className="text-sm font-medium">Prescriptions</span>
        </Link>
        <Link 
          to="/patient-feedback" 
          className="flex items-center gap-1 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition"
        >
          
          <span className="text-sm font-medium">Feedback</span>
        </Link>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default PatientNavbar;
