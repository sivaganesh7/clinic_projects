const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");
const Doctor = require("../models/Doctor");

// ✅ Public routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

// ✅ Protected routes
router.get("/profile", auth(["doctor"]), getDoctorProfile); // Corrected
router.put("/profile", auth(["doctor"]), updateDoctorProfile);
 // Corrected

// ✅ Optional alias route: /me
router.get("/me", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.userId).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    console.error("Error in /me:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
