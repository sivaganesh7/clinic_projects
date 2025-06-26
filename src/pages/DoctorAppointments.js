import React, { useState, useEffect } from "react";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import { CalendarDays, Clock, User } from "lucide-react";
import PrescriptionModal from "../components/Doctor/PrescriptionModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentTab, setCurrentTab] = useState("new");
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your appointments.");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login
      return;
    }
    fetchAppointments();
  }, [token, navigate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/appointments/me", {
        baseURL: "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load appointments. Please try again or contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  const acceptAppointment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `/api/appointments/accept/${id}`,
        {},
        {
          baseURL: "http://localhost:5000",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(appointments.map((appt) => (appt._id === id ? res.data.appointment : appt)));
      setError(null);
    } catch (err) {
      console.error("Error accepting appointment:", err);
      setError("Failed to accept appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const rejectAppointment = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/api/appointments/reject/${id}`, {
        baseURL: "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((appt) => appt._id !== id));
      setError(null);
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      setError("Failed to reject appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (id) => {
    setLoading(true);
    try {
      const res = await axios.patch(
        `/api/appointments/complete/${id}`,
        {},
        {
          baseURL: "http://localhost:5000",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(appointments.map((appt) => (appt._id === id ? res.data.appointment : appt)));
      setError(null);
    } catch (err) {
      console.error("Error completing appointment:", err);
      setError("Failed to complete appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionOpen = (appt) => {
    if (!appt || !appt._id || !appt.patient?._id) {
      setError("Invalid appointment data. Please try again.");
      return;
    }
    setPrescriptionData(appt);
  };

  const filteredAppointments = appointments.filter((appt) => appt.status === currentTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <DoctorNavbar />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-wide animate-fade-in">
          All Appointments
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-5 py-3 mb-6 rounded-lg flex items-center justify-between animate-fade-in">
            <span className="text-sm">⚠️ {error}</span>
            <button
              onClick={fetchAppointments}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-10 text-gray-600">Loading appointments...</div>
        )}

        {!loading && (
          <>
            <div className="flex space-x-2 bg-white rounded-lg shadow-md p-2 mb-8 w-fit">
              {["new", "in-progress", "completed"].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    currentTab === tab
                      ? "bg-blue-600 text-white shadow-inner"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab
                    .replace("new", "New Appointments")
                    .replace("in-progress", "In Progress")
                    .replace("completed", "Completed")}{" "}
                  <span className="ml-1 text-xs text-gray-400">
                    ({appointments.filter((a) => a.status === tab).length})
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-white rounded-xl shadow-lg p-6 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-6 h-6 text-blue-500" />
                      <h2 className="font-semibold text-lg text-gray-800">
                        {appt.patient?.name || "Unknown Patient"}
                      </h2>
                      <span
                        className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
                          appt.status === "new"
                            ? "bg-gray-100 text-gray-600"
                            : appt.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {appt.status.replace("in-progress", "In Progress")}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong className="text-gray-800">Issue:</strong>{" "}
                      {appt.issue || "No issue specified"}
                    </p>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDays className="w-5 h-5 mr-2 text-gray-400" />
                      {new Date(appt.date).toLocaleDateString()}
                      <Clock className="w-5 h-5 mx-4 text-gray-400" />
                      {appt.time}
                    </div>

                    {appt.status === "new" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => acceptAppointment(appt._id)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => rejectAppointment(appt._id)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}
                    {appt.status === "in-progress" && (
                      <button
                        onClick={() => completeAppointment(appt._id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        ✓ Mark as Completed
                      </button>
                    )}
                    {appt.status === "completed" && (
                      <button
                        onClick={() => handlePrescriptionOpen(appt)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Prescription
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full py-10 bg-white rounded-xl shadow-md animate-pulse">
                  No appointments in this section.
                </p>
              )}
            </div>
          </>
        )}

        {prescriptionData && (
          <PrescriptionModal
            appointment={prescriptionData}
            onClose={() => setPrescriptionData(null)}
            onSave={fetchAppointments}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;