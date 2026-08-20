import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import PatientNavbar from "../components/Patient/PatientNavbar";
import PatientBackButton from "../components/Patient/PatientBackButton";

const PatientFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("patientToken");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/feedbacks/patient/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to load feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PatientNavbar />
      <div className="my-5">
        <PatientBackButton />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Feedback History</h1>
            <p className="text-gray-600 mt-2">View all feedback you've submitted for your appointments</p>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-600">Loading your feedbacks...</div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && feedbacks.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Yet</h3>
              <p className="text-gray-500">
                After completing appointments and receiving prescriptions, you can submit feedback for your doctors.
              </p>
            </div>
          )}

          {!loading && feedbacks.length > 0 && (
            <div className="grid gap-5">
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {fb.doctor?.name ||
                          (typeof fb.doctor === "object"
                            ? `Dr. ${fb.doctor?.firstName || ""} ${fb.doctor?.lastName || ""}`.trim()
                            : fb.doctor) ||
                          "Doctor Consultation"}
                        {fb.doctor?.specialization && (
                          <span className="text-xs text-blue-600 font-normal ml-2">
                            ({fb.doctor.specialization})
                          </span>
                        )}
                      </h3>
                      {fb.appointment && (
                        <p className="text-sm text-gray-500 mt-1">
                          Appointment: {new Date(fb.appointment.date).toLocaleDateString()} at {fb.appointment.time}
                          {fb.appointment.issue && ` — ${fb.appointment.issue}`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      {renderStars(fb.rating)}
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(fb.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {fb.comments && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-2">
                      <p className="text-gray-700 text-sm italic">"{fb.comments}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientFeedback;