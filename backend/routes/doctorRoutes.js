const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");

// ✅ Public routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

// ✅ Protected routes
router.get("/profile", auth(["doctor"]), getDoctorProfile); // Corrected
router.put("/profile", auth(["doctor"]), updateDoctorProfile);
 // Corrected

// ✅ Optional alias route: /me
router.get("/me", auth(["doctor"]), getDoctorProfile);

module.exports = router;
