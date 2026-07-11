import React, { useState, useEffect } from 'react';
import { Download, MessageCircle } from 'lucide-react';
import axios from 'axios';
import PatientNavbar from '../components/Patient/PatientNavbar';
import PatientBackButton from '../components/Patient/PatientBackButton';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  const [showFormId, setShowFormId] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: '', comments: '' });
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        const response = await axios.get('http://localhost:5000/api/prescriptions/patient/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescriptions(response.data.reverse());
      } catch (err) {
        setError('Failed to fetch prescriptions. Please try again.');
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('patientToken');
        const res = await axios.get('http://localhost:5000/api/feedbacks/patient/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const feedbackMap = {};
        res.data.forEach((fb) => {
          const apptId = fb.appointment?._id || fb.appointmentId;
          if (apptId) feedbackMap[apptId] = true;
        });
        setSubmittedFeedbacks(feedbackMap);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };

    fetchPrescriptions();
    fetchFeedbacks();
  }, []);

  const handleDownload = (prescription) => {
    const doctorName = typeof prescription.doctor === 'object'
      ? prescription.doctor.name
      : prescription.doctor;
    const prescriptionData = `
Prescription Details
====================
Doctor: ${doctorName}
Date: ${new Date(prescription.date).toLocaleDateString()}
Medicines:
${prescription.medicines
  .map((med) => `  - ${med.name} | ${med.dosage} | ${med.frequency}`)
  .join('\n')}
Notes: ${prescription.notes || 'N/A'}
    `;
    const blob = new Blob([prescriptionData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription_${prescription._id}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmitFeedback = async (e, prescription) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');

    const rating = parseInt(feedbackData.rating);
    if (!rating || rating < 1 || rating > 5) {
      setFeedbackError('Rating must be between 1 and 5');
      return;
    }

    if (!prescription.appointmentId) {
      setFeedbackError('No associated appointment found for this prescription');
      return;
    }

    const doctorId = typeof prescription.doctor === 'object' && prescription.doctor._id
      ? prescription.doctor._id
      : null;

    if (!doctorId) {
      setFeedbackError('Unable to identify doctor for feedback');
      return;
    }

    try {
      const token = localStorage.getItem('patientToken');
      await axios.post(
        'http://localhost:5000/api/feedbacks',
        {
          appointmentId: prescription.appointmentId,
          doctorId,
          rating,
          comments: feedbackData.comments,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmittedFeedbacks((prev) => ({
        ...prev,
        [prescription.appointmentId]: true,
      }));
      setFeedbackSuccess('Feedback submitted successfully!');
      setFeedbackData({ rating: '', comments: '' });
      setTimeout(() => {
        setShowFormId(null);
        setFeedbackSuccess('');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit feedback';
      setFeedbackError(msg);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div>
      <PatientNavbar />
      <div className="my-5">
        <PatientBackButton />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">

        <div className="text-center mb-6 mt-5">
          <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
          <p className="text-gray-600 mt-1">Review and manage your prescription history</p>
        </div>

        <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-md max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Prescription History</h2>

          {prescriptions.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No prescriptions found.</p>
          ) : (
            prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="rounded-lg bg-white shadow hover:shadow-lg transition-all p-5 mb-5 border-l-4 border-blue-600"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1" />
                      <h3 className="font-semibold text-lg text-gray-800">
                        {typeof prescription.doctor === 'object'
                          ? prescription.doctor.name
                          : prescription.doctor}
                      </h3>
                      <span className="text-sm text-gray-400">
                        RX-{prescription._id?.slice(-4)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(prescription.date).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                    <p className="mt-2 text-gray-700">
                      <span className="font-medium">Diagnosis:</span> {prescription.notes || 'N/A'}
                    </p>

                    <div className="mt-3">
                      <p className="font-medium text-gray-800 mb-1">Medications:</p>
                      {Array.isArray(prescription.medicines) ? (
                        prescription.medicines.map((med, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            - {med.name || 'Unknown'} | {med.dosage || 'N/A'} ({med.frequency || 'N/A'})
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No medications listed.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 ml-4">
                    <button
                      onClick={() => handleDownload(prescription)}
                      className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition"
                    >
                      <Download size={22} />
                      <span className="text-xs mt-1">Download</span>
                    </button>

                    {submittedFeedbacks[prescription.appointmentId] ? (
                      <div className="text-green-600 text-sm mt-2 font-medium">✅ Feedback Submitted</div>
                    ) : (
                      <button
                        onClick={() => {
                          if (prescription.appointmentId) {
                            setShowFormId(showFormId === prescription._id ? null : prescription._id);
                            setFeedbackData({ rating: '', comments: '' });
                            setFeedbackError('');
                            setFeedbackSuccess('');
                          } else {
                            alert('No associated appointment found for feedback');
                          }
                        }}
                        className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition"
                      >
                        <MessageCircle size={22} />
                        <span className="text-xs mt-1">Feedback</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Feedback Form */}
                {showFormId === prescription._id && !submittedFeedbacks[prescription.appointmentId] && (
                  <form
                    onSubmit={(e) => handleSubmitFeedback(e, prescription)}
                    className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3">Submit Your Feedback</h4>

                    {feedbackError && (
                      <div className="bg-red-100 text-red-700 px-3 py-2 mb-3 rounded text-sm">
                        ⚠️ {feedbackError}
                      </div>
                    )}
                    {feedbackSuccess && (
                      <div className="bg-green-100 text-green-700 px-3 py-2 mb-3 rounded text-sm">
                        ✅ {feedbackSuccess}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="block font-medium text-gray-700 mb-1">
                        Rating (1-5) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                            className={`w-10 h-10 rounded-full text-lg font-bold transition-all ${
                              feedbackData.rating >= star
                                ? 'bg-yellow-400 text-white shadow-md scale-110'
                                : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Comments (optional)</label>
                      <textarea
                        value={feedbackData.comments}
                        onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                        className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Share your experience with the doctor..."
                        rows={3}
                        maxLength={150}
                      />
                      <p className="text-xs text-gray-400 mt-1">{feedbackData.comments.length}/150 characters</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={!feedbackData.rating}
                        className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                          feedbackData.rating
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Submit Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowFormId(null);
                          setFeedbackError('');
                          setFeedbackSuccess('');
                        }}
                        className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;