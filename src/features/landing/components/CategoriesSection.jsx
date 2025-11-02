import React from "react";
import { motion } from "framer-motion";
import {
  Wheat,
  Apple,
  TreePine,
  Droplets,
  Tractor,
  Sprout,
} from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      icon: Wheat,
      name: "Grains & Cereals",
      description: "Rice, Wheat, Maize, Barley",
      count: "2,500+ items",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      icon: Apple,
      name: "Fruits & Vegetables",
      description: "Fresh Produce, Organic Options",
      count: "3,200+ items",
      color: "from-red-400 to-red-600",
    },
    {
      icon: TreePine,
      name: "Pulses & Spices",
      description: "Lentils, Chickpeas, Spices",
      count: "1,800+ items",
      color: "from-green-400 to-green-600",
    },
    {
      icon: Droplets,
      name: "Dairy Products",
      description: "Milk, Cheese, Yogurt",
      count: "900+ items",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Tractor,
      name: "Farm Equipment",
      description: "Tractors, Tools, Machinery",
      count: "650+ items",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: Sprout,
      name: "Seeds & Fertilizers",
      description: "Quality Seeds, Organic Fertilizers",
      count: "1,200+ items",
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 w-full">
      <div className="w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our diverse agricultural
            marketplace
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>

                <p className="text-gray-600 mb-4">{category.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">
                    {category.count}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            View All Categories
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
