import { motion } from "framer-motion";
import { Users, TrendingUp, Shield, Globe, Zap, Award } from "lucide-react";
import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect Directly",
      description:
        "Link farmers with buyers, processors, and brokers without intermediaries",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Fair Pricing",
      description:
        "Transparent pricing with real-time market rates and competitive bidding",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Trading",
      description:
        "Safe and verified transactions with built-in dispute resolution",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description:
        "Access markets beyond your local area and expand your business",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Transactions",
      description:
        "Quick and efficient trade processing with instant notifications",
      gradient: "from-red-500 to-red-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assured",
      description: "Quality verification and certification for all products",
      gradient: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Aarath?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides everything you need to succeed in the modern
            agricultural marketplace
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
