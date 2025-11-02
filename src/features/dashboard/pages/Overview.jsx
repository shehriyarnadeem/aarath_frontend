import { motion } from "framer-motion";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../../../components/Button";
import AuthPrompt from "../../../components/AuthPrompt";
import { useAuth } from "../../../context/AuthContext";
import apiClient from "../../../api/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Overview = () => {
  const { isAuthenticated } = useAuth();
  const stats = [
    {
      title: "Total Products",
      value: "24",
      icon: Package,
      change: "+12%",
      positive: true,
    },
    {
      title: "Active Buyers",
      value: "156",
      icon: Users,
      change: "+5%",
      positive: true,
    },
    {
      title: "Revenue",
      value: "₹2,45,000",
      icon: DollarSign,
      change: "+18%",
      positive: true,
    },
    {
      title: "Growth",
      value: "23%",
      icon: TrendingUp,
      change: "+3%",
      positive: true,
    },
  ];

  // Static list of all available categories
  const allCategories = React.useMemo(
    () => ["wheat", "rice", "paddy", "maize", "sesame", "pulses"],
    []
  );

  // Time range options
  const timeRanges = [
    { value: 1, label: "Last 1 Month" },
    { value: 3, label: "Last 3 Months" },
    { value: 6, label: "Last 6 Months" },
    { value: 12, label: "Last 1 Year" },
  ];

  // State for real price trend data
  const [priceTrendData, setPriceTrendData] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("wheat");
  const [selectedTimeRange, setSelectedTimeRange] = useState(12); // Default to 1 year
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products and calculate price trends
  // Helper: Group products by category
  const groupByCategory = (products) =>
    products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

  // Helper: Filter products by time range
  const filterByTimeRange = (products, months) => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return products.filter(
      (product) => new Date(product.createdAt) >= cutoffDate
    );
  };

  // Helper: Group products by month and calculate average price
  const getMonthlyTrends = (products) => {
    const productsByMonth = products.reduce((acc, product) => {
      const createdDate = new Date(product.createdAt);
      const monthYear = `${createdDate.getFullYear()}-${String(
        createdDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = createdDate.toLocaleDateString("en", {
        month: "short",
        year: "2-digit",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = { monthName, products: [], monthYear };
      }
      acc[monthYear].products.push(product);
      return acc;
    }, {});
    return Object.values(productsByMonth)
      .map(({ monthName, products, monthYear }) => ({
        month: monthName,
        price: Math.round(
          products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) /
            products.length
        ),
        count: products.length,
        monthYear,
      }))
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  };

  const fetchPriceTrends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = { limit: 1000 };
      if (selectedCategory) apiParams.category = selectedCategory;
      if (selectedTimeRange) apiParams.timeline = selectedTimeRange;

      const response = await apiClient.products.getAll(apiParams);

      if (response.success && response.products) {
        const productsByCategory = groupByCategory(response.products);
        const categories = Object.keys(productsByCategory);
        setAvailableCategories(categories);

        const trendData = {};
        categories.forEach((category) => {
          const filtered = filterByTimeRange(
            productsByCategory[category],
            selectedTimeRange
          );
          trendData[category] = getMonthlyTrends(filtered);
        });
        setPriceTrendData(trendData);

        if (!allCategories.includes(selectedCategory.toLowerCase())) {
          setSelectedCategory(allCategories[0]);
        }
      } else {
        setError("Failed to fetch price trend data");
      }
    } catch (err) {
      setError("Failed to load price trends");
    } finally {
      setLoading(false);
    }
  }, [selectedTimeRange, selectedCategory, allCategories]);

  // Fetch data on component mount
  useEffect(() => {
    fetchPriceTrends();
  }, [fetchPriceTrends]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
          Market Price Trends
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time agricultural commodity price insights and market analytics
        </p>
      </div>
      {/* Seasonal Price Trends Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary-700">
            Seasonal Price Trends
          </h3>
          <div className="flex items-center gap-4">
            <select
              className="input-field w-40"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={loading}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="input-field w-44"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(parseInt(e.target.value))}
              disabled={loading}
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <Button
              onClick={fetchPriceTrends}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading price trends...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-[300px] text-red-600">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && priceTrendData[selectedCategory] && (
          <div className="mb-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceTrendData[selectedCategory]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Average Price",
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${label} (${payload[0].payload.count} products)`;
                    }
                    return `Month: ${label}`;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name={`${selectedCategory} Average Price`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && !priceTrendData[selectedCategory] && (
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            <p>
              No {selectedCategory} products found. Add some {selectedCategory}{" "}
              products to see price trends.
            </p>
          </div>
        )}

        {!loading && !error && Object.keys(priceTrendData).length === 0 && (
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            <p>No price data available. Add some products to see trends.</p>
          </div>
        )}
      </div>
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
