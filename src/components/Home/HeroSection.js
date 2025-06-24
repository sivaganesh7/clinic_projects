import React from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your Health Journey, <span className="text-blue-600">Simplified</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with trusted doctors, book appointments effortlessly, and manage your 
          healthcare with confidence. Welcome to the future of clinic management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/patient-register')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Join as a Patient
            <Calendar className="ml-2 h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('/doctor-register')}
            className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200"
          >
            Join as Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
