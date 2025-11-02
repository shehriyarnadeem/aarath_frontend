import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = true,
  shadow = "md",
  rounded = "lg",
  padding = "md",
  onClick,
  ...props
}) => {
  const baseClasses =
    "bg-white border border-gray-200 transition-all duration-300";

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md hover:shadow-lg",
    lg: "shadow-lg hover:shadow-xl",
    xl: "shadow-xl hover:shadow-2xl",
  };

  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const hoverClasses = hover
    ? "hover:-translate-y-1 hover:border-gray-300"
    : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const classes = `
    ${baseClasses}
    ${shadowClasses[shadow]}
    ${roundedClasses[rounded]}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  if (onClick) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Specialized card components
const ProductCard = ({
  title,
  price,
  location,
  image,
  status,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <Card
      className={`overflow-hidden group ${className}`}
      onClick={onClick}
      hover={true}
      shadow="md"
      padding="none"
      {...props}
    >
      {/* Image Section */}
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={image || "/api/placeholder/400/250"}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {status && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
              status === "available"
                ? "bg-green-100 text-green-800"
                : status === "sold"
                  ? "bg-red-100 text-red-800"
                  : "bg-orange-100 text-orange-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-green-600">
              ₹{price?.toLocaleString()}
            </p>
            {location && (
              <p className="text-sm text-gray-500 mt-1">{location}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "green",
  className = "",
  ...props
}) => {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };

  return (
    <Card
      className={`${colorClasses[color]} ${className}`}
      shadow="md"
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className="text-sm mt-1 opacity-75">
              {change.startsWith("+") ? "↗" : "↘"} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-white bg-opacity-50">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
export { ProductCard, StatsCard };
