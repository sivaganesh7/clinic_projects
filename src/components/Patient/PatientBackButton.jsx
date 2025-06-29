import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientBackButton = ({ to = "/patient-dashboard", label = "Back to Dashboard" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-all duration-200 shadow-sm"
    >
      <ArrowLeft className="w-5 h-5" />
      {label}
    </button>
  );
};

export default PatientBackButton;
