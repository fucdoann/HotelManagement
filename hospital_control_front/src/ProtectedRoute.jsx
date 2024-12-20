import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Context/AuthProvider';
import Loader from './common/Loader';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loader/>; // Optional loader
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (roles && roles.includes(user.role.trim())) {
    return <Outlet />;
  }

  return <Navigate to="/" />;

};

export default ProtectedRoute;
