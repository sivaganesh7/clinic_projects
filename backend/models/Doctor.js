const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^.+@meditrack\.local$/, "Email must be @meditrack.local"]
  },
  specialization: { type: String, required: true },
  password:  { type: String, required: true },
  role: { type: String, default: "doctor" }
});

module.exports = mongoose.model("Doctor", doctorSchema);
