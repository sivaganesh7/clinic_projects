const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
  frequency: {
    type: String,
    required: true,
    enum: ["Once daily", "Twice daily", "Thrice daily"],
    trim: true,
  },
});

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    medicines: {
      type: [medicineSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure at least one medicine
        },
        message: "At least one medicine is required",
      },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for appointment-based lookups
prescriptionSchema.index({ appointment: 1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);