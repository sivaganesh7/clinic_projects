const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Import routes
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
// Add feedback routes

// Mount routes
app.use("/api/doctor", doctorRoutes);

app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", authMiddleware, prescriptionRoutes);
// app.js or server.js
app.use("/api/feedbacks", feedbackRoutes);
// Add feedback routes with auth

// Default route
app.get("/", (req, res) => {
  res.send("🩺 MediTrack Lite API is running...");
});

// 404 Handler (for unknown routes)
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

// Function to connect to MongoDB with retry logic
const connectToDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit if database connection fails
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectToDatabase(); // Ensure DB connection before starting server
  app.listen(PORT, () => {
    const currentTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    console.log(`🚀 Server running on http://localhost:${PORT} at ${currentTime} IST`);
  });
};

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});