import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from '../components/Patient/PatientNavbar';
import { useNavigate } from 'react-router-dom';
import PatientBackButton from '../components/Patient/PatientBackButton';
import { Stethoscope, Award, Briefcase, Mail } from 'lucide-react';

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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('patientToken');

  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!token) {
      navigate('/patient-login');
    }
  }, [token, navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/appointments/specialties`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSpecialties(res.data))
      .catch(() => setError('Failed to load specialties'));
  }, [token]);

  useEffect(() => {
    if (formData.specialty) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/appointments/doctors/${formData.specialty}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDoctors(res.data);
          setSelectedDoctor(null);
        })
        .catch(() => {
          setDoctors([]);
          setSelectedDoctor(null);
          setError('Failed to load doctors');
        });
    } else {
      setDoctors([]);
      setSelectedDoctor(null);
    }
  }, [formData.specialty, token]);

  // Update selectedDoctor details when doctorId changes
  useEffect(() => {
    if (formData.doctorId && doctors.length > 0) {
      const found = doctors.find((d) => d._id === formData.doctorId);
      setSelectedDoctor(found || null);
    } else {
      setSelectedDoctor(null);
    }
  }, [formData.doctorId, doctors]);

  // Check if daily limit reached when date changes
  useEffect(() => {
    if (formData.date) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/appointments/count/${formData.date}`, {
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

    const { specialty, doctorId, date, time, issue } = formData;

    if (!specialty || !doctorId || !date || !time || !issue) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/appointments/book`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(res.data.message || 'Appointment request booked successfully!');
      setFormData({ specialty: '', doctorId: '', date: '', time: '', issue: '' });
      setSelectedDoctor(null);
      setTimeout(() => {
        navigate('/patient-appointments');
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to book appointment';
      setError(errMsg);
      if (errMsg.includes('only book 2')) {
        setLimitReached(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PatientNavbar />
      <div className="my-5">
        <PatientBackButton />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <main className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Book Your Appointment
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Find qualified doctors, select your preferred schedule, and book a consultation.
          </p>

          <div className="text-center mb-6">
            <h1 className="text-sm md:text-base font-medium text-blue-800 bg-blue-100 inline-block px-4 py-2 rounded-full border border-blue-200">
              📌 Patients can book up to 2 appointments per day
            </h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 mb-4 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 mb-4 rounded-lg text-sm">
              ✅ {success}
            </div>
          )}

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  1. Select Specialty <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value, doctorId: '' })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                <label className="block text-gray-700 font-medium mb-1">
                  2. Select Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  disabled={!doctors.length}
                >
                  <option value="">
                    {formData.specialty
                      ? doctors.length
                        ? '-- Choose Doctor --'
                        : 'No doctors found in this specialty'
                      : '-- Select a specialty first --'}
                  </option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.firstName} {doc.lastName} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Doctor Profile Preview Card */}
              {selectedDoctor && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">
                      {selectedDoctor.firstName?.[0]}
                      {selectedDoctor.lastName?.[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">
                        Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                      </h4>
                      <p className="text-blue-700 font-medium text-sm flex items-center gap-1 mt-0.5">
                        <Stethoscope size={16} /> {selectedDoctor.specialization}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                        {selectedDoctor.qualification && (
                          <div className="flex items-center gap-1.5">
                            <Award size={16} className="text-gray-400" />
                            <span><strong>Qualification:</strong> {selectedDoctor.qualification}</span>
                          </div>
                        )}
                        {selectedDoctor.experience && (
                          <div className="flex items-center gap-1.5">
                            <Briefcase size={16} className="text-gray-400" />
                            <span><strong>Experience:</strong> {selectedDoctor.experience}</span>
                          </div>
                        )}
                        {selectedDoctor.email && (
                          <div className="flex items-center gap-1.5 col-span-full">
                            <Mail size={16} className="text-gray-400" />
                            <span><strong>Email:</strong> {selectedDoctor.email}</span>
                          </div>
                        )}
                      </div>

                      {selectedDoctor.bio && (
                        <p className="text-xs text-gray-500 mt-2 bg-white/70 p-2 rounded border border-blue-100">
                          {selectedDoctor.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    3. Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayString}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    4. Preferred Time (24h) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  5. Health Issue / Reason for Visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  placeholder="Describe your symptoms, consultation purpose, or health concern..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full text-white font-medium p-3.5 rounded-lg transition-all shadow-md ${
                  limitReached || submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
                disabled={limitReached || submitting}
              >
                {submitting
                  ? 'Booking Appointment...'
                  : limitReached
                  ? 'Daily Limit Reached (Max 2)'
                  : 'Confirm & Book Appointment'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;
