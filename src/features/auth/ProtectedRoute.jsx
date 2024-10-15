import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCheck } from './authWrapper';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthCheck();

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/QuickEase/" replace />;
};

export default ProtectedRoute;
