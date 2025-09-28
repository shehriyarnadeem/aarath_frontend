import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import { AuthProvider, useAuth } from "../context/AuthContext";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Overview from "../features/dashboard/pages/Overview";
import ProductSearch from "../features/dashboard/pages/ProductSearch";
import Home from "../features/landing/pages/Home";
import OnboardingFlow from "../features/onboarding/pages/OnboardingFlow";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LandingLayout from "../layouts/LandingLayout";

// Landing Pages

// Auth Pages

// Onboarding Pages

// Dashboard Pages

// Dashboard Pages

// Context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // Check if profile is completed for non-onboarding routes
  const isOnboardingRoute = window.location.pathname === "/onboarding";
  if (userProfile && !userProfile.profileCompleted && !isOnboardingRoute) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleGetStarted = () => {
    // Navigate to auth
    window.location.href = "/auth/login";
  };

  const handleContinueAsGuest = () => {
    // Navigate to public dashboard or features
    console.log("Continue as guest");
  };

  return (
    <Routes>
      {/* Landing Routes */}
      <Route
        path="/"
        element={
          <LandingLayout>
            <Home
              onGetStarted={handleGetStarted}
              onContinueAsGuest={handleContinueAsGuest}
            />
          </LandingLayout>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login
                onSuccess={(user) => {
                  console.log("Login successful:", user);
                  // Will be handled by ProtectedRoute logic
                  window.location.href = "/dashboard";
                }}
                onSwitchToRegister={() => {
                  window.location.href = "/auth/register";
                }}
              />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <Register
                onSuccess={(user) => {
                  console.log("Registration successful:", user);
                  // Will be handled by ProtectedRoute logic
                  window.location.href = "/dashboard";
                }}
                onSwitchToLogin={() => {
                  window.location.href = "/auth/login";
                }}
              />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Onboarding Routes */}
      <Route path="/onboarding" element={<OnboardingFlow />} />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/search" element={<ProductSearch />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
