const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// GET: All unique doctor specialties
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialization");
    const uniqueSpecialties = specialties
      .filter((s) => s && s.trim())
      .map((s) => s.trim());
    res.json(uniqueSpecialties);
  } catch (error) {
    console.error("Error in getSpecialties:", error);
    res.status(500).json({ message: "Error fetching specialties" });
  }
};

// GET: All doctors with professional profile info (Doctor Discovery)
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select("firstName lastName specialization qualification experience email phone bio")
      .sort({ firstName: 1 });
    res.json(doctors);
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// GET: Doctors by specialization
const getDoctorsBySpecialty = async (req, res) => {
  try {
    const specialty = req.params.specialty.trim();
    const escapedSpecialty = specialty.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const doctors = await Doctor.find({
      specialization: { $regex: `^${escapedSpecialty}$`, $options: "i" },
    }).select("firstName lastName specialization qualification experience email phone bio");
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
    return res.status(400).json({ message: "Doctor, date, and time are required" });
  }

  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  // Ensure date is today or in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(appointmentDate);
  checkDate.setHours(0, 0, 0, 0);
  if (checkDate < today) {
    return res.status(400).json({ message: "Cannot book appointments for past dates" });
  }

  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ message: "Invalid time format (HH:MM in 24hr)" });
  }

  try {
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ message: "Selected doctor does not exist" });
    }

    // Extract only YYYY-MM-DD from date for comparison
    const dateOnly = appointmentDate.toISOString().split("T")[0];
    const existingCount = await Appointment.countDocuments({
      patient: patientId,
      status: { $nin: ["cancelled", "rejected"] },
      $expr: {
        $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, dateOnly],
      },
    });

    if (existingCount >= 2) {
      return res.status(400).json({ message: "You can only book 2 active appointments per day" });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date: appointmentDate,
      time,
      issue: issue || "",
      status: "pending",
    });

    await newAppointment.save();
    await newAppointment.populate("doctor", "firstName lastName specialization qualification experience email");

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        _id: newAppointment._id,
        patient: patientId,
        doctor: {
          _id: newAppointment.doctor._id,
          name: `Dr. ${newAppointment.doctor.firstName} ${newAppointment.doctor.lastName}`,
          specialization: newAppointment.doctor.specialization,
          email: newAppointment.doctor.email,
        },
        date: newAppointment.date.toISOString().split("T")[0],
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
      status: { $nin: ["cancelled", "rejected"] },
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
      .populate("doctor", "firstName lastName specialization qualification experience email")
      .sort({ date: -1, time: 1 });

    const formattedAppointments = appointments.map((appt) => ({
      _id: appt._id,
      doctor: appt.doctor
        ? {
            _id: appt.doctor._id,
            name: `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`,
            firstName: appt.doctor.firstName,
            lastName: appt.doctor.lastName,
            specialization: appt.doctor.specialization,
            qualification: appt.doctor.qualification,
            experience: appt.doctor.experience,
            email: appt.doctor.email,
          }
        : { _id: null, name: "Doctor" },
      date: appt.date ? appt.date.toISOString().split("T")[0] : "",
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

// DELETE/PATCH: Patient cancels their own appointment (status -> cancelled)
const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const { id } = req.params;

    const appointment = await Appointment.findOne({ _id: id, patient: patientId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not authorized" });
    }

    if (["completed", "cancelled", "rejected"].includes(appointment.status.toLowerCase())) {
      return res.status(400).json({
        message: `Cannot cancel an appointment that is already ${appointment.status}`,
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully", id: appointment._id, appointment });
  } catch (err) {
    console.error("❌ Cancel error:", err);
    res.status(500).json({ message: "Failed to cancel appointment", error: err.message });
  }
};

// PATCH: Doctor accepts appointment (status -> accepted)
const acceptAppointment = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not authorized to accept" });
    }

    if (!["pending", "new"].includes(appointment.status.toLowerCase())) {
      return res.status(400).json({
        message: `Cannot accept appointment with current status '${appointment.status}'. Must be pending.`,
      });
    }

    appointment.status = "accepted";
    await appointment.save();
    await appointment.populate("patient", "firstName lastName email phone");

    res.json({
      message: "Appointment accepted successfully",
      appointment: {
        _id: appointment._id,
        patient: {
          _id: appointment.patient?._id || appointment.patient,
          name: appointment.patient
            ? `${appointment.patient.firstName || ""} ${appointment.patient.lastName || ""}`.trim()
            : "Unknown Patient",
          email: appointment.patient?.email,
          phone: appointment.patient?.phone,
        },
        doctor: appointment.doctor,
        date: appointment.date.toISOString().split("T")[0],
        time: appointment.time,
        issue: appointment.issue,
        status: appointment.status,
      },
    });
  } catch (err) {
    console.error("❌ Accept error:", err);
    res.status(500).json({ message: "Failed to accept appointment", error: err.message });
  }
};

// PATCH: Doctor completes appointment (status -> completed)
const completeAppointment = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not authorized to complete" });
    }

    if (!["accepted", "in-progress"].includes(appointment.status.toLowerCase())) {
      return res.status(400).json({
        message: `Only accepted consultations can be marked as completed. Current status: '${appointment.status}'`,
      });
    }

    appointment.status = "completed";
    await appointment.save();
    await appointment.populate("patient", "firstName lastName email phone");

    res.json({
      message: "Appointment marked as completed",
      appointment: {
        _id: appointment._id,
        patient: {
          _id: appointment.patient?._id || appointment.patient,
          name: appointment.patient
            ? `${appointment.patient.firstName || ""} ${appointment.patient.lastName || ""}`.trim()
            : "Unknown Patient",
          email: appointment.patient?.email,
          phone: appointment.patient?.phone,
        },
        doctor: appointment.doctor,
        date: appointment.date.toISOString().split("T")[0],
        time: appointment.time,
        issue: appointment.issue,
        status: appointment.status,
      },
    });
  } catch (err) {
    console.error("❌ Complete error:", err);
    res.status(500).json({ message: "Failed to complete appointment", error: err.message });
  }
};

// PATCH/DELETE: Doctor rejects appointment (status -> rejected)
const rejectAppointment = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { id } = req.params;

    const appointment = await Appointment.findOne({ _id: id, doctor: doctorId });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not authorized to reject" });
    }

    if (!["pending", "new"].includes(appointment.status.toLowerCase())) {
      return res.status(400).json({
        message: `Cannot reject appointment with current status '${appointment.status}'. Must be pending.`,
      });
    }

    appointment.status = "rejected";
    await appointment.save();

    res.json({ message: "Appointment rejected successfully", id: appointment._id, appointment });
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
      .populate("patient", "firstName lastName email phone")
      .sort({ date: -1, time: 1 });

    const formatted = appointments.map((appt) => ({
      _id: appt._id,
      patient: appt.patient
        ? {
            _id: appt.patient._id,
            name: `${appt.patient.firstName || ""} ${appt.patient.lastName || ""}`.trim(),
            email: appt.patient.email,
            phone: appt.patient.phone || "",
          }
        : { _id: null, name: "Unknown Patient" },
      issue: appt.issue,
      date: appt.date ? appt.date.toISOString().split("T")[0] : "",
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
  getAllDoctors,
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
