import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthLayout = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return children;
  }

  const returnTo = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`${redirectTo}`} replace />;
};

export default AuthLayout;
