import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  User,
  Package,
  Star,
  ArrowRight,
} from "lucide-react";
import Button from "../../../components/Button";

// Dummy product data for marketplace
const DUMMY_PRODUCTS = [
  {
    id: "1",
    title: "Premium Basmati Rice",
    description:
      "High quality basmati rice, freshly harvested. Perfect for export and local consumption.",
    category: "Rice",
    price: 3200,
    unit: "40KG",
    quantity: 5000,
    location: "Lahore, Punjab",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    ],
    seller: {
      name: "Ahmad Farming Co.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
    },
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    title: "Organic Wheat",
    description: "Certified organic wheat, ideal for flour mills and bakeries.",
    category: "Wheat",
    price: 2500,
    unit: "50KG",
    quantity: 3000,
    location: "Multan, Punjab",
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    ],
    seller: {
      name: "Green Valley Farm",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
    },
    timeAgo: "1 day ago",
  },
  {
    id: "3",
    title: "Fresh Tomatoes",
    description: "Juicy, red tomatoes direct from farm. Bulk orders available.",
    category: "Vegetables",
    price: 150,
    unit: "KG",
    quantity: 800,
    location: "Karachi, Sindh",
    images: [
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    ],
    seller: {
      name: "Fresh Produce Ltd.",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      rating: 4.7,
    },
    timeAgo: "3 hours ago",
  },
  // Add more dummy products for realism
];

const CATEGORIES = [
  "All",
  "Rice",
  "Wheat",
  "Vegetables",
  "Fruits",
  "Spices",
  "Oilseeds",
  "Cotton",
  "Sugarcane",
];
const LOCATIONS = [
  "All",
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  // Filter logic
  const filteredProducts = DUMMY_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "All" || product.location.includes(selectedLocation);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "recent") return 0; // Dummy, all are recent
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "rating") return b.seller.rating - a.seller.rating;
    return 0;
  });

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Package className="w-9 h-9 mr-3 text-primary-600" /> Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Discover, trade, and bid on the best agricultural products from
            trusted sellers across Pakistan.
          </p>
        </div>
        <Button variant="primary" size="lg" className="flex items-center">
          <ArrowRight className="w-5 h-5 mr-2" /> Post a Product
        </Button>
      </div>
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, e.g. wheat, rice, tomatoes..."
            className="input-field w-full"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input-field"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="recent">Most Recent</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Seller Rating</option>
          </select>
          <Button variant="outline" className="flex items-center">
            <Filter className="w-5 h-5 mr-2" /> More Filters
          </Button>
        </div>
      </div>
      {/* Product Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {sortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <div className="mb-2 font-semibold">No products found.</div>
            <div>Try adjusting your search or filters.</div>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-4 relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-xl border"
                />
                <span className="absolute top-3 left-3 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {product.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {product.title}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center mb-3">
                <span className="font-semibold text-primary-700 mr-2">
                  {product.price.toLocaleString()} PKR
                </span>
                <span className="text-gray-500">/{product.unit}</span>
                <span className="ml-4 text-xs text-gray-400">
                  Available: {product.quantity} {product.unit}
                </span>
              </div>
              <div className="flex items-center mb-3">
                <MapPin className="w-4 h-4 mr-1 text-primary-500" />
                <span className="text-sm text-gray-700">
                  {product.location}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  {product.timeAgo}
                </span>
              </div>
              <div className="flex items-center mb-3">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-8 h-8 rounded-full border mr-2"
                />
                <span className="font-medium text-gray-900">
                  {product.seller.name}
                </span>
                <Star className="w-4 h-4 text-yellow-400 ml-2" />
                <span className="text-sm text-gray-600">
                  {product.seller.rating}
                </span>
              </div>
              <Button variant="primary" className="mt-auto w-full">
                Trade / Bid
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
