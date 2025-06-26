import React, { useState } from 'react';
import { Heart, Stethoscope } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.baseURL = 'http://localhost:5000'; // Backend server URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email.endsWith('@meditrack.local')) {
      setError('Email must end with @meditrack.local');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // 🔐 Login API
      const res = await axios.post('/api/doctor/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token, doctor } = res.data;
      const fullName = `${doctor.firstName} ${doctor.lastName}`;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('doctorName', fullName);

      navigate('/doctor-dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials or server error.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 px-4 py-2 border rounded-md transition-all hover:bg-blue-100 hover:shadow"
        >
          ← Back to Home
        </button>

        <div className="text-center mt-6">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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