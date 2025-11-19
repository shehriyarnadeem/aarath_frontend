import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../components/Button"; // Adjust import path as needed
import {
  useBidding,
  useRealtimeAuction,
  useOnlineParticipants,
} from "../../../hooks";

const AuctionPlaceBidModal = ({
  showBidModal,
  setShowBidModal,
  handleCloseBidModal,
  selectedAuction,
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidInfo, setBidInfo] = useState({ minimumBid: 0, currentBid: 0 });

  // Firebase hooks for selected auction to get
  const { placeBid } = useBidding(selectedAuction?.id);
  const realtimeAuction = useRealtimeAuction(selectedAuction?.id);

  useEffect(() => {
    if (selectedAuction) {
      getBidPlacingInfo();
    }
  }, [realtimeAuction.auctionState, selectedAuction]);

  const handlePlaceBid = async () => {
    if (!bidAmount || !selectedAuction) return;

    const bidValue = parseFloat(bidAmount);
    const minimumRequired =
      bidInfo?.minimumBid || selectedAuction?.minimumBid || 1;

    if (isNaN(bidValue) || bidValue < minimumRequired) {
      alert(`Minimum bid is ₨${minimumRequired.toLocaleString()}`);
      return;
    }

    try {
      setIsPlacingBid(true);
      await placeBid(bidValue);
      setShowBidModal(false);
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const getBidPlacingInfo = () => {
    const rtdbAuctionState = realtimeAuction.auctionState || {};
    const currentBid =
      rtdbAuctionState.currentHighestBid || selectedAuction?.currentHighestBid;
    const originalMinimumBid =
      rtdbAuctionState.startingBid || selectedAuction?.startingBid || 0;

    // Calculate minimum bid as 1% higher than current bid
    const minimumBid =
      currentBid > 0
        ? Math.ceil(currentBid * 1.01)
        : Math.max(originalMinimumBid, 1);

    setBidInfo({ minimumBid, currentBid });
  };

  return (
    <AnimatePresence>
      {showBidModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseBidModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Place Your Bid
            </h3>

            {selectedAuction ? (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedAuction.title}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    Current Bid: ₨{bidInfo?.currentBid?.toLocaleString()}
                  </div>
                  <div>
                    Minimum Bid: ₨{bidInfo?.minimumBid?.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 text-red-600">
                Error: No auction selected
              </div>
            )}

            {selectedAuction && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount (₨)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={bidInfo?.minimumBid}
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`Minimum: ${bidInfo?.minimumBid?.toLocaleString()}`}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Must be at least ₨{bidInfo?.minimumBid?.toLocaleString()} (1%
                  higher than current bid)
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleCloseBidModal}
                variant="outline"
                className="flex-1"
                disabled={isPlacingBid}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlaceBid}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                disabled={isPlacingBid}
              >
                {isPlacingBid ? "Placing Bid..." : "Place Bid"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuctionPlaceBidModal;
