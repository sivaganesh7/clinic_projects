import api from "./api";

export const feedbackService = {
  submitFeedback: (data) => api.post("/api/feedbacks", data),
  getPatientFeedbacks: () => api.get("/api/feedbacks/patient/me"),
  getDoctorFeedbacks: () => api.get("/api/feedbacks/doctor/me"),
};

export default feedbackService;
