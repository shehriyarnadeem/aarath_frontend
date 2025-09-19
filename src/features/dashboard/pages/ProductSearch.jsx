import { motion } from "framer-motion";
import { Search, Filter, Plus, Star, MapPin, Clock } from "lucide-react";
import React, { useState } from "react";

import Button from "../../../components/Button";

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Products" },
    { id: "cereals", label: "Cereals" },
    { id: "vegetables", label: "Vegetables" },
    { id: "fruits", label: "Fruits" },
    { id: "spices", label: "Spices" },
  ];

  const products = [
    {
      id: 1,
      title: "Premium Basmati Rice",
      price: 8000,
      unit: "40KG",
      quantity: 3000,
      location: "Karachi",
      timeAgo: "a day ago",
      rating: 4.8,
      seller: "Ahmad Farming Co.",
      category: "cereals",
    },
    {
      id: 2,
      title: "Organic Wheat",
      price: 2500,
      unit: "50KG",
      quantity: 1600,
      location: "Punjab",
      timeAgo: "2 hours ago",
      rating: 4.9,
      seller: "Green Valley Farm",
      category: "cereals",
    },
    {
      id: 3,
      title: "Fresh Tomatoes",
      price: 150,
      unit: "KG",
      quantity: 500,
      location: "Sindh",
      timeAgo: "5 hours ago",
      rating: 4.7,
      seller: "Fresh Produce Ltd.",
      category: "vegetables",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Search
        </h1>
        <p className="text-gray-600">
          Find the best agricultural products from verified sellers
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="input-field pl-12 w-full"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <Button variant="outline" className="lg:w-auto">
            <Filter className="w-5 h-5 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Product Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="mr-3">{product.rating}</span>
                  <span className="font-medium">{product.seller}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Price and Quantity */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-primary-600">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-gray-600">/{product.unit}</span>
              </div>
              <div className="text-sm text-gray-600">
                Available: {product.quantity} {product.unit}
              </div>
            </div>

            {/* Location and Time */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{product.timeAgo}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button size="sm" className="flex-1">
                Contact Seller
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Product Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button className="w-16 h-16 rounded-full shadow-2xl">
          <Plus className="w-8 h-8" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ProductSearch;
