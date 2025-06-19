import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAdmin }) => {
  const token = localStorage.getItem(isAdmin ? 'adminToken' : 'token');
  return token ? children : <Navigate to={isAdmin ? "/admin-login" : "/login"} />;
};

export default PrivateRoute;