import React, { useState, useEffect } from "react";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import { CalendarDays, Clock, Phone, Check, X, FileText, CheckCircle2 } from "lucide-react";
import PrescriptionModal from "../components/Doctor/PrescriptionModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentTab, setCurrentTab] = useState("pending");
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/appointments/me", {
        baseURL: process.env.REACT_APP_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        setTimeout(() => navigate("/doctor-login"), 2000);
      } else {
        setError("Failed to load appointments. Please try again or contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your appointments.");
      setTimeout(() => navigate("/doctor-login"), 2000);
      return;
    }
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  const acceptAppointment = async (id) => {
    try {
      await axios.patch(
        `/api/appointments/accept/${id}`,
        {},
        {
          baseURL: process.env.REACT_APP_API_URL,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMsg("Appointment accepted successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchAppointments();
    } catch (err) {
      console.error("Error accepting appointment:", err);
      setError(err.response?.data?.message || "Failed to accept appointment. Please try again.");
    }
  };

  const rejectAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to decline this appointment request?")) {
      return;
    }
    try {
      await axios.delete(`/api/appointments/reject/${id}`, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Appointment request declined.");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchAppointments();
    } catch (err) {
      console.error("Error rejecting appointment:", err);
      setError(err.response?.data?.message || "Failed to reject appointment. Please try again.");
    }
  };

  const completeAppointment = async (id) => {
    try {
      const res = await axios.patch(
        `/api/appointments/complete/${id}`,
        {},
        {
          baseURL: process.env.REACT_APP_API_URL,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMsg("Consultation marked as completed. You can now issue a digital prescription.");
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchAppointments();

      // Automatically offer to write a prescription
      if (res.data?.appointment) {
        setPrescriptionData(res.data.appointment);
      }
    } catch (err) {
      console.error("Error completing appointment:", err);
      setError(err.response?.data?.message || "Failed to complete appointment. Please try again.");
    }
  };

  const handlePrescriptionOpen = (appt) => {
    if (!appt || !appt._id) {
      setError("Invalid appointment data. Please try again.");
      return;
    }
    setPrescriptionData(appt);
  };

  const matchesTab = (appt, tab) => {
    const s = (appt.status || "").toLowerCase();
    if (tab === "pending") return s === "pending" || s === "new";
    if (tab === "accepted") return s === "accepted" || s === "in-progress";
    if (tab === "completed") return s === "completed";
    if (tab === "history") return s === "rejected" || s === "cancelled";
    return s === tab;
  };

  const filteredAppointments = appointments.filter((appt) => matchesTab(appt, currentTab));

  const tabList = [
    {
      key: "pending",
      label: "New Requests",
      count: appointments.filter((a) => ["pending", "new"].includes((a.status || "").toLowerCase())).length,
    },
    {
      key: "accepted",
      label: "In Progress / Accepted",
      count: appointments.filter((a) => ["accepted", "in-progress"].includes((a.status || "").toLowerCase())).length,
    },
    {
      key: "completed",
      label: "Completed Consultations",
      count: appointments.filter((a) => (a.status || "").toLowerCase() === "completed").length,
    },
    {
      key: "history",
      label: "History (Declined/Cancelled)",
      count: appointments.filter((a) => ["rejected", "cancelled"].includes((a.status || "").toLowerCase())).length,
    },
  ];

  return (
    <div>
      <DoctorNavbar />
      <div className="my-5">
        <BackButton />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-wide">
                Appointment Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Review patient booking requests, conduct consultations, and issue digital prescriptions.
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-5 py-3 mb-6 rounded-lg text-sm">
              ✅ {successMsg}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 px-5 py-3 mb-6 rounded-lg flex items-center justify-between">
              <span className="text-sm">⚠️ {error}</span>
              <button
                onClick={fetchAppointments}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-white rounded-xl shadow-sm p-2 mb-8 overflow-x-auto border border-gray-200">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                  currentTab === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    currentTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12 text-gray-600">Loading appointments...</div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => {
                  const s = (appt.status || "").toLowerCase();
                  return (
                    <div
                      key={appt._id}
                      className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                              {appt.patient?.name?.[0] || "P"}
                            </div>
                            <div>
                              <h2 className="font-bold text-base text-gray-900">
                                {appt.patient?.name || "Unknown Patient"}
                              </h2>
                              {appt.patient?.phone && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Phone size={12} /> {appt.patient.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                              ["pending", "new"].includes(s)
                                ? "bg-amber-100 text-amber-800"
                                : ["accepted", "in-progress"].includes(s)
                                ? "bg-blue-100 text-blue-800"
                                : s === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {s}
                          </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm space-y-1.5">
                          <div className="flex items-center text-gray-700">
                            <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                            {appt.date}
                            <Clock className="w-4 h-4 ml-4 mr-1 text-gray-400" />
                            {appt.time}
                          </div>
                          <p className="text-gray-600 text-xs">
                            <strong className="text-gray-700">Issue:</strong> {appt.issue || "General Consultation"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {["pending", "new"].includes(s) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptAppointment(appt._id)}
                              className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition text-xs font-medium flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => rejectAppointment(appt._id)}
                              className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition text-xs font-medium flex items-center justify-center gap-1 shadow-sm"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        )}

                        {["accepted", "in-progress"].includes(s) && (
                          <button
                            onClick={() => completeAppointment(appt._id)}
                            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 size={16} /> Mark as Completed
                          </button>
                        )}

                        {s === "completed" && (
                          <button
                            onClick={() => handlePrescriptionOpen(appt)}
                            className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 transition text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <FileText size={16} /> Add / Update Prescription
                          </button>
                        )}

                        {["rejected", "cancelled"].includes(s) && (
                          <p className="text-xs text-gray-400 text-center italic py-1">Archived</p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                  <CalendarDays className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium text-base">
                    No appointments in this category.
                  </p>
                </div>
              )}
            </div>
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
    </div>
  );
};

export default DoctorAppointments;