const express = require("express");
const router = express.Router();

// Controller functions
const {
  registerPatient,
  loginPatient,
  getLoggedInPatient,
} = require("../controllers/patientController");

// Auth middleware to protect routes
const authMiddleware = require("../middleware/authMiddleware");

// ------------------ PUBLIC ROUTES ------------------ //
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// ------------------ PROTECTED ROUTES ------------------ //
router.get("/me", authMiddleware, getLoggedInPatient);

// Export the router
module.exports = router;
