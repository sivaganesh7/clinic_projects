import api from "./api";

export const appointmentService = {
  getSpecialties: () => api.get("/api/appointments/specialties"),
  getDoctorsBySpecialty: (specialty) => api.get(`/api/appointments/doctors/${specialty}`),
  getDailyAppointmentCount: (date) => api.get(`/api/appointments/count/${date}`),
  bookAppointment: (data) => api.post("/api/appointments/book", data),
  getPatientAppointments: () => api.get("/api/appointments/my"),
  getDoctorAppointments: () => api.get("/api/appointments/me"),
  acceptAppointment: (id) => api.patch(`/api/appointments/accept/${id}`),
  completeAppointment: (id) => api.patch(`/api/appointments/complete/${id}`),
  rejectAppointment: (id) => api.delete(`/api/appointments/reject/${id}`),
  cancelAppointment: (id) => api.delete(`/api/appointments/cancel/${id}`),
};

export default appointmentService;
