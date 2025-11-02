import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Upload, ShoppingCart, TruckIcon } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description:
        "Create your account as a farmer, buyer, or both in just a few minutes",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Upload,
      title: "List Products",
      description:
        "Upload photos and details of your agricultural products with competitive pricing",
      color: "from-green-500 to-green-600",
    },
    {
      icon: ShoppingCart,
      title: "Browse & Buy",
      description:
        "Discover quality products from verified sellers and place your orders securely",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TruckIcon,
      title: "Get Delivered",
      description:
        "Receive your products through our trusted delivery network across Pakistan",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white w-full">
      <div className="w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with Pakistan's most trusted agricultural marketplace in
            four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="text-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0" />
                )}

                {/* Step Number */}
                <div className="relative z-10 mb-6">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of farmers and buyers already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Start Selling
              </button>
              <button className="bg-white hover:bg-gray-50 text-green-600 font-semibold py-3 px-8 rounded-xl border-2 border-green-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Browse Products
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
