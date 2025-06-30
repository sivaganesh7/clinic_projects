const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
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
      medicines: medicines.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
      })),
      notes: notes || "",
    });

    await newPrescription.save();


    res.status(201).json({
      message: "Prescription added successfully",
      prescription: {
        _id: newPrescription._id,
        patient: {
          name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        },
        doctor: {
          name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        },
        medicines: newPrescription.medicines,
        notes: newPrescription.notes,
        date: newPrescription.createdAt,
      },
      appointment: {
        _id: appointmentId,
        prescriptionId: newPrescription._id, 
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
      doctor: {
        name: `${p.doctor.firstName} ${p.doctor.lastName}`,
      },
      appointmentId: p.appointment?._id,
      date: p.createdAt,
      medicines: p.medicines,
      notes: p.notes,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching patient prescriptions:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions", error: err.message });
  }
});

// GET: Fetch prescriptions for logged-in doctor
router.get("/doctor/me", authMiddleware, async (req, res) => {
  try {
    const doctorId = req.user.userId;

    // Validate that the user is a doctor (optional, based on role)
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(403).json({ message: "Unauthorized: User is not a doctor" });
    }

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "firstName lastName")
      .populate("appointment")
      .sort({ createdAt: -1 });

    const formatted = prescriptions.map((p) => ({
      _id: p._id,
      patient: {
        name: `${p.patient.firstName} ${p.patient.lastName}`,
      },
      appointmentId: p.appointment?._id,
      date: p.createdAt,
      medicines: p.medicines,
      notes: p.notes,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching doctor prescriptions:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions", error: err.message });
  }
});

router.get("/doctor/:id", authMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.id })
      .populate("patient", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (err) {
    console.error("❌ Error fetching by doctor ID:", err);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

module.exports = router;