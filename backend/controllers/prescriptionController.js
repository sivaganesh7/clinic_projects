const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// POST: Add a new prescription (Doctor only)
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, notes } = req.body;
    const doctorId = req.user?.userId;

    if (!appointmentId || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ message: "Appointment ID and at least one medicine are required." });
    }

    const appointment = await Appointment.findById(appointmentId).populate("patient doctor");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.doctor._id.toString() !== doctorId) {
      return res.status(403).json({ message: "Unauthorized. You are not the doctor for this appointment." });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        message: `Prescriptions can only be created for completed consultations. Current status: '${appointment.status}'.`,
      });
    }

    // Check if prescription already exists for this appointment
    const existing = await Prescription.findOne({ appointment: appointmentId });
    if (existing) {
      existing.medicines = medicines.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration || "",
        instructions: med.instructions || "",
      }));
      existing.notes = notes || "";
      existing.date = new Date();
      await existing.save();

      return res.status(200).json({
        message: "Prescription updated successfully",
        prescription: {
          _id: existing._id,
          patient: {
            _id: appointment.patient?._id,
            name: `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.trim(),
            email: appointment.patient?.email,
          },
          doctor: {
            _id: appointment.doctor?._id,
            name: `Dr. ${appointment.doctor?.firstName || ""} ${appointment.doctor?.lastName || ""}`.trim(),
            specialization: appointment.doctor?.specialization,
          },
          medicines: existing.medicines,
          notes: existing.notes,
          date: existing.date,
          appointmentId: appointment._id,
        },
      });
    }

    const newPrescription = new Prescription({
      doctor: doctorId,
      patient: appointment.patient._id,
      appointment: appointmentId,
      medicines: medicines.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration || "",
        instructions: med.instructions || "",
      })),
      notes: notes || "",
      date: new Date(),
    });

    await newPrescription.save();

    res.status(201).json({
      message: "Prescription created successfully",
      prescription: {
        _id: newPrescription._id,
        patient: {
          _id: appointment.patient?._id,
          name: `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.trim(),
          email: appointment.patient?.email,
        },
        doctor: {
          _id: appointment.doctor?._id,
          name: `Dr. ${appointment.doctor?.firstName || ""} ${appointment.doctor?.lastName || ""}`.trim(),
          specialization: appointment.doctor?.specialization,
        },
        medicines: newPrescription.medicines,
        notes: newPrescription.notes,
        date: newPrescription.date,
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error("❌ Error adding prescription:", err);
    res.status(500).json({ message: "Failed to create prescription", error: err.message });
  }
};

// GET: Fetch prescriptions for logged-in patient
const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user?.userId;

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "firstName lastName specialization email")
      .populate("appointment", "date time issue status")
      .sort({ createdAt: -1 });

    const formatted = prescriptions.map((p) => ({
      _id: p._id,
      doctor: p.doctor
        ? {
            _id: p.doctor._id,
            name: `Dr. ${p.doctor.firstName} ${p.doctor.lastName}`,
            specialization: p.doctor.specialization,
            email: p.doctor.email,
          }
        : { _id: null, name: "Doctor" },
      appointmentId: p.appointment?._id,
      appointment: p.appointment,
      date: p.date || p.createdAt,
      medicines: p.medicines,
      notes: p.notes,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching patient prescriptions:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions", error: err.message });
  }
};

// GET: Fetch prescriptions for logged-in doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorId = req.user?.userId;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "firstName lastName email phone")
      .populate("appointment", "date time issue status")
      .sort({ createdAt: -1 });

    const formatted = prescriptions.map((p) => ({
      _id: p._id,
      patient: p.patient
        ? {
            _id: p.patient._id,
            name: `${p.patient.firstName || ""} ${p.patient.lastName || ""}`.trim(),
            email: p.patient.email,
            phone: p.patient.phone || "",
          }
        : { _id: null, name: "Unknown Patient" },
      appointmentId: p.appointment?._id,
      appointment: p.appointment,
      date: p.date || p.createdAt,
      medicines: p.medicines,
      notes: p.notes,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching doctor prescriptions:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions", error: err.message });
  }
};

// GET: Single prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "firstName lastName specialization email")
      .populate("patient", "firstName lastName email phone")
      .populate("appointment");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    if (
      prescription.doctor._id.toString() !== userId &&
      prescription.patient._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized to view this prescription." });
    }

    res.status(200).json(prescription);
  } catch (err) {
    console.error("❌ Error fetching prescription:", err);
    res.status(500).json({ message: "Failed to fetch prescription", error: err.message });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
};
