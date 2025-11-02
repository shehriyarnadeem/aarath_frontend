import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Component that protects routes requiring authentication
const ProtectedRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const location = useLocation();
  console.log(userProfile, "ooosss");
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  const returnTo = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`${redirectTo}`} replace />;
};

// Component that redirects authenticated users away from auth pages
const PublicOnlyRoute = ({ children, redirectTo = "/marketplace" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};

export { ProtectedRoute, PublicOnlyRoute };
