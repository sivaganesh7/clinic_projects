import React from 'react';
// import { Link } from 'react-router-dom';
import PatientNavbar from '../components/Patient/PatientNavbar';

const PatientAppointments = () => {
  const appointments = [
    { id: 1, doctor: "Dr. Sarah Wilson", specialty: "Cardiologist", date: "2024-06-20", time: "10:30 AM", issue: "Chest pain and irregular heartbeat", status: "Pending" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "Dentist", date: "2024-06-22", time: "2:00 PM", issue: "Regular dental checkup and cleaning", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <PatientNavbar />
      
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <span>Pending ({appointments.filter(a => a.status === "Pending").length})</span>
            <span>Completed (0)</span>
          </div>
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border-b py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{appointment.doctor}</p>
                  <p className="text-gray-600">{appointment.specialty}</p>
                  <p className="text-gray-600">{appointment.date} {appointment.time}</p>
                  <p className="text-gray-600">{appointment.issue}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{appointment.status}</span>
              </div>
              <button className="text-red-600 hover:text-red-700 mt-2">Cancel</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientAppointments;