import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../../components/Button";
import { Search, Filter } from "lucide-react";

const categories = [
  "All Products",
  "Wheat",
  "Rice",
  "Maize",
  "Sesame",
  "Pulses",
  "Vegetables",
  "Fruits",
  "Seeds",
];

const dummyProducts = [
  {
    id: 1,
    title: "Premium Wheat",
    category: "Wheat",
    price: "₹2,500",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    seller: "Green Farms",
    location: "Punjab",
    timeAgo: "2h ago",
    status: "Open to Bid",
    condition: "Excellent",
  },
  {
    id: 2,
    title: "Basmati Rice",
    category: "Rice",
    price: "₹3,200",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    seller: "Rice Traders",
    location: "Sindh",
    timeAgo: "1h ago",
    status: "Buy Now",
    condition: "New",
  },
  {
    id: 3,
    title: "Maize Feed",
    category: "Maize",
    price: "₹1,800",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    seller: "AgroMart",
    location: "KP",
    timeAgo: "30m ago",
    status: "Auction",
    condition: "Very Good",
  },
  {
    id: 4,
    title: "Sesame Seeds",
    category: "Sesame",
    price: "₹2,100",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    seller: "SeedCo",
    location: "Balochistan",
    timeAgo: "10m ago",
    status: "Open to Bid",
    condition: "Good",
  },
  {
    id: 5,
    title: "Organic Pulses",
    category: "Pulses",
    price: "₹2,800",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    seller: "PulseHub",
    location: "Punjab",
    timeAgo: "5m ago",
    status: "Buy Now",
    condition: "New",
  },
  {
    id: 6,
    title: "Fresh Vegetables",
    category: "Vegetables",
    price: "₹1,200",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    seller: "VeggieMart",
    location: "Sindh",
    timeAgo: "3h ago",
    status: "Auction",
    condition: "Excellent",
  },
];

const filters = {
  status: ["Buy Now", "Auction", "Open to Bid"],
  condition: ["New", "Excellent", "Very Good", "Good"],
};

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState([]);

  // Filter products
  const filteredProducts = dummyProducts.filter((p) => {
    const matchCategory =
      selectedCategory === "All Products" || p.category === selectedCategory;
    const matchSearch =
      !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      selectedStatus.length === 0 || selectedStatus.includes(p.status);
    const matchCondition =
      selectedCondition.length === 0 || selectedCondition.includes(p.condition);
    return matchCategory && matchSearch && matchStatus && matchCondition;
  });

  // Sidebar filter UI
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 py-8 px-4 sm:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-lg mb-4">
            Discover, bid, and buy agricultural products from trusted sellers
            across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-primary-700/80 rounded-full px-3 py-1">
              10,000+ Active Listings
            </span>
            <span className="bg-primary-700/80 rounded-full px-3 py-1">
              Live Auctions
            </span>
            <span className="bg-primary-700/80 rounded-full px-3 py-1">
              Verified Sellers
            </span>
            <span className="bg-primary-700/80 rounded-full px-3 py-1">
              Nationwide Delivery
            </span>
          </div>
        </div>
      </div>
      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-primary-700 mb-4">
              Categories
            </h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-medium ${
                      selectedCategory === cat
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-primary-700 mb-4">Status</h2>
            <div className="space-y-2">
              {filters.status.map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(status)}
                    onChange={() => {
                      setSelectedStatus((prev) =>
                        prev.includes(status)
                          ? prev.filter((s) => s !== status)
                          : [...prev, status]
                      );
                    }}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-primary-700 mb-4">
              Condition
            </h2>
            <div className="space-y-2">
              {filters.condition.map((cond) => (
                <label key={cond} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCondition.includes(cond)}
                    onChange={() => {
                      setSelectedCondition((prev) =>
                        prev.includes(cond)
                          ? prev.filter((c) => c !== cond)
                          : [...prev, cond]
                      );
                    }}
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <section className="flex-1">
          {/* Search Bar & Top Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center w-full sm:w-auto gap-2">
              <input
                type="text"
                className="input-field w-full sm:w-80"
                placeholder="Search products, sellers, etc."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline" className="px-4 py-2">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
              <Button variant="ghost" className="px-4 py-2">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} Products Found
              </span>
              <select className="input-field">
                <option>Most Relevant</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative mb-3">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full shadow">
                    {product.status}
                  </span>
                  <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {product.condition}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                  {product.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium mr-2">{product.category}</span>
                  <span className="mx-2">|</span>
                  <span>{product.location}</span>
                  <span className="mx-2">|</span>
                  <span>{product.timeAgo}</span>
                </div>
                <div className="font-bold text-primary-700 text-xl mb-2">
                  {product.price}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-xs text-gray-500">Seller:</span>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {product.seller}
                  </span>
                </div>
                <div className="flex gap-2 mt-auto">
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
        </section>
      </div>
    </div>
  );
};

export default Marketplace;
