const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new doctor
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

// Doctor login
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: doctor._id, role: doctor.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "✅ Login successful",
      doctor: {
        id: doctor._id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in doctor profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.userId).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update logged-in doctor profile
exports.updateDoctorProfile = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields.email; // Prevent email updates

    const updated = await Doctor.findByIdAndUpdate(
      req.user.userId,
      updateFields,
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Doctor not found for update" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
