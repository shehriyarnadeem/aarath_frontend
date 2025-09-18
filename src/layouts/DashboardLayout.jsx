import React from "react";
import {
  Home,
  Search,
  MessageCircle,
  User,
  Bell,
  Plus,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children, activeTab = "home", onTabChange }) => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [{ id: "home", label: "Home", icon: Home }];

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

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen flex flex-col">
          <nav className="mt-8 px-4 flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onTabChange && onTabChange(item.id)}
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
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {userProfile.name
                      ? userProfile.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userProfile.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userProfile.role
                        ? userProfile.role.toLowerCase()
                        : "Member"}
                    </p>
                  </div>
                </div>
              </div>
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
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
