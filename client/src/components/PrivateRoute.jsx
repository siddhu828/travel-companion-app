import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAdmin = false }) => {
  const storageKey = isAdmin ? 'admin' : 'user';
  const storedData = JSON.parse(localStorage.getItem(storageKey));
  const token = storedData?.token;

  // If no token, redirect to login
  if (!token) {
    return <Navigate to={isAdmin ? '/admin-login' : '/login'} />;
  }

  return children;
};

export default PrivateRoute;