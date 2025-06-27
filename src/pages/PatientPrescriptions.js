import React, { useState, useEffect } from 'react';
import { Download, MessageCircle } from 'lucide-react';
import axios from 'axios';
import PatientNavbar from '../components/Patient/PatientNavbar';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState({});
  const [showFormId, setShowFormId] = useState(null);

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
          if (fb.appointmentId) feedbackMap[fb.appointmentId] = true;
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
    const prescriptionData = `
Prescription Details
Doctor: ${prescription.doctor?.name || prescription.doctor}
Date: ${new Date(prescription.date).toLocaleDateString()}
Medicines: ${prescription.medicines
      .map((med) => `${med.name} - ${med.dosage} (${med.frequency})`)
      .join(', ')}
Notes: ${prescription.notes || 'N/A'}
    `;
    const blob = new Blob([prescriptionData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription_${prescription._id}.txt`;
    link.click();
  };

const handleSubmitFeedback = async (prescription, rating, comments) => {
  try {
    const token = localStorage.getItem('patientToken');

    if (!prescription.appointmentId) {
      throw new Error('No associated appointment found for this prescription');
    }

    // Ensure doctorId is a valid ObjectId; fallback to null if not an object
    const doctorId = typeof prescription.doctor === 'object' && prescription.doctor._id
      ? prescription.doctor._id
      : null; // This will be caught by backend validation

    if (!doctorId) {
      throw new Error('Invalid doctor ID');
    }

    await axios.post(
      'http://localhost:5000/api/feedbacks',
      {
        appointmentId: prescription.appointmentId,
        doctorId,
        rating,
        comments,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSubmittedFeedbacks((prev) => ({
      ...prev,
      [prescription.appointmentId]: true,
    }));
    setShowFormId(null);
    return true;
  } catch (err) {
    console.error('Feedback error:', err.response?.data || err.message);
    return false;
  }
};

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <PatientNavbar />
      <div className="text-center mb-6 mt-5">
        <h1 className="text-3xl font-bold text-gray-800">My Prescriptions</h1>
        <p className="text-gray-600 mt-1">Review and manage your prescription history</p>
      </div>

      <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-md">
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
                <div>
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
                    <div className="text-green-600 text-sm mt-2">Feedback Submitted</div>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          prescription.appointmentId
                            ? setShowFormId(showFormId === prescription._id ? null : prescription._id)
                            : alert('No associated appointment found for feedback')
                        }
                        className="flex flex-col items-center text-gray-600 hover:text-gray-800 transition"
                      >
                        <MessageCircle size={22} />
                        <span className="text-xs mt-1">Feedback</span>
                      </button>

                      {showFormId === prescription._id && (
                        <form
                          className="mt-4 bg-blue-100 p-4 rounded-md w-full"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const rating = e.target.rating.value;
                            const comments = e.target.comments.value;
                            
                            const success = await handleSubmitFeedback(prescription, rating, comments);
                            
                            if (success) {
                              alert('Feedback submitted successfully');
                            } else {
                              alert('Submission failed. Please check if this prescription has an associated appointment.');
                            }
                          }}
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor:</label>
                            <input
                              type="text"
                              disabled
                              value={typeof prescription.doctor === 'object' ? prescription.doctor.name : prescription.doctor}
                              className="w-full mb-3 p-2 border rounded bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1–5):</label>
                            <select name="rating" required className="w-full mb-3 p-2 border rounded">
                              <option value="">Select Rating</option>
                              {[1, 2, 3, 4, 5].map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comments:</label>
                            <textarea
                              name="comments"
                              maxLength="150"
                              rows="3"
                              className="w-full mb-3 p-2 border rounded"
                              placeholder="Optional (max 150 characters)"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;