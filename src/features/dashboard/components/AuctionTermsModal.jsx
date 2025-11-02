import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";
import Button from "../../../components/Button";

const AuctionTermsModal = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  const terms = [
    {
      icon: DollarSign,
      title: "Binding Bids",
      description:
        "All bids placed are legally binding. If you win an auction, you must complete the purchase within 24 hours.",
    },
    {
      icon: Clock,
      title: "Auction Timeline",
      description:
        "Auctions end at the specified time. Last-minute bids may extend the auction by a few minutes to prevent sniping.",
    },
    {
      icon: Shield,
      title: "Verification Required",
      description:
        "All participants must be verified users. Fraudulent activities will result in permanent account suspension.",
    },
    {
      icon: AlertTriangle,
      title: "Payment Terms",
      description:
        "Winners must pay the full amount within 24 hours. Failure to pay may result in account penalties and loss of bidding privileges.",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Auction Room Terms & Conditions
              </h2>
              <p className="text-gray-600">
                Please read and accept these terms before entering the auction
                room
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 mb-1">
                  Important Notice
                </h3>
                <p className="text-sm text-yellow-700">
                  By entering the auction room, you agree to participate in live
                  bidding for agricultural products. All bids are final and
                  legally binding.
                </p>
              </div>
            </div>
          </div>

          {/* Terms List */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Terms and Conditions:
            </h3>

            {terms.map((term, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <term.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {term.title}
                  </h4>
                  <p className="text-sm text-gray-600">{term.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Terms */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Additional Responsibilities:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Inspect product details carefully before bidding</li>
              <li>• Contact sellers within 24 hours of winning</li>
              <li>• Arrange pickup/delivery as agreed with seller</li>
              <li>• Report any issues through the platform support</li>
              <li>• Maintain respectful communication with all parties</li>
            </ul>
          </div>

          {/* Consequences */}
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Consequences of Non-Compliance:
            </h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Account suspension for failed payments</li>
              <li>• Loss of bidding privileges</li>
              <li>• Legal action for fraudulent activities</li>
              <li>• Permanent ban from the platform</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              By clicking "Accept & Enter", you agree to all terms and
              conditions
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onDecline}
                className="px-6 py-2"
              >
                Decline
              </Button>
              <Button
                onClick={onAccept}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
              >
                Accept & Enter Auction
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionTermsModal;
