import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  TrendingUp,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Plus,
  Bell,
  Menu,
  X,
  ChevronDown,
  Gavel,
} from "lucide-react";

import Logo from "../components/Logo";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigationContext } from "../context/NavigationContext";
import ProductListingModal from "../features/dashboard/components/ProductListingModal";

const AppLayout = ({ children }) => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { interceptNavigation } = useNavigationContext();

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Public navigation items - always visible
  const publicNavItems = [
    { id: "home", label: "Home", path: "/", icon: Home },
    {
      id: "marketplace",
      label: "Marketplace",
      path: "/marketplace",
      icon: Package,
    },
    { id: "trends", label: "Price Trends", path: "/trends", icon: TrendingUp },
  ];

  // Protected navigation items - only for authenticated users
  const protectedNavItems = [
    {
      id: "my-products",
      label: "My Products",
      path: "/my-products",
      icon: Package,
    },
    { id: "auctions", label: "Auctions", path: "/auctions", icon: Gavel },
  ];

  const handleNavigation = (path) => {
    const canNavigate = interceptNavigation(path);
    if (canNavigate) {
      navigate(path);
      setMobileMenuOpen(false);
    }
  };

  const handleProtectedAction = (action) => {
    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?returnTo=${returnTo}`);
      return;
    }

    if (action === "addProduct") {
      setProductModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      setUserDropdownOpen(false); // Close dropdown first
      await logout();
      // Use window.location to ensure complete state reset
      window.location.href = "/marketplace";
    } catch (error) {
      console.error("Logout failed:", error);
      // Simple fallback if toast is not available
      alert("Logout failed. Please try again.");
    }
  };

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Debug info available in React DevTools
  const AuthSection = () => {
    if (isAuthenticated) {
      // Handle case where userProfile might be null or still loading
      const displayName = userProfile?.businessName || "N/A";
      const avatar = displayName.charAt(0).toUpperCase();

      return (
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {avatar}
            </div>
            <span className="hidden md:block text-gray-700 font-medium">
              {displayName}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setUserDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <Button
          onClick={() => navigate("/auth/login")}
          variant="outline"
          className="hidden sm:flex border-green-600 text-green-600 hover:bg-green-50"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/auth/register")}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          <span>Join</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md border-b border-gray-200 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Public Navigation */}
              {publicNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}

              {/* Protected Navigation - only for authenticated users */}
              {isAuthenticated &&
                protectedNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActivePath(item.path)
                          ? "bg-green-100 text-green-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* List Product Button - only for authenticated users */}
              {isAuthenticated && (
                <Button
                  onClick={() => handleProtectedAction("addProduct")}
                  className="hidden md:flex bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Product
                </Button>
              )}

              {/* Notifications - only for authenticated users */}
              {isAuthenticated && (
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <Bell className="w-5 h-5" />
                </button>
              )}

              {/* Auth Section */}
              <AuthSection />

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Logo />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4">
          {/* Public Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Explore
            </h3>
            <div className="space-y-1">
              {publicNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Protected Navigation */}
          {isAuthenticated && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                My Account
              </h3>
              <div className="space-y-1">
                {protectedNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActivePath(item.path)
                          ? "bg-green-100 text-green-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}

                {/* List Product Button for Mobile */}
                <button
                  onClick={() => {
                    handleProtectedAction("addProduct");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  List Product
                </button>

                {/* Logout Button for Mobile */}
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors border-t border-gray-200 mt-2 pt-4"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Authentication Section */}
          {!isAuthenticated && (
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate("/auth/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <LogIn className="w-5 h-5 mr-3" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/auth/register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5 mr-3" />
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Main Content with top padding for fixed header */}
      <main className="pt-16 w-full">{children}</main>

      {/* Product Listing Modal */}
      {isAuthenticated && (
        <ProductListingModal
          isOpen={isProductModalOpen}
          onClose={() => setProductModalOpen(false)}
          onSuccess={() => {
            setProductModalOpen(false);
            // Refresh if on marketplace
            if (location.pathname.includes("marketplace")) {
              window.location.reload();
            }
          }}
        />
      )}

      {/* Dropdown Overlay - Temporarily disabled for testing */}
      {false && userDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
