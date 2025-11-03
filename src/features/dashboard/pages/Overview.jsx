import { motion } from "framer-motion";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../../../components/Button";
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

  const allCategories = React.useMemo(
    () => ["wheat", "rice", "paddy", "maize", "sesame", "pulses"],
    []
  );

  const timeRanges = [
    { value: 1, label: "Last 1 Month" },
    { value: 3, label: "Last 3 Months" },
    { value: 6, label: "Last 6 Months" },
    { value: 12, label: "Last 1 Year" },
  ];

  const [priceTrendData, setPriceTrendData] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("wheat");
  const [selectedTimeRange, setSelectedTimeRange] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const groupByCategory = (products) =>
    products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

  const filterByTimeRange = (products, months) => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return products.filter(
      (product) => new Date(product.createdAt) >= cutoffDate
    );
  };

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

  useEffect(() => {
    fetchPriceTrends();
  }, [fetchPriceTrends]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className=" text-white text-4xl md:text-5xl font-bold mb-4">
              Market Price Analytics
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Get real-time insights on agricultural commodity prices, market
              trends, and seasonal variations to make informed trading decisions
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                ✨ Real-time Data
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                📊 Advanced Analytics
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                🌾 Agricultural Focus
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Seasonal Price Trends
              </h3>
              <p className="text-gray-600 text-sm">
                Track commodity price movements over time
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">
                Loading price trends...
              </span>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-[300px] text-red-600">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && priceTrendData[selectedCategory] && (
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={priceTrendData[selectedCategory]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    stroke="#666"
                    fontSize={12}
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
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#16a34a" }}
                    activeDot={{ r: 7, fill: "#16a34a" }}
                    name={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Average Price`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {!loading && !error && !priceTrendData[selectedCategory] && (
            <div className="flex flex-col justify-center items-center h-[300px] text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-center">
                No {selectedCategory} products found. <br />
                Add some {selectedCategory} products to see price trends.
              </p>
            </div>
          )}

          {!loading && !error && Object.keys(priceTrendData).length === 0 && (
            <div className="flex flex-col justify-center items-center h-[300px] text-gray-500">
              <TrendingUp className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-center">
                No price data available. <br />
                Add some products to see trends.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
