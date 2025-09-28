import { motion } from "framer-motion";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";
import React, { useState } from "react";
import Button from "../../../components/Button";
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

const Overview = ({ onAddProduct }) => {
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

  // Dummy data for seasonal price trends
  const priceTrendData = {
    Wheat: [
      { month: "Jan", price: 2200 },
      { month: "Feb", price: 2100 },
      { month: "Mar", price: 2000 },
      { month: "Apr", price: 2050 },
      { month: "May", price: 2150 },
      { month: "Jun", price: 2300 },
      { month: "Jul", price: 2400 },
      { month: "Aug", price: 2500 },
      { month: "Sep", price: 2450 },
      { month: "Oct", price: 2350 },
      { month: "Nov", price: 2250 },
      { month: "Dec", price: 2200 },
    ],
    Rice: [
      { month: "Jan", price: 3200 },
      { month: "Feb", price: 3150 },
      { month: "Mar", price: 3100 },
      { month: "Apr", price: 3120 },
      { month: "May", price: 3180 },
      { month: "Jun", price: 3250 },
      { month: "Jul", price: 3300 },
      { month: "Aug", price: 3400 },
      { month: "Sep", price: 3350 },
      { month: "Oct", price: 3280 },
      { month: "Nov", price: 3220 },
      { month: "Dec", price: 3200 },
    ],
    Maize: [
      { month: "Jan", price: 1800 },
      { month: "Feb", price: 1750 },
      { month: "Mar", price: 1700 },
      { month: "Apr", price: 1720 },
      { month: "May", price: 1780 },
      { month: "Jun", price: 1850 },
      { month: "Jul", price: 1900 },
      { month: "Aug", price: 1950 },
      { month: "Sep", price: 1920 },
      { month: "Oct", price: 1880 },
      { month: "Nov", price: 1820 },
      { month: "Dec", price: 1800 },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState("Wheat");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your agricultural business.
        </p>
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

      {/* DUMMY EXPLORATION WIDGETS FOR IDEATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-primary-700 mb-2">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onAddProduct}>+ Add Product</Button>
            <Button variant="outline">View My Products</Button>
            <Button variant="ghost">Analytics</Button>
          </div>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-primary-700 mb-2">
            Explore Ideas
          </h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Marketplace for verified buyers/sellers</li>
            <li>Live chat with brokers</li>
            <li>Product analytics dashboard</li>
            <li>Seasonal price trends</li>
            <li>Community Q&A</li>
          </ul>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-primary-700 mb-2">
            Coming Soon
          </h3>
          <div className="text-gray-500">
            Suggest features, vote on ideas, and help shape Aarath!
          </div>
          <Button variant="primary" className="mt-4">
            Suggest a Feature
          </Button>
        </motion.div>
      </div>

      {/* Seasonal Price Trends Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary-700">
            Seasonal Price Trends
          </h3>
          <select
            className="input-field w-40"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.keys(priceTrendData).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceTrendData[selectedCategory]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
