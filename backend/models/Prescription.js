const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
  frequency: {
    type: String,
    required: true,
    trim: true,
  },
  duration: { type: String, trim: true, default: "" },
  instructions: { type: String, trim: true, default: "" },
});

const prescriptionSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    medicines: {
      type: [medicineSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one medicine is required",
      },
    },
    notes: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

prescriptionSchema.index({ appointment: 1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
