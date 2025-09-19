import { motion } from "framer-motion";
import { User, Users, ShoppingCart } from "lucide-react";
import React from "react";

const RoleSelection = ({ selectedRole, onRoleSelect }) => {
  const roles = [
    {
      id: "FARMER",
      title: "Farmer",
      description:
        "I grow and sell agricultural products directly from my farm",
      icon: <User className="w-8 h-8" />,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "BROKER",
      title: "Broker",
      description: "I help connect buyers and sellers in agricultural trading",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "BUYER",
      title: "Buyer",
      description:
        "I purchase agricultural products for business or consumption",
      icon: <ShoppingCart className="w-8 h-8" />,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
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
          What best describes you?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the category that best matches your role in the agricultural
          supply chain.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {roles.map((role, index) => (
          <motion.button
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
              selectedRole === role.id
                ? "border-primary-500 bg-primary-50 shadow-xl scale-105"
                : `${role.borderColor} bg-white hover:${role.bgColor} hover:border-primary-300 hover:shadow-lg`
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection indicator */}
            {selectedRole === role.id && (
              <motion.div
                className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}

            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}
            >
              {role.icon}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {role.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">{role.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
