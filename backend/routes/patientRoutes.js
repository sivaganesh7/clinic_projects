const express = require("express");
const router = express.Router();

const {
  registerPatient,
  loginPatient,
  getLoggedInPatient,
  updatePatientProfile,
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerPatient);
router.post("/login", loginPatient);

router.get("/me", authMiddleware, getLoggedInPatient);
router.put("/me", authMiddleware, updatePatientProfile);

module.exports = router;
