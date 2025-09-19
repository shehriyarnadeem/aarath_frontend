import { motion } from "framer-motion";
import { Check, Wheat, Leaf, Zap, Flower, Apple } from "lucide-react";
import React from "react";

const CategorySelection = ({ selectedCategories, onCategoryToggle }) => {
  const categories = [
    {
      id: "paddy",
      name: "Paddy",
      description: "Rice in husk, unmilled rice",
      icon: <Wheat className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
    },
    {
      id: "rice",
      name: "Rice",
      description: "Processed rice, basmati & non-basmati",
      icon: <Leaf className="w-6 h-6" />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "wheat",
      name: "Wheat",
      description: "Wheat grains and wheat flour",
      icon: <Wheat className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
    },
    {
      id: "maize",
      name: "Maize",
      description: "Corn/Maize for feed and food",
      icon: <Apple className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "sesame",
      name: "Sesame",
      description: "Sesame seeds and til products",
      icon: <Flower className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "pulses",
      name: "Pulses",
      description: "Lentils, chickpeas, and legumes",
      icon: <Zap className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Business Categories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the agricultural products you deal with. You can choose
          multiple categories.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryToggle(category.id)}
              className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-xl"
                  : "border-gray-200 bg-white hover:border-primary-300 hover:shadow-lg hover:bg-gray-50"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection indicator */}
              <div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-primary-500 border-primary-500"
                    : "border-gray-300 group-hover:border-primary-300"
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>

              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}
              >
                {category.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {category.name}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Selected categories summary */}
      {selectedCategories.length > 0 && (
        <motion.div
          className="max-w-2xl mx-auto bg-primary-50 rounded-xl p-6 border border-primary-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-semibold text-primary-800 mb-3">
            Selected Categories:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return (
                <span
                  key={categoryId}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {category?.name}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CategorySelection;
