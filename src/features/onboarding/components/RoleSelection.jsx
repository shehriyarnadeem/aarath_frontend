import { motion } from "framer-motion";
import {
  User,
  Users,
  ShoppingCart,
  Briefcase,
  DollarSign,
  Building,
  Globe,
  PackageSearch,
  Factory,
} from "lucide-react";
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
    {
      id: "RESELLER",
      title: "Reseller/Seller",
      description:
        "I resell or sell agricultural products to other businesses or consumers",
      icon: <Briefcase className="w-8 h-8" />,
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "TRADER",
      title: "Trader",
      description: "I trade agricultural commodities in bulk or on exchanges",
      icon: <DollarSign className="w-8 h-8" />,
      gradient: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
    {
      id: "SHELLER_MILLER_PROCESSOR",
      title: "Sheller/Miller/Processor",
      description: "I process, shell, or mill agricultural products",
      icon: <Factory className="w-8 h-8" />,
      gradient: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "EXPORTER",
      title: "Exporter",
      description: "I export agricultural products to other countries",
      icon: <Globe className="w-8 h-8" />,
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      id: "STOCK_INVESTOR",
      title: "Stock Investor",
      description: "I invest in agricultural stocks or commodities",
      icon: <PackageSearch className="w-8 h-8" />,
      gradient: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
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
