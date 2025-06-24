const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// Get distinct doctor specialties
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialization");
    res.json(specialties.map(spec => spec.trim().toLowerCase())); // Normalize output
  } catch (error) {
    res.status(500).json({ message: "Error fetching specialties" });
  }
};

// Get all doctors based on specialization
const getDoctorsBySpecialty = async (req, res) => {
  try {
    const specialty = req.params.specialty.trim().toLowerCase();

    const doctors = await Doctor.find({
      specialization: { $regex: new RegExp(`^${specialty}$`, 'i') }
    });

    res.json(doctors);
  } catch (error) {
    console.error("Error in getDoctorsBySpecialty:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Book appointment with 2-per-day limit
const bookAppointment = async (req, res) => {
  const { doctorId, date, time, issue } = req.body;
  const patientId = req.user.id;

  try {
    const existingCount = await Appointment.countDocuments({ patient: patientId, date });

    if (existingCount >= 2) {
      return res.status(400).json({ message: "You can only book 2 appointments per day" });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      issue,
    });

    await newAppointment.save();

    res.json({ message: "Appointment booked successfully" });
    console.log("BOOKING REQUEST BODY:", req.body);
    console.log("Authenticated Patient:", req.user);
    console.log("BOOK REQ:", {
    doctorId,
    date,
    time,
    issue,
    patient: req.user?.id
});


  } catch (err) {
    console.error("Error in bookAppointment:", err);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

module.exports = {
  getSpecialties,
  getDoctorsBySpecialty,
  bookAppointment,
};
