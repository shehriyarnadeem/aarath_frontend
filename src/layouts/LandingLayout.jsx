import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

const LandingLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to auth or onboarding
    navigate("/auth/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Navbar
        isOpen={isMobileMenuOpen}
        onToggle={toggleMobileMenu}
        onGetStarted={handleGetStarted}
        showAuthButtons={true}
        transparent={false}
      />

      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 Aarath. All rights reserved.</p>
            <p>&copy; Developed by Misisoft (Private) Limited</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
