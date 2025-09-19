import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import React from "react";

import Button from "../../../components/Button";

const HeroSection = ({ onGetStarted, onContinueAsGuest }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Connect the{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Agriculture
              </span>{" "}
              Supply Chain
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Join thousands of farmers, buyers, brokers, and processors in
              building a transparent, efficient agricultural marketplace that
              benefits everyone.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="flex items-center justify-center space-x-3"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started Today</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Right Column - Visual */}
        <div className="flex justify-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Main Circle */}
            <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl">
              <div className="relative">
                {/* Add your hero illustration here */}
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
