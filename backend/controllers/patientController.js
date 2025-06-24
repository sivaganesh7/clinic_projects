const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER PATIENT
const registerPatient = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new patient
    const newPatient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newPatient.save();
    res.status(201).json({ message: "✅Patient registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// LOGIN PATIENT
const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find patient by email
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: patient._id, role: "patient" },
      process.env.JWT_SECRET || "defaultsecretkey",
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "✅Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ Export both
module.exports = {
  registerPatient,
  loginPatient,
};
