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
          <Route path="/" element={<Homepage />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/patient-appointments" element={<PatientAppointments />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointment" element={<DoctorAppointments />} />
          <Route path="/doctor-prescriptions" element={<DoctorPrescriptions />} />
          <Route path="/patient-feedback" element={<PatientFeedbacks />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-feedback" element={<DoctorFeedback />} />

          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </DoctorProvider>
  );
}

export default App;
