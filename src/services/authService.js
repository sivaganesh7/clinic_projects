import api from "./api";

export const authService = {
  // Patient Auth
  patientRegister: (data) => api.post("/api/patient/register", data),
  patientLogin: (data) => api.post("/api/patient/login", data),
  getPatientProfile: () => api.get("/api/patient/me"),
  updatePatientProfile: (data) => api.put("/api/patient/me", data),

  // Doctor Auth & Profiles
  doctorRegister: (data) => api.post("/api/doctor/register", data),
  doctorLogin: (data) => api.post("/api/doctor/login", data),
  getDoctorProfile: () => api.get("/api/doctor/me"),
  updateDoctorProfile: (data) => api.put("/api/doctor/profile", data),
  getAllDoctors: () => api.get("/api/doctor/all"),
};

export default authService;
