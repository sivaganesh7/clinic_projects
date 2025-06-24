const express = require("express");
const router = express.Router();

// Controller functions
const { registerPatient, loginPatient } = require("../controllers/patientController");

// Patient Registration Route
router.post("/register", registerPatient);

// Patient Login Route
router.post("/login", loginPatient);

// Future-Protected Routes (Example)
// const authMiddleware = require("../middleware/authMiddleware");
// router.get("/dashboard", authMiddleware, patientDashboardHandler);

module.exports = router;
