import React, { useState } from "react";
import axios from "axios";

const PrescriptionModal = ({ appointment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medicines: [{ name: "", dosage: "", frequency: "" }],
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
      medicines: [...prev.medicines, { name: "", dosage: "", frequency: "" }],
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
    if (!appointment?._id || !appointment?.patient?._id) {
      setError("Invalid appointment data. Please try again.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        appointmentId: appointment._id,
        patientId: appointment.patient._id,
        medicines: formData.medicines.filter(
          (med) => med.name.trim() && med.dosage.trim() && med.frequency.trim()
        ),
        notes: formData.notes.trim() || "",
      };

      if (payload.medicines.length === 0) {
        throw new Error("At least one medicine with complete details is required.");
      }

      await axios.post("/api/prescriptions", payload, {
        baseURL: "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
      });

      onSave(); // Refresh appointments
      onClose();
    } catch (err) {
      console.error("Error saving prescription:", err);
      setError(err.response?.data?.message || err.message || "Failed to save prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = formData.medicines.some(
    (med) => !med.name.trim() || !med.dosage.trim() || !med.frequency.trim()
  );

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      aria-labelledby="prescription-modal-title"
      role="dialog"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300">
        <h2 id="prescription-modal-title" className="text-2xl font-bold mb-5 text-gray-900">
          Add Prescription
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-gray-700 mb-2">
              <strong>Patient:</strong> {appointment.patient?.name || "Unknown"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Issue:</strong> {appointment.issue || "No issue specified"}
            </p>
          </div>
          {formData.medicines.map((medicine, index) => (
            <div key={index} className="space-y-3">
              <input
                type="text"
                value={medicine.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Medicine name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`Medicine name ${index + 1}`}
                required
              />
              <input
                type="text"
                value={medicine.dosage}
                onChange={(e) => handleChange(index, "dosage", e.target.value)}
                placeholder="Dosage (e.g., 1 tablet)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`Dosage for medicine ${index + 1}`}
                required
              />
              <select
                value={medicine.frequency}
                onChange={(e) => handleChange(index, "frequency", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`Frequency for medicine ${index + 1}`}
                required
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Thrice daily">Thrice daily</option>
              </select>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      medicines: prev.medicines.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-red-500 hover:text-red-700 mt-2"
                  aria-label={`Remove medicine ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMedicine}
            className="text-blue-600 hover:text-blue-800 font-medium"
            aria-label="Add another medicine"
          >
            + Add another medicine
          </button>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="Additional notes (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
            aria-label="Additional notes"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                loading || isFormInvalid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || isFormInvalid}
              aria-label="Add prescription"
            >
              {loading ? "Saving..." : "Add Prescription"}
            </button>
          </div>
          {error && (
            <div className="text-red-600 text-sm mt-2" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;