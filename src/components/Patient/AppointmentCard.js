import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Stethoscope, AlertCircle, CheckCircle2, XCircle, FileText, MessageSquare } from "lucide-react";

const AppointmentCard = ({ appointment, onCancel }) => {
  const { doctor, date, time, issue, status, _id } = appointment;
  const normalizedStatus = (status || "pending").toLowerCase();

  const getStatusBadge = () => {
    switch (normalizedStatus) {
      case "pending":
      case "new":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-200">
            <Clock size={13} /> Pending Doctor Approval
          </span>
        );
      case "accepted":
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-200">
            <CheckCircle2 size={13} /> Accepted / Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-200">
            <CheckCircle2 size={13} /> Consultation Completed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium border border-red-200">
            <XCircle size={13} /> Request Declined
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-300">
            <AlertCircle size={13} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-5 shadow-md rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {doctor?.name || `Dr. ${doctor?.firstName || ""} ${doctor?.lastName || ""}`.trim() || "Doctor"}
          </h3>
          {getStatusBadge()}
        </div>

        <p className="text-sm font-medium text-blue-600 mb-3 flex items-center gap-1">
          <Stethoscope size={15} /> {doctor?.specialization || "General Specialist"}
        </p>

        <div className="text-gray-700 text-sm space-y-1.5 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-400" />
            <span><strong>Date:</strong> {date}</span>
          </p>
          <p className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            <span><strong>Time:</strong> {time}</span>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            <strong>Reason:</strong> {issue || "General Consultation"}
          </p>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-between">
        {(normalizedStatus === "pending" || normalizedStatus === "new" || normalizedStatus === "accepted" || normalizedStatus === "in-progress") && (
          <button
            onClick={() => onCancel(_id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            Cancel Appointment
          </button>
        )}

        {normalizedStatus === "completed" && (
          <div className="flex gap-2 w-full">
            <Link
              to="/prescriptions"
              className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
            >
              <FileText size={14} /> View Prescription
            </Link>
            <Link
              to="/prescriptions"
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1"
            >
              <MessageSquare size={14} /> Leave Feedback
            </Link>
          </div>
        )}

        {(normalizedStatus === "rejected" || normalizedStatus === "cancelled") && (
          <span className="text-xs text-gray-400 italic">No further actions required</span>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
