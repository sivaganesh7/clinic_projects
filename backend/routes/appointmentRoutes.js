const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getSpecialties,
  getDoctorsBySpecialty,
  bookAppointment,
} = require("../controllers/appointmentController");

router.get("/specialties", authMiddleware, getSpecialties);
router.get("/doctors/:specialty", authMiddleware, getDoctorsBySpecialty);
router.post("/book", authMiddleware, bookAppointment);

module.exports = router;
