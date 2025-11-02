import {
  Home,
  Package,
  Gavel,
  User,
  LogIn,
  UserPlus,
  Plus,
  Bell,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useNavigationContext } from "../context/NavigationContext";
import ProductListingModal from "../features/dashboard/components/ProductListingModal";

const MarketplaceLayout = ({ children }) => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { interceptNavigation } = useNavigationContext();
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Public navigation items - available to all users
  const publicNavigationItems = [
    {
      id: "marketplace",
      label: "Marketplace",
      icon: Package,
      path: "/marketplace",
    },
    { id: "auctions", label: "Auctions", icon: Gavel, path: "/auctions" },
    { id: "trends", label: "Price Trends", icon: Home, path: "/trends" },
  ];

  // Protected navigation items - only for authenticated users
  const protectedNavigationItems = [
    {
      id: "my-products",
      label: "My Products",
      icon: Package,
      path: "/my-products",
    },
    {
      id: "my-auctions",
      label: "My Auctions",
      icon: Gavel,
      path: "/my-auctions",
    },
  ];

  const handleNavigation = (path) => {
    // Check if navigation is intercepted (for auction room exit modal)
    const canNavigate = interceptNavigation(path);
    if (canNavigate) {
      navigate(path);
    }
    setSidebarOpen(false); // Close sidebar on navigation
  };

  const handleProtectedAction = (action, requiresAuth = true) => {
    if (requiresAuth && !isAuthenticated) {
      // Redirect to login with return path
      navigate(
        `/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (action === "addProduct") {
      setProductModalOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/marketplace");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleProtectedAction("addProduct", true)}
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            List Product
          </Button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => navigate("/auth/login")}
          variant="outline"
          className="px-4 py-2"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/auth/register")}
          className="bg-green-600 text-white hover:bg-green-700 px-4 py-2"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo />
              {/* Desktop Navigation */}
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                {publicNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = window.location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </button>
                  );
                })}
                {/* Protected Navigation for Authenticated Users */}
                {isAuthenticated &&
                  protectedNavigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = window.location.pathname === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
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
            </div>

            <div className="flex items-center space-x-4">
              {renderAuthButtons()}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Logo />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {/* Public Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Explore
              </h3>
              {publicNavigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
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

            {/* Protected Navigation for Authenticated Users */}
            {isAuthenticated && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  My Account
                </h3>
                {protectedNavigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = window.location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
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
            )}

            {/* Authentication Section */}
            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <div>
                  {userProfile && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                          {userProfile.name
                            ? userProfile.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userProfile.role || "Member"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/auth/login");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate("/auth/register");
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <UserPlus className="w-5 h-5 mr-3" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Product Listing Modal - only show if authenticated */}
      {isAuthenticated && (
        <ProductListingModal
          isOpen={isProductModalOpen}
          onClose={() => setProductModalOpen(false)}
          onSuccess={() => {
            setProductModalOpen(false);
            // Refresh product list if on marketplace page
            if (window.location.pathname.includes("marketplace")) {
              window.location.reload();
            }
          }}
        />
      )}
    </div>
  );
};

export default MarketplaceLayout;
