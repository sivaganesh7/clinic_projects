/**
 * Application Constants
 */

export const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "General Medicine",
  "ENT",
  "Gynecology",
  "Ophthalmology",
];

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  NEW: "new",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const MAX_DAILY_APPOINTMENTS = 2;

export const USER_ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
};
