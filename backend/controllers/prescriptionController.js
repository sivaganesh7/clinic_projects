const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Feedback = require("../models/Feedback");
const authMiddleware = require("../middleware/authMiddleware");

// POST: Add a new prescription
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;
    const doctorId = req.user.userId;

    const appointment = await Appointment.findById(appointmentId).populate("patient doctor");

    if (!appointment || appointment.doctor._id.toString() !== doctorId) {
      return res.status(403).json({ message: "Unauthorized or invalid appointment" });
    }

    const newPrescription = new Prescription({
      doctor: doctorId,
      patient: appointment.patient._id,
      appointment: appointmentId,
      medicines,
      notes,
    });

    await newPrescription.save();

    res.status(201).json({
      message: "Prescription added successfully",
      prescription: {
        _id: newPrescription._id,
        patient: { name: `${appointment.patient.firstName} ${appointment.patient.lastName}` },
        doctor: { name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}` },
        medicines,
        notes,
        date: newPrescription.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error adding prescription:", err);
    res.status(500).json({ message: "Failed to add prescription", error: err.message });
  }
});

// GET: Fetch prescriptions for logged-in patient
router.get("/patient/me", authMiddleware, async (req, res) => {
  try {
    const patientId = req.user.userId;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "firstName lastName")
      .populate("appointment")
      .sort({ createdAt: -1 });

    const formatted = prescriptions.map((p) => ({
      _id: p._id,
      doctor: `${p.doctor.firstName} ${p.doctor.lastName}`,
      appointmentId: p.appointment?._id,
      date: p.createdAt,
      medicines: p.medicines,
      notes: p.notes,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching prescriptions for patient:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
});

// POST: Feedback for an appointment (once per patient)
router.post("/feedback", authMiddleware, async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const patientId = req.user.userId;

    const existing = await Feedback.findOne({ appointmentId, patientId });
    if (existing) {
      return res.status(400).json({ message: "Feedback already submitted." });
    }

    const feedback = new Feedback({ appointmentId, patientId, rating, comment });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted." });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

module.exports = router;
