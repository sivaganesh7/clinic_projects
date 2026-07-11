import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import PatientLogin from './pages/Patientlogin';
import DoctorLogin from './pages/Doctorlogin';
import PatientRegister from './pages/PatientRegister';
import DoctorRegister from './pages/DoctorRegister';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import ProtectedRoute from './components/ProtectedRoute';
import PatientAppointments from './pages/PatientAppointments';
import PatientPrescriptions from './pages/PatientPrescriptions';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorPrescriptions from './pages/DoctorPrescriptions';
import PatientFeedbacks from './pages/PatientFeedback';
import DoctorProfile from './pages/DoctorProfile';
import { DoctorProvider } from './context/DoctorContext';
import DoctorFeedback from './pages/DoctorFeedback';

function App() {
  return (
    <DoctorProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />

          {/* Patient protected routes */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute tokenKey="patientToken" redirectTo="/patient-login">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute tokenKey="patientToken" redirectTo="/patient-login">
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-appointments"
            element={
              <ProtectedRoute tokenKey="patientToken" redirectTo="/patient-login">
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute tokenKey="patientToken" redirectTo="/patient-login">
                <PatientPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-feedback"
            element={
              <ProtectedRoute tokenKey="patientToken" redirectTo="/patient-login">
                <PatientFeedbacks />
              </ProtectedRoute>
            }
          />

          {/* Doctor protected routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute tokenKey="token" redirectTo="/doctor-login">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-appointment"
            element={
              <ProtectedRoute tokenKey="token" redirectTo="/doctor-login">
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-prescriptions"
            element={
              <ProtectedRoute tokenKey="token" redirectTo="/doctor-login">
                <DoctorPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-profile"
            element={
              <ProtectedRoute tokenKey="token" redirectTo="/doctor-login">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-feedback"
            element={
              <ProtectedRoute tokenKey="token" redirectTo="/doctor-login">
                <DoctorFeedback />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </DoctorProvider>
  );
}

export default App;
