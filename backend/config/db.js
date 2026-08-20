const mongoose = require("mongoose");
const dns = require("dns");

// Set Google and Cloudflare DNS to avoid SRV query issues on some Windows network configurations
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop server on DB failure
  }
};

module.exports = connectDB;

