import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, tokenKey = 'patientToken', redirectTo = '/patient-login' }) => {
  const token = localStorage.getItem(tokenKey);
  return token ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
