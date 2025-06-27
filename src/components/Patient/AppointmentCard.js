import React from "react";
import { Link } from "react-router-dom";

const AppointmentCard = ({ appointment, onCancel }) => {
  const { doctor, date, time, issue, status, _id } = appointment;

  return (
    <div className="bg-white p-4 shadow-md rounded-lg border hover:shadow-lg transition-all duration-200">
      <h3 className="text-xl font-semibold text-gray-800">
        {doctor?.firstName} {doctor?.lastName}
      </h3>
      <p className="text-sm text-gray-500 mb-2">{doctor?.specialization}</p>

      <div className="text-gray-700 text-sm space-y-1 mb-2">
        <p>🗓️ Date: {date}</p>
        <p>⏰ Time: {time}</p>
        <p>📝 Issue: {issue}</p>
      </div>

      <div className="mt-3 flex gap-2 items-center">
        {status === "new" && (
          <button
            onClick={() => onCancel(_id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        )}

        {status === "in-progress" && (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">
            In Progress
          </span>
        )}

        {status === "completed" && (
          <Link
            to="/prescriptions"
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
          >
            View Prescription
          </Link>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
