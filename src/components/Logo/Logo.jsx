import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const Logo = ({ size = "md", showText = true, className = "" }) => {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg" },
    md: { icon: "w-8 h-8", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {showText && (
        <span
          className={`font-bold bg-gradient-to-r from-primary-600 to-secondary-700 bg-clip-text text-transparent ${sizes[size].text}`}
        >
          Aarath
        </span>
      )}
    </motion.div>
  );
};

export default Logo;
