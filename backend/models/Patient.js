const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^.+@meditrack\.local$/, "Email must be @meditrack.local"]
  },
  password:  { type: String, required: true },
  role:      { type: String, default: "patient" }
});

module.exports = mongoose.model("Patient", patientSchema);
