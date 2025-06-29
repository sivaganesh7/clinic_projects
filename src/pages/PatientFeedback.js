import React from "react";
import PatientNavbar from "../components/Patient/PatientNavbar";
import PatientBackButton from "../components/Patient/PatientBackButton";

const PatientFeedback = () => {
  const upcomingFeatures = [
    "Enhanced patient feedback portal with real-time submission.",
    "Personalized feedback summaries for patients.",
    "Integration with telehealth platforms for seamless feedback.",
    "Reward system for consistent patient feedback.",
    "Multi-language support for global accessibility."
  ];

  return (
    <div>
      <PatientNavbar />
             <div className="my-5">       
        <PatientBackButton/>
        </div>
  
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-indigo-900 mb-6">Upcoming Features</h3>
        <div className="space-y-4">
          {upcomingFeatures.map((feature, index) => (
            <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors">
              <p className="text-gray-800 font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
      </div>
  );
};

export default PatientFeedback;