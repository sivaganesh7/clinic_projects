import React, { useState } from 'react';
import { Heart, Stethoscope } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validate email domain
    if (!formData.email.endsWith('@meditrack.local')) {
      setError('Email must end with @meditrack.local');
      return;
    }

    // ✅ Validate password
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    // ✅ Clear error
    setError('');

    // 🧠 API call to login can go here
    console.log('Doctor login:', formData);

    // ✅ On success, navigate
    navigate('/doctor-dashboard');
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 px-4 py-2 border border-solid rounded-md bg-red transition-all duration-300 hover:bg-blue-200 hover:text-blue-700 hover:shadow-md"
        >
          ← Back to Home
        </button>

        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">MediTrack Lite</h2>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">Welcome Back, Doctor</h3>
          <p className="mt-2 text-gray-600">Sign in to your doctor account</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center mb-4">
            <Stethoscope className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Doctor Login</h3>
          </div>
          <p className="text-gray-600 mb-6">Enter your credentials to access your dashboard</p>

          {/* ✅ Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="doctor.email@meditrack.local"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/doctor-register" className="text-green-600 hover:text-green-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
