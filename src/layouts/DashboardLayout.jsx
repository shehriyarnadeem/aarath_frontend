import { Home, User, Bell, Plus, LogOut, Package, Gavel } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useNavigationContext } from "../context/NavigationContext";
import ProductListingModal from "../features/dashboard/components/ProductListingModal";

const DashboardLayout = ({ children }) => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const { interceptNavigation } = useNavigationContext();
  const [isProductModalOpen, setProductModalOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: Package,
      path: "/dashboard/marketplace",
    },
    {
      id: "auction",
      label: "Auction Room",
      icon: Gavel,
      path: "/dashboard/auction",
    },
    {
      id: "my-products",
      label: "My Products",
      icon: Package,
      path: "/dashboard/my-products",
    },
  ];

  const handleNavigation = (path) => {
    // Check if navigation is intercepted (for auction room exit modal)
    const canNavigate = interceptNavigation(path);
    if (canNavigate) {
      navigate(path);
    }
    // If canNavigate is false, the interceptor will handle showing the modal
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors order-1 md:order-2"
                onClick={() => setProductModalOpen(true)}
                aria-label="Add Product"
              >
                <Plus className="w-5 h-5" />
              </button>
              {/* Hamburger for mobile */}
              <button
                className="md:hidden p-2 rounded-full text-gray-600 hover:text-primary-700 hover:bg-gray-100 order-2 md:order-1"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
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
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full hidden md:inline-flex">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - fixed for all screens */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden"
            role="button"
            tabIndex={0}
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                setSidebarOpen(false);
              }
            }}
          />
        )}
        <aside
          className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col z-50 md:translate-x-0 md:fixed md:block transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* Close button for mobile */}
          <div className="flex items-center justify-between md:hidden px-4 py-3 border-b border-gray-200">
            <Logo />
            <button
              className="p-2 rounded-full text-gray-600 hover:text-primary-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
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
          <nav className="mt-8 px-4 flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = window.location.pathname === item.path;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        handleNavigation(item.path);
                        setSidebarOpen(false); // close on mobile nav
                      }}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary-100 text-primary-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          {/* User Profile & Logout Section */}
          <div className="p-4 border-t border-gray-200">
            {/* User Profile Info */}
            {userProfile && (
              <button
                onClick={() => {
                  handleNavigation("/dashboard/profile");
                  setSidebarOpen(false);
                }}
                className="w-full mb-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium group-hover:bg-primary-600 transition-colors">
                    {userProfile.name
                      ? userProfile.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="ml-3 flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userProfile.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userProfile.role
                        ? userProfile.role.toLowerCase()
                        : "Member"}
                    </p>
                  </div>
                  <User className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-hidden md:ml-64">{children}</main>
      </div>
      <ProductListingModal
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSuccess={() => {
          /* Optionally refresh product list here */
        }}
      />
    </div>
  );
};

export default DashboardLayout;
