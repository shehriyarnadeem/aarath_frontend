import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, Bell, Trophy } from "lucide-react";
import Button from "../../../components/Button";

const AuctionExitModal = ({ isOpen, onConfirm, onCancel, activeBids = 0 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Leaving Auction Room?
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to exit the live auction?
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Active Bids Warning */}
          {activeBids > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                    You have {activeBids} active bid{activeBids > 1 ? "s" : ""}!
                  </h3>
                  <p className="text-sm text-yellow-700">
                    You are currently the highest bidder on {activeBids} product
                    {activeBids > 1 ? "s" : ""}. If you win, you'll need to
                    complete the purchase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Information */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Notifications
                </h4>
                <p className="text-sm text-gray-600">
                  We'll notify you via email and SMS if you win any auctions
                  after leaving.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Return Anytime
                </h4>
                <p className="text-sm text-gray-600">
                  You can return to the auction room anytime before auctions
                  end.
                </p>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Important Reminder
                </h4>
                <p className="text-xs text-red-700">
                  Winners must complete purchases within 24 hours. Failure to do
                  so may result in account penalties.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} className="px-4 py-2">
              Stay in Auction
            </Button>
            <Button
              onClick={onConfirm}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700"
            >
              Yes, Exit Auction
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionExitModal;
