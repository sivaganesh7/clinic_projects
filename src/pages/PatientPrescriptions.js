import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../components/Patient/PatientNavbar";
import { useNavigate } from "react-router-dom";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [feedback, setFeedback] = useState({}); // Added feedback state
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your prescriptions.");
      return;
    }

    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/prescriptions/patient/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescriptions(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Failed to fetch prescriptions. Please try again.");
        }
      }
    };

    fetchPrescriptions();
  }, [token, navigate]); // Added navigate to dependency array

  const handleFeedbackSubmit = async (id) => {
    const { rating, comment } = feedback[id] || {};
    try {
      await axios.post("http://localhost:5000/api/prescriptions/feedback", {
        appointmentId: id,
        rating,
        comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Feedback submitted!");
      setFeedback(prev => ({ ...prev, [id]: {} })); // Clear feedback for this ID
    } catch (error) {
      alert(error?.response?.data?.message || "Submission failed");
    }
  };

  const downloadPrescription = (prescription) => {
    const text = `
      Doctor: ${prescription.doctor}
      Date: ${new Date(prescription.date).toLocaleDateString()}
      Notes: ${prescription.notes}

      Medications:
      ${prescription.medicines.map(m => `- ${m.name} | ${m.dosage} | ${m.frequency}`).join("\n")}
    `;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Prescription_${prescription._id}.txt`;
    link.click();
  };

  const recent = prescriptions.filter(p =>
    new Date() - new Date(p.date) < 30 * 24 * 60 * 60 * 1000
  );
  const previous = prescriptions.filter(p =>
    new Date() - new Date(p.date) >= 30 * 24 * 60 * 60 * 1000
  );

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <PatientNavbar />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">My Prescriptions</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Latest ({recent.length})</h3>
          {recent.length === 0 && !error && (
            <p className="text-gray-500">No recent prescriptions.</p>
          )}
          {recent.map(p => (
            <div key={p._id} className="bg-white p-4 rounded shadow mb-4">
              <p><strong>Doctor:</strong> {p.doctor}</p>
              <p><strong>Date:</strong> {new Date(p.date).toLocaleDateString()}</p>
              <p><strong>Notes:</strong> {p.notes}</p>
              <ul className="list-disc ml-6">
                {p.medicines.map((m, idx) => (
                  <li key={idx}>{m.name} - {m.dosage} ({m.frequency})</li>
                ))}
              </ul>
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => downloadPrescription(p)}
                  className="px-4 py-1 bg-green-600 text-white rounded"
                >
                  Download
                </button>
                <div className="inline-block">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rating (1-5)"
                    onChange={e => setFeedback(prev => ({
                      ...prev,
                      [p.appointmentId]: { ...prev[p.appointmentId], rating: e.target.value },
                    }))}
                    className="border p-1 w-20"
                  />
                  <input
                    maxLength={150}
                    placeholder="Comment (optional)"
                    onChange={e => setFeedback(prev => ({
                      ...prev,
                      [p.appointmentId]: { ...prev[p.appointmentId], comment: e.target.value },
                    }))}
                    className="border p-1 ml-2 w-64"
                  />
                  <button
                    onClick={() => handleFeedbackSubmit(p.appointmentId)}
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Previous ({previous.length})</h3>
          {previous.length === 0 && !error && (
            <p className="text-gray-500">No older prescriptions.</p>
          )}
          {previous.map(p => (
            <div key={p._id} className="bg-white p-4 rounded shadow mb-4">
              <p><strong>Doctor:</strong> {p.doctor}</p>
              <p><strong>Date:</strong> {new Date(p.date).toLocaleDateString()}</p>
              <p><strong>Notes:</strong> {p.notes}</p>
              <ul className="list-disc ml-6">
                {p.medicines.map((m, idx) => (
                  <li key={idx}>{m.name} - {m.dosage} ({m.frequency})</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default PatientPrescriptions;