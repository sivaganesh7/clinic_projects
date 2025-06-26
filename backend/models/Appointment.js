const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Validate 24hr format (HH:MM), e.g., "14:30"
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time in 24hr format (HH:MM)!`,
      },
    },
    issue: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "completed"],
      default: "new",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexes for performance
appointmentSchema.index({ doctor: 1, status: 1 }); // Index for doctor-specific status queries
appointmentSchema.index({ patient: 1, date: 1 }); // Index for patient date-based queries

module.exports = mongoose.model("Appointment", appointmentSchema);