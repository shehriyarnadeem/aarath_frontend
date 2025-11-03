import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

import Button from "../../../components/Button";
import CategoriesSection from "../components/CategoriesSection";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import HowItWorksSection from "../components/HowItWorksSection";
import Testimonials from "../components/Testimonials";

const Home = ({ onGetStarted, onContinueAsGuest }) => {
  return (
    <div className="bg-gradient-to-b from-green-100 to-white w-full min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 w-full flex-1 flex items-center justify-center">
        <div className="text-center w-full">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Pakistan's First
            <span className="text-green-600 block">
              Agricultural Marketplace
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Buy and sell agricultural products directly from farmers. Get the
            best prices, quality products, and support local agriculture.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white shadow-xl"
            >
              Start Selling
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={onContinueAsGuest}
              variant="outline"
              size="lg"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              Browse Marketplace
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Farmers</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Products Listed</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-4xl font-bold text-green-600 mb-2">
                ₹100M+
              </div>
              <div className="text-gray-600">Total Sales</div>
            </motion.div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
