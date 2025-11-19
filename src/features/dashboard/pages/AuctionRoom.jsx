import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import {
  transformProductToAuctionFormat,
  categories,
  sortOptions,
  filterAndSortAuctions,
} from "../../../utils/auctionUtils";
import AuctionPlaceBidModal from "../components/AuctionPlaceBidModal";
import AuctionQuickStats from "../components/AuctionQuickStats";
import RealtimeAuctionCard from "../components//RealtimeAuctionCard";
import LiveActivityFeed from "../components/LiveActivityFeed";
const AuctionRoom = () => {
  const { isAuthenticated } = useAuth();

  // API data state
  const [auctionProducts, setAuctionProducts] = useState([]);
  const [rawAuctionData, setRawAuctionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("ending_soon");
  const [search, setSearch] = useState("");

  // Auction specific states
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);

  // Data fetching
  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.products.getAuctions();

        if (response.success && response.data && response.data.auctions) {
          setRawAuctionData(response.data.auctions);
          const transformedProducts = response.data.auctions.map(
            transformProductToAuctionFormat
          );

          setAuctionProducts(transformedProducts);
        } else {
          setRawAuctionData([]);
          setAuctionProducts([]);
        }
      } catch (err) {
        console.error("Error fetching auction products:", err);
        setError("Failed to load auction products");
        setAuctionProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = filterAndSortAuctions(
    auctionProducts,
    selectedCategory,
    sortBy,
    search
  );

  // Event handlers
  const handleBidClick = (auction) => {
    if (!isAuthenticated) {
      alert("Please login to place bids");
      return;
    }

    setSelectedAuction(auction);
    setShowBidModal(true);
  };

  const handleCloseBidModal = () => {
    setShowBidModal(false);
    setSelectedAuction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading auctions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
        <div className="text-red-300 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Main Hero Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
                  Live Auction
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-600">
                    Market Place
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Connect directly with verified farmers across Pakistan. Bid on
                  quality agricultural products in real-time auctions with
                  transparent pricing.
                </p>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                      {auctionProducts.length}
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm uppercase tracking-wide">
                      Live Auctions
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-1 sm:mb-2">
                      Coming Soon
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm uppercase tracking-wide">
                      Total Bids
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-300 mb-1 sm:mb-2">
                      Coming soon
                    </div>
                    <div className="text-blue-200 text-xs sm:text-sm uppercase tracking-wide">
                      Active Bidders
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Live Activity
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-300 text-xs font-medium uppercase tracking-wide">
                      LIVE
                    </span>
                  </div>
                </div>
                <LiveActivityFeed rawAuctionData={rawAuctionData} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marketplace Layout - White Background Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Search Bar at Top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for crops, locations, or sellers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-base sm:text-lg shadow-lg"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Marketplace Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-80 lg:flex-shrink-0"
            >
              <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-200 shadow-lg lg:sticky lg:top-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                    />
                  </svg>
                  Filters
                </h3>

                {/* Category Filter */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                          selectedCategory === category.id
                            ? "bg-green-100 text-green-800 border-l-4 border-green-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    Sort By
                  </h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Stats */}
                <AuctionQuickStats auctionProducts={auctionProducts} />
              </div>
            </motion.div>

            {/* Right Content - Auction Grid */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredAndSortedProducts.length} Auctions Found
                  </h2>
                  <div className="text-sm text-gray-600">
                    Showing results for "
                    {selectedCategory === "all"
                      ? "All Categories"
                      : categories.find((c) => c.id === selectedCategory)?.name}
                    "
                  </div>
                </div>
              </motion.div>

              {/* Auction Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {auctionProducts && auctionProducts.length > 0 ? (
                    auctionProducts.map((auction) => {
                      return (
                        <RealtimeAuctionCard
                          key={auction.id}
                          auction={auction}
                          onBidClick={handleBidClick}
                          isAuthenticated={isAuthenticated}
                        />
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <p className="text-gray-600">No auctions found</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <AuctionPlaceBidModal
        showBidModal={showBidModal}
        setShowBidModal={setShowBidModal}
        handleCloseBidModal={handleCloseBidModal}
        selectedAuction={selectedAuction}
      />
    </div>
  );
};

export default AuctionRoom;
