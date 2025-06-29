import React from "react";
import DoctorNavbar from "../components/Doctor/DoctorNavbar";
import BackButton from "../components/BackButton";

const DoctorFeedback = () => {
  const upcomingFeatures = [
    "Real-time feedback analytics dashboard for doctors.",
    "Integration with patient appointment schedules for timely feedback requests.",
    "Customizable feedback forms based on doctor specialties.",
    "Anonymous feedback option with verification for authenticity.",
    "Automated follow-up emails to thank patients for their input."
  ];

  return (
    <div>
        <DoctorNavbar/>
               <div className="my-5">       
        <BackButton/>
        </div>
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Features</h3>
      <div className="grid gap-3">
        {upcomingFeatures.map((feature, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
            <p className="text-gray-700">{feature}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default DoctorFeedback;