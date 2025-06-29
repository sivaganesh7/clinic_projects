import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientNavbar from "../components/Patient/PatientNavbar";
import AppointmentCard from "../components/Patient/AppointmentCard";
import PatientBackButton from "../components/Patient/PatientBackButton";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("new");

  const token = localStorage.getItem("patientToken");

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Re-fetch appointments after cancel
      const res = await axios.get("http://localhost:5000/api/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/appointments/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, [token]);

  const filtered = appointments.filter((a) => a.status === activeTab);

  return (
    <div>
          <PatientNavbar />
                 <div className="my-5">       
        <PatientBackButton/>
        </div>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-800 tracking-tight animate-fade-in">
          My Appointments
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto border-b border-gray-200">
          {["new", "in-progress", "completed"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2.5 rounded-t-lg font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "new"
                ? "New Appointments"
                : tab === "in-progress"
                ? "In Progress"
                : "Completed"}
            </button>
          ))}
        </div>

        {/* Appointment Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onCancel={handleCancel}
                className="transform transition-transform duration-300 hover:scale-105"
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full py-8 bg-white rounded-lg shadow-md animate-pulse">
              No appointments in this section.
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default PatientAppointments;