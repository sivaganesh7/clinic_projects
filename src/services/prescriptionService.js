import api from "./api";

export const prescriptionService = {
  createPrescription: (data) => api.post("/api/prescriptions", data),
  getPatientPrescriptions: () => api.get("/api/prescriptions/patient/me"),
  getDoctorPrescriptions: () => api.get("/api/prescriptions/doctor/me"),
};

export default prescriptionService;
