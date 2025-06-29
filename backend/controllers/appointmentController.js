const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// GET: All unique doctor specialties
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialization");
    res.json(specialties.map(spec => spec.trim().toLowerCase()));
  } catch (error) {
    console.error("Error in getSpecialties:", error);
    res.status(500).json({ message: "Error fetching specialties" });
  }
};

// GET: Doctors by specialization
const getDoctorsBySpecialty = async (req, res) => {
  try {
    const specialty = req.params.specialty.trim().toLowerCase();
    const doctors = await Doctor.find({
      specialization: { $regex: `^${specialty}$`, $options: "i" },
    }).select("firstName lastName specialization email contact");
    if (!doctors.length) {
      return res.status(404).json({ message: "No doctors found for this specialty" });
    }
    res.json(doctors);
  } catch (error) {
    console.error("Error in getDoctorsBySpecialty:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// POST: Book a new appointment (limit 2/day per patient)
const bookAppointment = async (req, res) => {
  const { doctorId, date, time, issue } = req.body;
  const patientId = req.user?.userId;

  if (!patientId) {
    return res.status(401).json({ message: "Unauthorized. Patient ID missing." });
  }

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: "Doctor ID, date, and time are required" });
  }

  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
    return res.status(400).json({ message: "Invalid or past date" });
  }
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ message: "Invalid time format (HH:MM in 24hr)" });
  }

  try {
    // Extract only YYYY-MM-DD from date for comparison
    const dateOnly = appointmentDate.toISOString().split("T")[0];
    const existingCount = await Appointment.countDocuments({
      patient: patientId,
      $expr: {
        $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, dateOnly],
      },
    });

    if (existingCount >= 2) {
      return res.status(400).json({ message: "You can only book 2 appointments per day" });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date: appointmentDate,
      time,
      issue: issue || "",
      status: "new",
    });

    await newAppointment.save();
    console.log("✅ Appointment created for patient:", patientId);
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        _id: newAppointment._id,
        patient: patientId,
        doctor: doctorId,
        date: newAppointment.date,
        time: newAppointment.time,
        issue: newAppointment.issue,
        status: newAppointment.status,
      },
    });
  } catch (err) {
    console.error("❌ Error in bookAppointment:", err);
    res.status(500).json({ message: "Failed to book appointment", error: err.message });
  }
};

// GET: Count appointments by date for logged-in patient
const getAppointmentCountByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const patientId = req.user.userId;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const count = await Appointment.countDocuments({
      patient: patientId,
      $expr: {
        $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, date],
      },
    });

    res.json({ count });
  } catch (error) {
    console.error("❌ getAppointmentCountByDate error:", error);
    res.status(500).json({ message: "Failed to fetch count" });
  }
};

// GET: All appointments for logged-in patient
const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "firstName lastName specialization email")
      .sort({ date: -1, time: 1 });
    const formattedAppointments = appointments.map(appt => ({
      _id: appt._id,
      doctor: {
        _id: appt.doctor._id,
        name: `${appt.doctor.firstName} ${appt.doctor.lastName}`,
        specialization: appt.doctor.specialization,
        email: appt.doctor.email,
      },
      date: appt.date.toISOString().split("T")[0],
      time: appt.time,
      issue: appt.issue,
      status: appt.status,
    }));
    res.json(formattedAppointments);
  } catch (err) {
    console.error("❌ Error fetching patient appointments:", err);
    res.status(500).json({ message: "Failed to fetch appointments", error: err.message });
  }
};

// DELETE: Patient cancels their own appointment
const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const { id } = req.params;

    const deleted = await Appointment.findOneAndDelete({ _id: id, patient: patientId });
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found or not authorized to cancel" });
    }

    res.json({ message: "Appointment cancelled successfully", id: deleted._id });
  } catch (err) {
    console.error("❌ Cancel error:", err);
    res.status(500).json({ message: "Failed to cancel appointment", error: err.message });
  }
};

// PATCH: Doctor accepts appointment (update status to in-progress)
const acceptAppointment = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const updated = await Appointment.findOneAndUpdate(
      { _id: id, doctor: doctorId, status: "new" },
      { status: "in-progress" },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Appointment not found or not authorized to accept" });
    }

    res.json({
      message: "Appointment accepted",
      appointment: {
        _id: updated._id,
        patient: updated.patient,
        doctor: updated.doctor,
        date: updated.date.toISOString().split("T")[0],
        time: updated.time,
        issue: updated.issue,
        status: updated.status,
      },
    });
  } catch (err) {
    console.error("❌ Accept error:", err);
    res.status(500).json({ message: "Failed to accept appointment", error: err.message });
  }
};

// PATCH: Doctor completes appointment (update status to completed)
const completeAppointment = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const updated = await Appointment.findOneAndUpdate(
      { _id: id, doctor: doctorId, status: "in-progress" },
      { status: "completed" },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Appointment not found or not authorized to complete" });
    }

    res.json({
      message: "Appointment marked as completed",
      appointment: {
        _id: updated._id,
        patient: updated.patient,
        doctor: updated.doctor,
        date: updated.date.toISOString().split("T")[0],
        time: updated.time,
        issue: updated.issue,
        status: updated.status,
      },
    });
  } catch (err) {
    console.error("❌ Complete error:", err);
    res.status(500).json({ message: "Failed to complete appointment", error: err.message });
  }
};

// DELETE: Doctor rejects appointment (deletes it)
const rejectAppointment = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const deleted = await Appointment.findOneAndDelete({ _id: id, doctor: doctorId, status: "new" });
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found or not authorized to reject" });
    }

    res.json({ message: "Appointment rejected and deleted", id: deleted._id });
  } catch (err) {
    console.error("❌ Reject error:", err);
    res.status(500).json({ message: "Failed to reject appointment", error: err.message });
  }
};

// GET: All appointments for logged-in doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "firstName lastName email contact")
      .sort({ date: -1, time: 1 });

    const formatted = appointments.map(appt => ({
      _id: appt._id,
      patient: {
        _id: appt.patient._id,
        name: `${appt.patient.firstName} ${appt.patient.lastName}`,
        email: appt.patient.email,
        contact: appt.patient.contact,
      },
      issue: appt.issue,
      date: appt.date.toISOString().split("T")[0],
      time: appt.time,
      status: appt.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error in getDoctorAppointments:", error);
    res.status(500).json({ message: "Failed to fetch doctor's appointments", error: error.message });
  }
};

module.exports = {
  getSpecialties,
  getDoctorsBySpecialty,
  bookAppointment,
  getAppointmentCountByDate,
  getPatientAppointments,
  cancelAppointment,
  acceptAppointment,
  completeAppointment,
  getDoctorAppointments,
  rejectAppointment,
};
