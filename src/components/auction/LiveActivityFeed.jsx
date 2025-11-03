import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, UserPlus, Gavel } from "lucide-react";
import { useGlobalAuctionActivity } from "../../hooks/useAuctionActivity";

/**
 * LiveActivityFeed Component - Shows real-time bidding activity across all auctions
 * @param {Array} auctionProducts - Array of formatted auction products for UI display
 * @param {Array} rawAuctionData - Array of raw auction data from API for Firebase subscriptions
 */
const LiveActivityFeed = ({ auctionProducts, rawAuctionData }) => {
  const globalActivity = useGlobalAuctionActivity(rawAuctionData);
  const [displayActivity, setDisplayActivity] = useState([]);

  // Format activity for display
  useEffect(() => {
    if (globalActivity.length === 0) {
      setDisplayActivity([]);
      return;
    }

    // Format real Firebase activity - using actual bidder names and amounts
    const formatted = globalActivity
      .map((activity) => {
        const timeAgo = Math.floor((Date.now() - activity.timestamp) / 1000);
        const timeDisplay =
          timeAgo < 60
            ? `${timeAgo}s ago`
            : timeAgo < 3600
              ? `${Math.floor(timeAgo / 60)}m ago`
              : `${Math.floor(timeAgo / 3600)}h ago`;

        return {
          id: activity.id || `${activity.auctionId}-${activity.timestamp}`,
          bidder:
            activity.bidderName || activity.userName || `Anonymous Bidder`,
          amount: `₨${(activity.amount || 0).toLocaleString()}`,
          item:
            activity.auctionTitle?.length > 25
              ? activity.auctionTitle.substring(0, 25) + "..."
              : activity.auctionTitle || "Auction Item",
          time: timeDisplay,
          type: activity.type || "bid",
          auctionId: activity.auctionId,
        };
      })
      .slice(0, 8); // Show latest 8 activities

    setDisplayActivity(formatted);
  }, [globalActivity, auctionProducts, rawAuctionData]);

  // Show placeholder if no activities
  if (displayActivity.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center bg-white/10 rounded-lg p-4">
          <div className="text-blue-100 text-sm">
            Waiting for live bidding activity...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 scroll-auto h-[20rem] overflow-y-auto pr-1">
      <AnimatePresence>
        {displayActivity.map((activity, index) => {
          // Creative rendering based on activity type
          if (activity.type === "join") {
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-green-500/10 rounded-lg p-3 hover:bg-green-500/15 transition-colors"
              >
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 font-semibold">
                    {activity.bidder}
                  </span>
                  <span className="text-blue-100 text-xs">joined auction</span>
                </div>
                <div className="text-right">
                  <div className="text-blue-200 text-xs">{activity.time}</div>
                </div>
              </motion.div>
            );
          }

          // Default: Place Bid
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium flex items-center gap-2">
                  <Gavel className="w-3 h-3 text-yellow-400" />
                  <span>{activity.bidder}</span>
                  <span className="text-blue-100 text-xs">
                    placed a bid on {activity.item}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-300 font-bold">
                  {activity.amount}
                </div>
                <div className="text-blue-200 text-xs">{activity.time}</div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityFeed;
