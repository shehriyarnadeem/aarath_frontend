import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Button from "../../../components/Button";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import apiClient from "../../../api/client";

const categories = [
  {
    id: "all",
    name: "All Products",
    description: "All available products",
  },
  {
    id: "paddy",
    name: "Paddy",
    description: "Rice in husk, unmilled rice",
  },
  {
    id: "rice",
    name: "Rice",
    description: "Processed rice, basmati & non-basmati",
  },
  {
    id: "wheat",
    name: "Wheat",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "maize",
    name: "Maize",
  },
  {
    id: "sesame",
    name: "Sesame",
    description: "Sesame seeds and til products",
  },
  {
    id: "pulses",
    name: "Pulses",
    description: "Lentils, chickpeas, and legumes",
  },
];

const filters = {
  status: ["Buy Now", "Open to Bid"],
};

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Custom debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(search, 500);

  // Comprehensive fetchProducts function
  const fetchProducts = useCallback(async () => {
    console.log("fetchProducts called with:", {
      currentPage,
      itemsPerPage,
      debouncedSearch,
      selectedCategory,
      sortBy,
    });

    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add keyword search
      if (debouncedSearch.trim()) {
        params.keyword = debouncedSearch.trim();
      }

      // Add category filter (skip "all" which means all products)
      if (selectedCategory && selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      // Add sorting
      let sort = "newest"; // default
      if (sortBy === "price_low") {
        sort = "price_asc";
      } else if (sortBy === "price_high") {
        sort = "price_desc";
      }
      params.sort = sort;

      console.log("API call params:", params);
      console.log("Selected category:", selectedCategory);

      // Call API with all parameters
      const response = await apiClient.products.getAll(params);

      console.log("API response:", response);

      if (response.success) {
        setProducts(response.products || []);
        setTotalItems(response.pagination?.total || 0);
        setTotalPages(response.pagination?.totalPages || 0);
        console.log("Products set:", response.products?.length || 0);
      } else {
        setError("No products found");
        setProducts([]);
        console.log("API response not successful:", response);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    selectedCategory,
    sortBy,
    isRefreshed,
  ]);

  // Initial fetch on mount (simpler approach)
  useEffect(() => {
    const initialFetch = async () => {
      console.log("Initial fetch starting...");
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.products.getAll({
          page: 1,
          limit: 12,
        });
        console.log("Initial response:", response);

        if (response.success) {
          setProducts(response.products || []);
          setTotalItems(response.pagination?.total || 0);
          setTotalPages(response.pagination?.totalPages || 0);
        } else {
          setError("No products found");
        }
      } catch (err) {
        console.error("Initial fetch error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, []);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, debouncedSearch, selectedCategory, sortBy, isRefreshed]);

  // Change handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when changing pages
  };

  // Filter products (keeping existing status/condition filters for UI)
  console.log(products);
  // Sidebar filter UI
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Inspiring Marketplace Banner - PakWheels Style */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative px-4 sm:px-8 py-16 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                  Pakistan's First
                  <span className="block text-yellow-300">
                    Agricultural Marketplace
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl mb-8 text-green-100 leading-relaxed">
                  Connect directly with farmers and suppliers. Get fresh
                  produce, quality grains, and farm equipment at unbeatable
                  prices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-8 fill-gray-50">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* Quick Categories & Trending Section */}
      <div className="bg-gray-50 py-8 px-4 sm:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Popular Categories */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                Popular Categories Today
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.slice(1, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-green-300 group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white text-xl">🌾</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {cat.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Search & Filters */}
      <div className="w-full px-4 sm:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - PakWheels Style */}
        <aside className="w-full md:w-72 flex-shrink-0">
          {/* Categories Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Categories
            </h2>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium border ${
                      selectedCategory === cat.id
                        ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{cat.name}</span>
                      {selectedCategory === cat.id && (
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <section className="flex-1">
          {/* Search Bar & Top Controls - PakWheels Style */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Section */}
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Search by product name, seller, location..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                <Button
                  onClick={() => {
                    setIsRefreshed(!isRefreshed);
                  }}
                  variant="outline"
                  className="px-4 py-3 border-green-600 text-green-600 hover:bg-green-50 hidden sm:flex"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </Button>
              </div>

              {/* Sort and Results Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  <span className="text-green-600 font-bold">{totalItems}</span>{" "}
                  Products Found
                </div>
              </div>
            </div>
          </div>
          {/* Product Grid - PakWheels Inspired */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                {/* Image Section with Overlay */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Price Badge - PakWheels Style */}
                  <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ₨{" "}
                    {product && product.price && product.price.toLocaleString()}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {product.status || "Available"}
                  </div>
                </div>

                {/* Card Content - PakWheels Layout */}
                <div className="p-4">
                  {/* Product Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Product Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium text-gray-700">
                        Category:
                      </span>
                      <span className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-medium text-green-700">
                        {product.category
                          ? product.category.toUpperCase()
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium text-gray-700">
                        Quantity:
                      </span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {product.quantity} {product.unit}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium text-gray-700">
                        Location:
                      </span>
                      <span className="ml-2">
                        {product && product.user
                          ? `${product.user?.city}, ${product.user?.state}`
                          : "Unknown Location"}
                      </span>
                    </div>
                  </div>

                  {/* Seller Info - PakWheels Style */}
                  <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {product?.user?.businessName
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product?.user?.businessName || "Seller"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString()
                            : "Recently listed"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Verified
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - PakWheels Style */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 font-medium py-2"
                    >
                      Contact Seller
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {totalPages > 0 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={fetchProducts}
                className="mt-2"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Marketplace;
