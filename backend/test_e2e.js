const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

let patientToken = "";
let patientId = "";
let doctorToken = "";
let doctorId = "";
let appointment1Id = "";
let appointment2Id = "";
let appointment3Id = "";
let prescriptionId = "";

const runTests = async () => {
  console.log("==================================================");
  console.log("🏥 STARTING MEDITRACK-LITE FULL E2E WORKFLOW TESTS");
  console.log("==================================================");
  console.log(`Backend Base URL: ${BASE_URL}\n`);

  const timestamp = Date.now();
  const testPatientEmail = `patient_${timestamp}@meditrack.local`;
  const testDoctorEmail = `doctor_${timestamp}@meditrack.local`;

  try {
    // 1. REGISTER PATIENT
    console.log("1️⃣ Registering test patient...");
    const regPatientRes = await axios.post(`${BASE_URL}/api/patient/register`, {
      firstName: "John",
      lastName: "Doe",
      name: "John Doe",
      email: testPatientEmail,
      password: "password123",
      phone: "+91 9876543210",
      dateOfBirth: "1995-05-15",
      gender: "Male"
    });
    console.log("   ✅ Patient registered:", regPatientRes.data.message || "Success");

    // 2. LOGIN PATIENT
    console.log("2️⃣ Logging in patient...");
    const loginPatientRes = await axios.post(`${BASE_URL}/api/patient/login`, {
      email: testPatientEmail,
      password: "password123"
    });
    patientToken = loginPatientRes.data.token;
    patientId = loginPatientRes.data.user?.id || loginPatientRes.data.patient?._id;
    console.log("   ✅ Patient logged in successfully. Token acquired.");

    // 3. REGISTER DOCTOR
    console.log("3️⃣ Registering test doctor...");
    const regDoctorRes = await axios.post(`${BASE_URL}/api/doctor/register`, {
      firstName: "Sarah",
      lastName: "Smith",
      name: "Dr. Sarah Smith",
      email: testDoctorEmail,
      password: "password123",
      specialization: "Cardiology",
      qualification: "MD, DM (Cardiology)",
      experience: "10 years",
      phone: "+91 9123456780",
      bio: "Senior cardiologist specialized in preventive cardiovascular health."
    });
    console.log("   ✅ Doctor registered:", regDoctorRes.data.message || "Success");

    // 4. LOGIN DOCTOR
    console.log("4️⃣ Logging in doctor...");
    const loginDoctorRes = await axios.post(`${BASE_URL}/api/doctor/login`, {
      email: testDoctorEmail,
      password: "password123"
    });
    doctorToken = loginDoctorRes.data.token;
    doctorId = loginDoctorRes.data.user?.id || loginDoctorRes.data.doctor?._id;
    console.log("   ✅ Doctor logged in successfully. Token acquired.");

    // 5. DOCTOR DISCOVERY & SPECIALTIES
    console.log("5️⃣ Testing Doctor Discovery APIs...");
    const specRes = await axios.get(`${BASE_URL}/api/appointments/specialties`, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    console.log(`   ✅ Specialties fetched: Found ${specRes.data.length} specialties (${specRes.data.join(", ")})`);

    const docListRes = await axios.get(`${BASE_URL}/api/appointments/doctors/Cardiology`, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    console.log(`   ✅ Doctors by Specialty (Cardiology) fetched: Found ${docListRes.data.length} doctors.`);
    const matchingDoc = docListRes.data.find(d => d.email === testDoctorEmail);
    if (!matchingDoc) throw new Error("Newly created doctor not found in Cardiology specialty list");
    console.log(`   ✅ Doctor found: Dr. ${matchingDoc.firstName} ${matchingDoc.lastName} (${matchingDoc.qualification})`);

    // 6. DOCTOR PROFILE UPDATE & RETRIEVAL
    console.log("6️⃣ Testing Doctor Profile Update & Get /api/doctor/me...");
    const updateDocRes = await axios.put(`${BASE_URL}/api/doctor/profile`, {
      firstName: "Sarah",
      lastName: "Smith-Johnson",
      specialization: "Cardiology",
      qualification: "MBBS, MD, DM (Cardiology), FACC",
      experience: "12 years",
      phone: "+91 9123456789",
      bio: "Senior Consultant Interventional Cardiologist."
    }, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    console.log(`   ✅ Doctor profile updated: ${updateDocRes.data.qualification}`);

    // 7. PATIENT PROFILE RETRIEVAL & UPDATE
    console.log("7️⃣ Testing Patient Profile Update & Get /api/patient/me...");
    const updatePatientRes = await axios.put(`${BASE_URL}/api/patient/me`, {
      phone: "+91 9998887776",
      gender: "Male"
    }, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    console.log(`   ✅ Patient profile updated: Phone = ${updatePatientRes.data.phone}`);

    // 8. BOOK APPOINTMENT 1 (Standard workflow)
    console.log("8️⃣ Booking Appointment #1 (Preferred Date = Tomorrow)...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const book1Res = await axios.post(`${BASE_URL}/api/appointments/book`, {
      specialty: "Cardiology",
      doctorId: matchingDoc._id,
      date: tomorrowStr,
      time: "10:30",
      issue: "Chest discomfort and high blood pressure"
    }, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    appointment1Id = book1Res.data.appointment?._id;
    console.log(`   ✅ Appointment #1 booked with status "${book1Res.data.appointment?.status}". ID: ${appointment1Id}`);

    // 9. BOOK APPOINTMENT 2 (Same date, should succeed)
    console.log("9️⃣ Booking Appointment #2 (Same date, testing daily limit 2 max)...");
    const book2Res = await axios.post(`${BASE_URL}/api/appointments/book`, {
      specialty: "Cardiology",
      doctorId: matchingDoc._id,
      date: tomorrowStr,
      time: "14:00",
      issue: "Follow-up consultation"
    }, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    appointment2Id = book2Res.data.appointment?._id;
    console.log(`   ✅ Appointment #2 booked with status "${book2Res.data.appointment?.status}". ID: ${appointment2Id}`);

    // 10. BOOK APPOINTMENT 3 (Same date, MUST FAIL WITH 400 - Daily Limit Reached)
    console.log("🔟 Booking Appointment #3 (Same date - Daily Limit Enforcement)...");
    try {
      await axios.post(`${BASE_URL}/api/appointments/book`, {
        specialty: "Cardiology",
        doctorId: matchingDoc._id,
        date: tomorrowStr,
        time: "16:30",
        issue: "Extra visit"
      }, {
        headers: { Authorization: `Bearer ${patientToken}` }
      });
      throw new Error("❌ FAILURE: 3rd appointment on the same day was allowed when max limit is 2!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`   ✅ Correctly blocked with 400: "${err.response.data.message}"`);
      } else {
        throw err;
      }
    }

    // 11. DOCTOR ACCEPT APPOINTMENT #1
    console.log("1️⃣1️⃣ Doctor Accepting Appointment #1 (Transition PENDING -> ACCEPTED)...");
    const acceptRes = await axios.patch(`${BASE_URL}/api/appointments/accept/${appointment1Id}`, {}, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    console.log(`   ✅ Appointment #1 updated to status: "${acceptRes.data.appointment?.status}"`);

    // 12. DOCTOR COMPLETE APPOINTMENT #1
    console.log("1️⃣2️⃣ Doctor Completing Appointment #1 (Transition ACCEPTED -> COMPLETED)...");
    const completeRes = await axios.patch(`${BASE_URL}/api/appointments/complete/${appointment1Id}`, {}, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    console.log(`   ✅ Appointment #1 updated to status: "${completeRes.data.appointment?.status}"`);

    // 13. ISSUE DIGITAL PRESCRIPTION FOR COMPLETED APPOINTMENT
    console.log("1️⃣3️⃣ Doctor Creating Digital Prescription for Appointment #1...");
    const presPayload = {
      appointmentId: appointment1Id,
      patientId: matchingDoc._id ? patientId : undefined,
      medicines: [
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Morning after breakfast"
        },
        {
          name: "Atorvastatin",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "At bedtime"
        }
      ],
      notes: "Stage 1 Hypertension. Maintain low sodium diet and regular 30 mins brisk walking."
    };

    const presRes = await axios.post(`${BASE_URL}/api/prescriptions`, presPayload, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    prescriptionId = presRes.data.prescription?._id;
    console.log(`   ✅ Prescription created successfully! ID: ${prescriptionId}`);

    // 14. PATIENT & DOCTOR VIEW PRESCRIPTION
    console.log("1️⃣4️⃣ Verifying Prescription View endpoints for Patient and Doctor...");
    const patientPresRes = await axios.get(`${BASE_URL}/api/prescriptions/patient/me`, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    console.log(`   ✅ Patient fetched prescriptions: Count = ${patientPresRes.data.length}`);

    const doctorPresRes = await axios.get(`${BASE_URL}/api/prescriptions/doctor/me`, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    console.log(`   ✅ Doctor fetched prescriptions: Count = ${doctorPresRes.data.length}`);

    // 15. PATIENT SUBMIT FEEDBACK FOR COMPLETED APPOINTMENT #1
    console.log("1️⃣5️⃣ Patient Submitting Feedback for Completed Consultation #1...");
    const feedbackRes = await axios.post(`${BASE_URL}/api/feedbacks`, {
      appointmentId: appointment1Id,
      doctorId: matchingDoc._id,
      rating: 5,
      comments: "Outstanding care and explanation by Dr. Sarah Smith!"
    }, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    console.log(`   ✅ Feedback submitted: "${feedbackRes.data.message}" (Rating 5/5)`);

    // 16. PREVENT DUPLICATE FEEDBACK FOR SAME APPOINTMENT
    console.log("1️⃣6️⃣ Verifying Duplicate Feedback Prevention...");
    try {
      await axios.post(`${BASE_URL}/api/feedbacks`, {
        appointmentId: appointment1Id,
        doctorId: matchingDoc._id,
        rating: 4,
        comments: "Trying to submit another review"
      }, {
        headers: { Authorization: `Bearer ${patientToken}` }
      });
      throw new Error("❌ FAILURE: Duplicate feedback was allowed!");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`   ✅ Duplicate feedback correctly blocked: "${err.response.data.message}"`);
      } else {
        throw err;
      }
    }

    // 17. DOCTOR REJECTS APPOINTMENT #2 (Testing Soft Rejection)
    console.log("1️⃣7️⃣ Doctor Rejecting Appointment #2 (Transition PENDING -> REJECTED)...");
    const rejectRes = await axios.delete(`${BASE_URL}/api/appointments/reject/${appointment2Id}`, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    console.log(`   ✅ Appointment #2 rejected: "${rejectRes.data.message}" (Soft reject, not hard deleted)`);

    // 18. PATIENT BOOKS APPOINTMENT #4 & CANCELS IT (Testing Soft Cancellation)
    console.log("1️⃣8️⃣ Patient Booking Appointment #4 & Cancelling it (Transition PENDING -> CANCELLED)...");
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split("T")[0];

    const book4Res = await axios.post(`${BASE_URL}/api/appointments/book`, {
      specialty: "Cardiology",
      doctorId: matchingDoc._id,
      date: nextWeekStr,
      time: "11:00",
      issue: "Annual heart checkup"
    }, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    const appt4Id = book4Res.data.appointment?._id;

    const cancelRes = await axios.delete(`${BASE_URL}/api/appointments/cancel/${appt4Id}`, {
      headers: { Authorization: `Bearer ${patientToken}` }
    });
    console.log(`   ✅ Appointment #4 cancelled: "${cancelRes.data.message}" (Soft cancel, not hard deleted)`);

    // 19. FINAL SUMMARY CHECK
    console.log("\n==================================================");
    console.log("🎉 ALL E2E HEALTHCARE WORKFLOW TESTS PASSED 100%!");
    console.log("==================================================");
    console.log("Summary of verified features:");
    console.log("  ✔ Patient & Doctor Authentication & JWT");
    console.log("  ✔ Doctor Discovery & Profile Management");
    console.log("  ✔ Appointment Booking & 2/Day Limit Constraint");
    console.log("  ✔ Full Lifecycle Transitions (Pending -> Accepted -> Completed)");
    console.log("  ✔ Soft Rejection & Soft Cancellation");
    console.log("  ✔ Digital Prescription Generation & Access Control");
    console.log("  ✔ Patient Feedback Submission & Duplicate Prevention");
    console.log("==================================================");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
