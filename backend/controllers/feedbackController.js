const Feedback = require('../models/Feedback');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

exports.submitFeedback = async (req, res) => {
  try {
    const { appointmentId, doctorId, rating, comments } = req.body;
    const patientId = req.user?.userId;

    // Validate required fields
    if (!appointmentId || !doctorId || !rating) {
      return res.status(400).json({ message: 'Missing required fields: appointmentId, doctorId, rating' });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID format' });
    }

    // Verify the appointment exists and belongs to this patient
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: patientId,
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found or does not belong to you',
      });
    }

    // Enforce Rule: Feedback is only allowed for COMPLETED appointments
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        message: `Feedback can only be submitted for completed consultations. Current status: '${appointment.status}'.`,
      });
    }

    // Verify doctor matches
    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(400).json({
        message: 'Doctor ID does not match the appointment doctor',
      });
    }

    // Check if feedback already exists for this appointment
    const existingFeedback = await Feedback.findOne({ appointmentId });
    if (existingFeedback) {
      return res.status(400).json({
        message: 'Feedback already submitted for this appointment',
      });
    }

    const feedback = new Feedback({
      appointmentId,
      doctorId,
      patientId,
      rating: numRating,
      comments: comments ? String(comments).trim() : '',
    });

    await feedback.save();
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

exports.getPatientFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ patientId: req.user?.userId })
      .populate('doctorId', 'firstName lastName specialization')
      .populate('appointmentId', 'date time issue status')
      .sort({ submittedAt: -1 });

    const formatted = feedbacks.map((fb) => ({
      _id: fb._id,
      doctor: fb.doctorId
        ? `Dr. ${fb.doctorId.firstName} ${fb.doctorId.lastName}`
        : 'Doctor',
      doctorId: fb.doctorId?._id || fb.doctorId,
      appointment: fb.appointmentId
        ? {
            _id: fb.appointmentId._id,
            date: fb.appointmentId.date,
            time: fb.appointmentId.time,
            issue: fb.appointmentId.issue,
            status: fb.appointmentId.status,
          }
        : null,
      appointmentId: fb.appointmentId?._id || fb.appointmentId,
      rating: fb.rating,
      comments: fb.comments,
      submittedAt: fb.submittedAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching feedbacks:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

exports.getDoctorFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ doctorId: req.user?.userId })
      .populate('patientId', 'firstName lastName')
      .populate('appointmentId', 'date time issue status')
      .sort({ submittedAt: -1 });

    const formatted = feedbacks.map((fb) => ({
      _id: fb._id,
      patient: fb.patientId
        ? `${fb.patientId.firstName} ${fb.patientId.lastName}`
        : 'Patient',
      patientId: fb.patientId?._id || fb.patientId,
      appointment: fb.appointmentId
        ? {
            _id: fb.appointmentId._id,
            date: fb.appointmentId.date,
            time: fb.appointmentId.time,
            issue: fb.appointmentId.issue,
            status: fb.appointmentId.status,
          }
        : null,
      appointmentId: fb.appointmentId?._id || fb.appointmentId,
      rating: fb.rating,
      comments: fb.comments,
      submittedAt: fb.submittedAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching doctor feedbacks:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};