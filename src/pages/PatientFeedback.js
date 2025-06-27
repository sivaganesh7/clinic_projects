import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from '../components/Patient/PatientNavbar';

const PatientFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        const res = await axios.get('http://localhost:5000/api/feedbacks/patient/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load feedbacks.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <PatientNavbar />
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Feedbacks</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-gray-500">You haven't submitted any feedback yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-700">
                  Dr. {fb.doctor?.name || 'Doctor'} ({fb.doctor?.specialization || 'Specialist'})
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Rating: ⭐ {fb.rating} / 5</p>
              {fb.comment && <p className="text-gray-700 italic">“{fb.comment}”</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientFeedbacks;
