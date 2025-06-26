const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerDoctor = async (req, res) => {
  try {
    const { email, password, firstName, lastName, specialization } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      email,
      password: hashed,
      firstName,
      lastName,
      specialization,
    });

    console.log("✅ Doctor Registered:", doctor.email);
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
  { userId: doctor._id, role: doctor.role }, // ✅ updated key
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


    // Return doctor info with token
    res.status(200).json({
      token,
      message: "✅Login successful",
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};