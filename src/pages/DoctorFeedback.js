import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, MessageSquare } from "lucide-react";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import BackButton from "../components/BackButton";

const DoctorFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/feedbacks/doctor/me", {
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

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
    : "N/A";

  return (
    <div>
      <DoctorNavbar />
      <div className="my-5">
        <BackButton />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Patient Feedback</h1>
            <p className="text-gray-600 mt-2">Review feedback from your patients to improve care quality</p>
          </div>

          {/* Stats Bar */}
          {!loading && feedbacks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-md p-5 text-center">
                <div className="text-3xl font-bold text-blue-600">{feedbacks.length}</div>
                <div className="text-gray-600 text-sm mt-1">Total Feedbacks</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 text-center">
                <div className="text-3xl font-bold text-yellow-500">{averageRating}</div>
                <div className="text-gray-600 text-sm mt-1">Average Rating</div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-5 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {feedbacks.filter((fb) => fb.rating >= 4).length}
                </div>
                <div className="text-gray-600 text-sm mt-1">Positive (4-5 ★)</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-10 text-gray-600">Loading feedbacks...</div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              ⚠️ {error}
            </div>
          )}

          {!loading && !error && feedbacks.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-10 text-center">
              <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Received Yet</h3>
              <p className="text-gray-500">
                Your patients will be able to submit feedback after their appointments are completed and prescriptions are issued.
              </p>
            </div>
          )}

          {!loading && feedbacks.length > 0 && (
            <div className="grid gap-5">
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{fb.patient}</h3>
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

export default DoctorFeedback;