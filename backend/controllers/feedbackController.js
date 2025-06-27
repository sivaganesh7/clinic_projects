const Feedback = require('../models/Feedback');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

exports.submitFeedback = async (req, res) => {
  try {
    const { appointmentId, doctorId, rating, comments } = req.body;

    // Validate required fields
    if (!appointmentId || !doctorId || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
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
      patient: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found or does not belong to you',
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
      patientId: req.user.userId,
      rating,
      comments: comments || '',
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
    const feedbacks = await Feedback.find({ patientId: req.user.userId })
      .populate('doctorId', 'name')
      .populate('appointmentId', 'date');

    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};