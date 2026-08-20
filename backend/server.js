const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Import routes
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", authMiddleware, prescriptionRoutes);
app.use("/api/feedbacks", feedbackRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("🩺 MediTrack Lite API is running...");
});

// Centralized Error Handling Middleware
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");

app.use(notFoundHandler);
app.use(errorHandler);

// Function to connect to MongoDB with retry logic
const connectToDatabase = async () => {
  try {
    await connectDB();
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectToDatabase(); 
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