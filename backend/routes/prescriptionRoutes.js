const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescriptionController");

// POST: Create prescription (Doctor only)
router.post("/", authMiddleware, createPrescription);

// GET: Fetch prescriptions for logged-in patient
router.get("/patient/me", authMiddleware, getPatientPrescriptions);

// GET: Fetch prescriptions for logged-in doctor
router.get("/doctor/me", authMiddleware, getDoctorPrescriptions);

// GET: Fetch prescription by ID
router.get("/:id", authMiddleware, getPrescriptionById);

module.exports = router;