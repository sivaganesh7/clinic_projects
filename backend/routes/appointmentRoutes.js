const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getSpecialties,
  getDoctorsBySpecialty,
  bookAppointment,
  getAppointmentCountByDate,
  getPatientAppointments,
  cancelAppointment,
  acceptAppointment,
  completeAppointment,
  rejectAppointment,
  getDoctorAppointments,
} = require("../controllers/appointmentController");

router.get("/specialties", authMiddleware, getSpecialties);

router.get("/doctors/:specialty", authMiddleware, getDoctorsBySpecialty);

// POST book a new appointment (limit 2/day)
router.post("/book", authMiddleware, bookAppointment);

// GET appointment count by date for logged-in patient
router.get("/count/:date", authMiddleware, getAppointmentCountByDate);

// GET all appointments for logged-in patient
router.get("/my", authMiddleware, getPatientAppointments);

// DELETE cancel an appointment (by patient)
router.delete("/cancel/:id", authMiddleware, cancelAppointment);


// ───────────── DOCTOR ROUTES ─────────────

// GET all appointments for logged-in doctor
router.get("/me", authMiddleware, getDoctorAppointments);

// PATCH doctor accepts an appointment (status → in-progress)
router.patch("/accept/:id", authMiddleware, acceptAppointment);

// PATCH doctor completes an appointment (status → completed)
router.patch("/complete/:id", authMiddleware, completeAppointment);

// DELETE doctor rejects (deletes) appointment
router.delete("/reject/:id", authMiddleware, rejectAppointment);


module.exports = router;

