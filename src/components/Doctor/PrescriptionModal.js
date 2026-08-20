import React, { useState } from "react";
import axios from "axios";
import { Plus, Trash2, X, FileText, CheckCircle2 } from "lucide-react";

const PrescriptionModal = ({ appointment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medicines: [{ name: "", dosage: "", frequency: "Once daily", duration: "5 days", instructions: "After meals" }],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (index, field, value) => {
    const newMedicines = [...formData.medicines];
    newMedicines[index][field] = value;
    setFormData((prev) => ({ ...prev, medicines: newMedicines }));
  };

  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "Once daily", duration: "5 days", instructions: "After meals" },
      ],
    }));
  };

  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleNotesChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, notes: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const patientId =
      appointment?.patient?._id ||
      (typeof appointment?.patient === "string" ? appointment.patient : null);

    if (!appointment?._id || !patientId) {
      setError("Invalid appointment or patient data. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const validMedicines = formData.medicines.filter(
        (med) => med.name.trim() && med.dosage.trim() && med.frequency.trim()
      );

      if (validMedicines.length === 0) {
        throw new Error("Please add at least one medicine with name, dosage, and frequency.");
      }

      const payload = {
        appointmentId: appointment._id,
        patientId: patientId,
        medicines: validMedicines,
        notes: formData.notes.trim() || "",
      };

      await axios.post("/api/prescriptions", payload, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Error saving prescription:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save prescription. Please check fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = formData.medicines.some(
    (med) => !med.name.trim() || !med.dosage.trim() || !med.frequency.trim()
  );

  return (
    <div
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto"
      aria-labelledby="prescription-modal-title"
      role="dialog"
    >
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <FileText size={22} />
          </div>
          <div>
            <h2 id="prescription-modal-title" className="text-xl font-bold text-gray-900">
              Create Digital Prescription
            </h2>
            <p className="text-xs text-gray-500">Official medical prescription for consultation</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p className="text-gray-700">
              <strong className="text-gray-900">Patient:</strong> {appointment.patient?.name || "Unknown Patient"}
            </p>
            <p className="text-gray-700">
              <strong className="text-gray-900">Date:</strong> {appointment.date || new Date().toISOString().split("T")[0]}
            </p>
            <p className="text-gray-700 col-span-full">
              <strong className="text-gray-900">Consultation Issue:</strong> {appointment.issue || "General Consultation"}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-bold text-gray-900 text-sm">Prescribed Medications</label>
              <button
                type="button"
                onClick={addMedicine}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {formData.medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Medicine #{index + 1}
                    </span>
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition text-xs flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                      placeholder="Medicine Name (e.g., Paracetamol)"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => handleChange(index, "dosage", e.target.value)}
                      placeholder="Dosage (e.g., 500 mg, 1 tablet)"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={medicine.frequency}
                      onChange={(e) => handleChange(index, "frequency", e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    >
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Thrice daily">Thrice daily</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                      <option value="As needed">As needed</option>
                    </select>

                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => handleChange(index, "duration", e.target.value)}
                      placeholder="Duration (e.g., 5 days)"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />

                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => handleChange(index, "instructions", e.target.value)}
                      placeholder="Instructions (e.g., After food)"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-900 text-sm mb-1.5">
              Diagnosis / Clinical Notes / Advice
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleNotesChange}
              placeholder="Enter diagnosis, clinical remarks, dietary advice, or follow-up schedule..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isFormInvalid}
              className={`px-6 py-2.5 text-white font-medium rounded-xl transition text-sm shadow-md flex items-center gap-2 ${
                loading || isFormInvalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg"
              }`}
            >
              <CheckCircle2 size={16} />
              {loading ? "Generating Prescription..." : "Save & Issue Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;