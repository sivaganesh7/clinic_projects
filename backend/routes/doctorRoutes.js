const express = require("express");
const router = express.Router();
const { registerDoctor, loginDoctor } = require("../controllers/doctorController");
const auth = require("../middleware/auth");

// Existing routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

// Get doctor profile (requires auth token)
router.get("/me", auth, async (req, res) => {
  try {
    const doctor = await require("../models/Doctor").findById(req.user.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;