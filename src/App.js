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
import Prescriptions from './pages/Prescriptions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/patient-appointments" element={<PatientAppointments />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        

        {/* ✅ Protect sensitive routes */}
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
  );
}

export default App;
