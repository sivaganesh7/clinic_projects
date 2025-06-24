import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import PatientLogin from './pages/Patientlogin';
import DoctorLogin from './pages/Doctorlogin';
import PatientRegister from './pages/PatientRegister';
import DoctorRegister from './pages/DoctorRegister';

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<Homepage />} />
       <Route path="/patient-login" element={<PatientLogin />} />
       <Route path="/doctor-login" element={<DoctorLogin />} />
       <Route path="/patient-register" element={<PatientRegister />} />
       <Route path="/doctor-register" element={<DoctorRegister />} />
      </Routes>
    </Router>
  );
}

export default App;