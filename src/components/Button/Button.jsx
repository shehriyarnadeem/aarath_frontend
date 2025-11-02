import { motion } from "framer-motion";
import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500 hover:-translate-y-0.5",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 focus:ring-gray-500 shadow-md hover:shadow-lg hover:-translate-y-0.5",
    outline:
      "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 hover:-translate-y-0.5",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500 hover:-translate-y-0.5",
    orange:
      "bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl focus:ring-orange-500 hover:-translate-y-0.5",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500 hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const loadingClasses = loading ? "cursor-wait" : "";

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabledClasses}
    ${loadingClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
