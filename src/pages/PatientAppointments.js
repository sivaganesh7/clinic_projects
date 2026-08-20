import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../components/Patient/PatientNavbar";
import AppointmentCard from "../components/Patient/AppointmentCard";
import PatientBackButton from "../components/Patient/PatientBackButton";
import { Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  const token = localStorage.getItem("patientToken");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/appointments/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCancelMessage("Appointment cancelled successfully.");
      setTimeout(() => setCancelMessage(""), 3000);
      fetchAppointments();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel appointment.";
      setError(msg);
      setTimeout(() => setError(""), 4000);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const matchesTab = (appt, tab) => {
    const status = (appt.status || "").toLowerCase();
    if (tab === "all") return true;
    if (tab === "pending") return status === "pending" || status === "new";
    if (tab === "accepted") return status === "accepted" || status === "in-progress";
    if (tab === "completed") return status === "completed";
    if (tab === "cancelled") return status === "cancelled" || status === "rejected";
    return status === tab;
  };

  const filtered = appointments.filter((a) => matchesTab(a, activeTab));

  const tabList = [
    { key: "all", label: "All", count: appointments.length },
    {
      key: "pending",
      label: "Pending",
      count: appointments.filter((a) => ["pending", "new"].includes((a.status || "").toLowerCase())).length,
    },
    {
      key: "accepted",
      label: "Accepted / Scheduled",
      count: appointments.filter((a) => ["accepted", "in-progress"].includes((a.status || "").toLowerCase())).length,
    },
    {
      key: "completed",
      label: "Completed",
      count: appointments.filter((a) => (a.status || "").toLowerCase() === "completed").length,
    },
    {
      key: "cancelled",
      label: "Cancelled / Declined",
      count: appointments.filter((a) => ["cancelled", "rejected"].includes((a.status || "").toLowerCase())).length,
    },
  ];

  return (
    <div>
      <PatientNavbar />
      <div className="my-5">
        <PatientBackButton />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                My Appointments
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Track your requested, scheduled, and past medical consultations.
              </p>
            </div>
            <Link
              to="/book-appointment"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition"
            >
              <Plus size={18} /> Book New Appointment
            </Link>
          </div>

          {cancelMessage && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 mb-6 rounded-lg text-sm">
              ✅ {cancelMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 mb-6 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto border-b border-gray-200 pb-1">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12 text-gray-600">Loading your appointments...</div>
          )}

          {/* Appointment Cards */}
          {!loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onCancel={handleCancel}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    No {activeTab !== "all" ? activeTab : ""} appointments found
                  </h3>
                  <p className="text-gray-500 text-sm mb-5">
                    {activeTab === "pending"
                      ? "You do not have any pending requests awaiting doctor approval."
                      : activeTab === "accepted"
                      ? "You do not have any accepted or upcoming appointments scheduled."
                      : "Book an appointment with one of our specialized healthcare providers."}
                  </p>
                  <Link
                    to="/book-appointment"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <Plus size={16} /> Book Appointment
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;