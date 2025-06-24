import React, { useState } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const HomeNavbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">MediTrack Lite</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/patient-login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Patient Login
            </Link>
            <Link
              to="/doctor-login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Doctor Login
            </Link>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-10" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col space-y-3 pb-5">
            <Link
              to="/patient-login"
              className="block bg-green-600 text-white text-center px-2 py-2 rounded hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Patient Login
            </Link>
            <Link
              to="/doctor-login"
              className="block bg-blue-600 text-white text-center px-2 py-2 rounded hover:bg-orange-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Doctor Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
