import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import axios from "axios";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import { useNavigate } from "react-router-dom";

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      if (!token) {
        setError("Please log in to view your prescriptions.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/prescriptions/doctor/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load prescriptions. Please try again or contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [token, navigate]);

  const handleRetry = () => {
    setError(null);
    fetchPrescriptions();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <DoctorNavbar />
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-wide animate-fade-in">
          My Prescriptions
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-5 py-3 mb-6 rounded-lg flex items-center justify-between animate-fade-in">
            <span className="text-sm">⚠️ {error}</span>
            <button
              onClick={handleRetry}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-10 text-gray-600" aria-live="polite">
            Loading prescriptions...
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Prescription 
                    </h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {new Date(prescription.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      <strong className="text-gray-800">Patient:</strong>{" "}
                      {prescription.patient?.name || "Unknown"}
                    </p>
                    {/* <p className="text-gray-600">
                      <strong className="text-gray-800">Doctor:</strong>{" "}
                      {prescription.doctor?.name || "Unknown"}
                    </p> */}

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />
                        Medications
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                        {(prescription.medicines || []).map((med, index) => (
                          <li key={index}>
                            {med.name || "N/A"} - {med.dosage || "N/A"} ({med.frequency || "N/A"})
                          </li>
                        ))}
                      </ul>
                    </div>

                    {prescription.notes && (
                      <p className="text-gray-600 mt-4">
                        <strong className="text-gray-800">Notes:</strong> {prescription.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full py-10 bg-white rounded-xl shadow-md animate-pulse">
                No prescriptions available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptions;