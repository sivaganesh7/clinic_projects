import React from 'react';

import PatientNavbar from '../components/Patient/PatientNavbar';

const Prescriptions = () => {
  const prescriptions = [
    {
      id: 1,
      doctor: "Dr. James Thompson",
      specialty: "General Practitioner",
      date: "2024-06-15",
      time: "9:00 AM",
      diagnosis: "Hypertension and Type 2 Diabetes management",
      medications: [
        { name: "Lisinopril", dosage: "10mg", duration: "30 days" },
        { name: "Metformin", dosage: "500mg", duration: "30 days" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <PatientNavbar />

      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <svg className="mx-auto h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900">My Prescriptions</h2>
          <p className="text-gray-600">Manage and view your medical prescriptions</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <span>Latest (0)</span>
            <span>Previous (4)</span>
          </div>
          {prescriptions.length === 0 ? (
            <div className="text-center text-gray-600 py-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p>No recent prescriptions</p>
              <p>Prescriptions from the last 30 days will appear here</p>
            </div>
          ) : (
            prescriptions.map((prescription) => (
              <div key={prescription.id} className="border-b py-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{prescription.doctor}</p>
                  <span className="text-green-600">RX#{prescription.id}</span>
                </div>
                <p className="text-gray-600">{prescription.specialty}</p>
                <p className="text-gray-600">{prescription.date} {prescription.time}</p>
                <p className="text-gray-600">Diagnosis: {prescription.diagnosis}</p>
                <p className="text-gray-600">Prescribed Medications:</p>
                <ul className="list-disc list-inside">
                  {prescription.medications.map((med, index) => (
                    <li key={index}>{med.name} - {med.dosage}, {med.duration}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
          <div className="flex justify-between mt-6 text-gray-600">
            <span>Total Prescriptions: 4</span>
            <span>Recent (30 days): 0</span>
            <span>Total Medications: 7</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Prescriptions;