import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Package, DollarSign } from "lucide-react";

const Overview = () => {
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
    </div>
  );
};

export default Overview;
