import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from '../components/Patient/PatientNavbar';
import { useNavigate } from 'react-router-dom';
import PatientBackButton from '../components/Patient/PatientBackButton';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    specialty: '',
    doctorId: '',
    date: '',
    time: '',
    issue: '',
  });

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('patientToken');

  useEffect(() => {
    if (!token) {
      navigate('/patient-login');
    }
  }, [token, navigate]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/appointments/specialties', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSpecialties(res.data))
      .catch(() => setError('Failed to load specialties'));
  }, [token]);

  useEffect(() => {
    if (formData.specialty) {
      axios
        .get(`http://localhost:5000/api/appointments/doctors/${formData.specialty}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDoctors(res.data))
        .catch(() => setError('Failed to load doctors'));
    }
  }, [formData.specialty, token]);

  // ✅ Check if limit reached when date changes
  useEffect(() => {
    if (formData.date) {
      axios
        .get(`http://localhost:5000/api/appointments/count/${formData.date}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setLimitReached(res.data.count >= 2);
        })
        .catch(() => {
          setLimitReached(false);
        });
    }
  }, [formData.date, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLimitReached(false);

    const { specialty, doctorId, date, time, issue } = formData;

    if (!specialty || !doctorId || !date || !time || !issue) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/appointments/book', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(res.data.message);
      setFormData({ specialty: '', doctorId: '', date: '', time: '', issue: '' });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to book appointment';
      setError(errMsg);
      if (errMsg.includes('only book 2')) {
        setLimitReached(true);
      }
    }
  };

  return (
    <div>
      <PatientNavbar />
      <div className="my-5">
        <PatientBackButton />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <main className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Book Your Appointment
          </h2>

          <div className="text-center mb-6">
            <h1 className="text-lg md:text-xl font-semibold text-gray-700 bg-yellow-100 inline-block px-4 py-2 rounded">
              Patients can only book 2 appointments per day
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow-md">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Specialty *</label>
              <select
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value, doctorId: '' })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">-- Choose Specialty --</option>
                {specialties.map((spec, i) => (
                  <option key={i} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Select Doctor *</label>
              <select
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({ ...formData, doctorId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                required
                disabled={!doctors.length}
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.firstName} {doc.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Preferred Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Preferred Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Health Issue Summary *
              </label>
              <textarea
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                placeholder="Describe your symptoms..."
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full text-white p-3 rounded-md transition ${
                limitReached
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={limitReached}
            >
              {limitReached ? 'Daily Limit Reached' : 'Submit Appointment Request'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;
