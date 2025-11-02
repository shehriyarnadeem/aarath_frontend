import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layouts
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "../components/RouteGuards";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Overview from "../features/dashboard/pages/Overview";
import ProductSearch from "../features/dashboard/pages/ProductSearch";
import AuctionRoomWrapper from "../features/dashboard/components/AuctionRoomWrapper";
import Marketplace from "../features/dashboard/pages/Marketplace";
import MyProducts from "../features/dashboard/pages/MyProducts";
import UserProfile from "../features/dashboard/pages/UserProfile";
import Home from "../features/landing/pages/Home";
import OnboardingFlow from "../features/onboarding/pages/OnboardingFlow";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";

// Helper function to extract return URL from query params
const getReturnUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get("returnTo") || "/marketplace";
};

const AppContent = () => {
  return (
    <Routes>
      {/* Landing page - main entry point */}
      <Route
        path="/"
        element={
          <AppLayout>
            <Home
              onGetStarted={() => (window.location.href = "/auth/login")}
              onContinueAsGuest={() => (window.location.href = "/marketplace")}
            />
          </AppLayout>
        }
      />

      {/* Public Routes - No authentication required */}
      <Route
        path="/marketplace"
        element={
          <AppLayout>
            <Marketplace />
          </AppLayout>
        }
      />

      <Route
        path="/auctions"
        element={
          <AppLayout>
            <AuctionRoomWrapper />
          </AppLayout>
        }
      />

      <Route
        path="/trends"
        element={
          <AppLayout>
            <Overview />
          </AppLayout>
        }
      />

      <Route
        path="/search"
        element={
          <AppLayout>
            <ProductSearch />
          </AppLayout>
        }
      />

      {/* Protected Routes - Authentication required */}
      <Route
        path="/my-products"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyProducts />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Authentication Routes */}
      <Route
        path="/auth/login"
        element={
          <AuthLayout>
            <Login
              onSuccess={() => {
                const returnUrl = getReturnUrl();
                window.location.href = returnUrl;
              }}
              onSwitchToRegister={() => {
                window.location.href = "/auth/register";
              }}
            />
          </AuthLayout>
        }
      />

      <Route
        path="/auth/register"
        element={
          <AuthLayout>
            <Register
              onSuccess={() => {
                const returnUrl = getReturnUrl();
                window.location.href = returnUrl;
              }}
              onSwitchToLogin={() => {
                window.location.href = "/auth/login";
              }}
            />
          </AuthLayout>
        }
      />

      {/* Onboarding Routes */}
      <Route
        path="/onboarding"
        element={
          <AuthLayout>
            <OnboardingFlow />
          </AuthLayout>
        }
      />

      {/* Legacy dashboard redirect */}
      <Route
        path="/dashboard"
        element={<Navigate to="/marketplace" replace />}
      />
      <Route
        path="/dashboard/*"
        element={<Navigate to="/marketplace" replace />}
      />

      {/* About page - alternative access to landing content */}
      <Route
        path="/about"
        element={
          <AppLayout>
            <Home
              onGetStarted={() => (window.location.href = "/auth/login")}
              onContinueAsGuest={() => (window.location.href = "/marketplace")}
            />
          </AppLayout>
        }
      />

      {/* Redirect unknown routes to marketplace */}
      <Route path="*" element={<Navigate to="/marketplace" />} />
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
