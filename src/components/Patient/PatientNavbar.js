import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, FileText, LogOut, Menu, X } from 'lucide-react';

const PatientNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-600/80 backdrop-blur-md border-b border-white/10 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white tracking-tight">
          <Link to="/" className="hover:text-gray-100">MediTrack</Link>
        </h1>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/patient-dashboard" className="flex items-center gap-1 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition">
            <Calendar size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link to="/patient-appointments" className="flex items-center gap-1 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition">
            <Calendar size={18} />
            <span className="text-sm font-medium">Appointments</span>
          </Link>
          <Link to="/prescriptions" className="flex items-center gap-1 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition">
            <FileText size={18} />
            <span className="text-sm font-medium">Prescriptions</span>
          </Link>
          <Link to="/patient-feedback" className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition text-sm font-medium">
            Feedback
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition">
            <LogOut size={18} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-blue-600/90 text-white">
          <Link to="/patient-dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Dashboard</Link>
          <Link to="/patient-appointments" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Appointments</Link>
          <Link to="/prescriptions" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Prescriptions</Link>
          <Link to="/patient-feedback" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-white/10">Feedback</Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded bg-red-500 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default PatientNavbar;
