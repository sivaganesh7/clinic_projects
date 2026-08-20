const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerDoctor,
  loginDoctor,
  getAllDoctors,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");

// ✅ Public routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/all", getAllDoctors);

// ✅ Protected routes
router.get("/profile", authMiddleware, getDoctorProfile);
router.put("/profile", authMiddleware, updateDoctorProfile);

// ✅ Optional alias route: /me
router.get("/me", authMiddleware, getDoctorProfile);

module.exports = router;
