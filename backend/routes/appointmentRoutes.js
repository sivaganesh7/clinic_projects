const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getSpecialties,
  getDoctorsBySpecialty,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  acceptAppointment,
  completeAppointment,
  rejectAppointment
} = require("../controllers/appointmentController");

router.get("/specialties", authMiddleware, getSpecialties);

router.get("/doctors/:specialty", authMiddleware, getDoctorsBySpecialty);

// POST book a new appointment (limit 2/day)
router.post("/book", authMiddleware, bookAppointment);

// GET all appointments for logged-in patient
router.get("/my", authMiddleware, getPatientAppointments);

// DELETE cancel an appointment (by patient)
router.delete("/cancel/:id", authMiddleware, cancelAppointment);


// ───────────── DOCTOR ROUTES ─────────────

// PATCH doctor accepts an appointment (status → in-progress)
router.patch("/accept/:id", authMiddleware, acceptAppointment);

// PATCH doctor completes an appointment (status → completed)
router.patch("/complete/:id", authMiddleware, completeAppointment);

// DELETE doctor rejects (deletes) appointment
router.delete("/reject/:id", authMiddleware, rejectAppointment);

const { getDoctorAppointments } = require("../controllers/appointmentController");

// ...
router.get("/me", authMiddleware, getDoctorAppointments); // Add this


module.exports = router;
