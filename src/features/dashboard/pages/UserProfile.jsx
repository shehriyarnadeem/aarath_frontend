import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Star,
  Trophy,
  Package,
  TrendingUp,
  Calendar,
  Edit,
  Camera,
  Award,
  ShoppingCart,
  BarChart3,
  Target,
} from "lucide-react";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";
import { apiClient } from "../../../api/client";

const UserProfile = () => {
  const { userProfile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile stats from API
  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const response = await apiClient.users.getProfileStats(user.uid);
        setProfileStats(response.stats);
      } catch (error) {
        console.error("Error fetching profile stats:", error);
        // Fallback to mock data
        setProfileStats({
          totalListings: 24,
          successfulSales: 18,
          rating: 4.8,
          reviews: 156,
          joinedDate: "January 2024",
          responseRate: "98%",
          totalRevenue: "PKR 1,25,000",
          activeListings: 6,
          recentActivity: [],
          achievements: {
            topSeller: false,
            qualityProducts: true,
            fastResponder: true,
            premiumTrader: false,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [user?.uid]);

  const achievements = [
    {
      id: 1,
      title: "Top Seller",
      description: "Completed 50+ successful transactions",
      icon: Trophy,
      color: "text-yellow-600 bg-yellow-100",
      earned: profileStats?.achievements?.topSeller || false,
    },
    {
      id: 2,
      title: "Quality Products",
      description: "Maintained 4.5+ star rating",
      icon: Star,
      color: "text-blue-600 bg-blue-100",
      earned: profileStats?.achievements?.qualityProducts || false,
    },
    {
      id: 3,
      title: "Fast Responder",
      description: "90%+ response rate",
      icon: Target,
      color: "text-green-600 bg-green-100",
      earned: profileStats?.achievements?.fastResponder || false,
    },
    {
      id: 4,
      title: "Premium Trader",
      description: "Complete 100 transactions",
      icon: Award,
      color: "text-purple-600 bg-purple-100",
      earned: profileStats?.achievements?.premiumTrader || false,
    },
  ];

  const recentActivity = profileStats?.recentActivity || [];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "achievements", label: "Achievements" },
    { id: "activity", label: "Recent Activity" },
    { id: "settings", label: "Settings" },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "sale":
        return <ShoppingCart className="w-4 h-4" />;
      case "listing":
        return <Package className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      case "purchase":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "positive":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Cover Photo Section */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/15 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white/25 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="px-6 sm:px-8 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl sm:text-6xl font-bold shadow-xl ring-4 ring-white">
                  {userProfile?.name
                    ? userProfile.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <button className="absolute bottom-2 right-2 bg-white text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
                {/* Verification Badge */}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        {userProfile?.name ||
                          userProfile?.businessName ||
                          "User Profile"}
                      </h1>
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{profileStats?.rating || "4.8"}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-1">
                      {userProfile?.role
                        ? userProfile.role.charAt(0).toUpperCase() +
                          userProfile.role.slice(1)
                        : "Agricultural Trader"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {userProfile?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{userProfile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          Joined {profileStats?.joinedDate || "January 2024"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>
                          {profileStats?.totalListings || "0"} Products
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Professional Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">
                        RATING
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {profileStats?.rating || "4.8"}
                    </div>
                    <div className="text-xs text-blue-600/70">
                      From {profileStats?.reviews || "156"} reviews
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        LISTINGS
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {profileStats?.totalListings || "24"}
                    </div>
                    <div className="text-xs text-green-600/70">
                      {profileStats?.activeListings || "6"} active
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">
                        SALES
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {profileStats?.successfulSales || "18"}
                    </div>
                    <div className="text-xs text-purple-600/70">
                      {profileStats?.successfulSales &&
                      profileStats?.totalListings
                        ? Math.round(
                            (profileStats.successfulSales /
                              profileStats.totalListings) *
                              100
                          )
                        : 75}
                      % success rate
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <BarChart3 className="w-5 h-5 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">
                        REVENUE
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {profileStats?.totalRevenue || "PKR 1.25L"}
                    </div>
                    <div className="text-xs text-orange-600/70">This month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Professional Tabs */}
        <div className="mb-8 mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
            <nav className="flex space-x-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {index === 0 && <BarChart3 className="w-4 h-4" />}
                    {index === 1 && <Trophy className="w-4 h-4" />}
                    {index === 2 && <TrendingUp className="w-4 h-4" />}
                    {index === 3 && <User className="w-4 h-4" />}
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enhanced Performance Metrics */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Performance Analytics
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      Last 30 days
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 rounded-2xl border border-green-200/50 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-green-600 mb-1">
                            TOTAL REVENUE
                          </div>
                          <div className="text-3xl font-bold text-green-700">
                            {profileStats?.totalRevenue || "PKR 1,25,000"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          +12.5%
                        </span>
                        <span className="text-green-600">vs last month</span>
                      </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-blue-600 mb-1">
                            RESPONSE RATE
                          </div>
                          <div className="text-3xl font-bold text-blue-700">
                            {profileStats?.responseRate || "98%"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          Excellent
                        </span>
                        <span className="text-blue-600">Average: 1.2hrs</span>
                      </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 rounded-2xl border border-amber-200/50 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-amber-600 mb-1">
                            ACTIVE LISTINGS
                          </div>
                          <div className="text-3xl font-bold text-amber-700">
                            {profileStats?.activeListings || "6"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                          {profileStats?.totalListings || "24"} total
                        </span>
                        <span className="text-amber-600">products</span>
                      </div>
                    </div>

                    <div className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 p-6 rounded-2xl border border-violet-200/50 overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-violet-400/10 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-violet-500 rounded-xl shadow-lg">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-violet-600 mb-1">
                            SUCCESS RATE
                          </div>
                          <div className="text-3xl font-bold text-violet-700">
                            {profileStats?.successfulSales &&
                            profileStats?.totalListings
                              ? Math.round(
                                  (profileStats.successfulSales /
                                    profileStats.totalListings) *
                                    100
                                )
                              : 75}
                            %
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
                          {profileStats?.successfulSales || "18"} sales
                        </span>
                        <span className="text-violet-600">completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {userProfile?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{userProfile.email}</span>
                    </div>
                  )}
                  {userProfile?.whatsapp && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        {userProfile.whatsapp}
                      </span>
                    </div>
                  )}
                  {userProfile?.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        {userProfile.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Achievements & Badges
                </h3>
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {achievements.filter((a) => a.earned).length} /{" "}
                  {achievements.length} Unlocked
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        achievement.earned
                          ? "border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-lg"
                          : "border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 opacity-70"
                      }`}
                    >
                      {achievement.earned && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <Star className="w-4 h-4 text-white fill-current" />
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-4 rounded-2xl shadow-md ${
                            achievement.earned
                              ? achievement.color
                              : "bg-gray-300 text-gray-500"
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>

                      <h4
                        className={`font-bold mb-2 text-lg ${
                          achievement.earned ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {achievement.title}
                      </h4>

                      <p
                        className={`text-sm mb-3 ${
                          achievement.earned ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {achievement.description}
                      </p>

                      {achievement.earned ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Unlocked
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-2 italic">
                          Not earned yet
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.amount && (
                        <span className="font-medium text-gray-900">
                          {activity.amount}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Profile Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={userProfile?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell customers about your business..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={userProfile?.location || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your location"
                  />
                </div>
                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
