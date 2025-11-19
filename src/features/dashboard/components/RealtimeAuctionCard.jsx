import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Package, MapPin, Gavel, Activity, Trophy } from "lucide-react";
import Button from "../../../components/Button";
import {
  useRealtimeAuction,
  useOnlineParticipants,
  useBidding,
} from "../../../hooks";

/**
 * RealtimeAuctionCard Component - Individual auction card with Firebase integration
 * @param {Object} auction - Formatted auction data for UI display
 * @param {Object} rawAuction - Raw auction data from API for Firebase subscriptions
 * @param {Function} onBidClick - Callback when bid button is clicked
 * @param {Function} onWatchToggle - Callback when watch button is toggled
 * @param {boolean} isAuthenticated - Whether user is authenticated
 */
const RealtimeAuctionCard = ({ auction, onBidClick }) => {
  // Firebase hooks for this specific auction
  const subscribedAuction = useRealtimeAuction(auction.id, auction);
  // Get real-time data or fallback to local data
  const rtdbAuctionData = subscribedAuction?.auctionState || {};
  const bidsData = rtdbAuctionData?.bids || [];
  const totalBids = rtdbAuctionData?.totalBids || auction.totalBids;
  const currentBid = rtdbAuctionData?.currentHighestBid;
  const minimumBid = currentBid
    ? Math.ceil(currentBid * 1.01)
    : auction.minimumBid;
  // Live countdown timer
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (endTime) => {
    const now = currentTime;
    const timeLeft = endTime - now;

    if (timeLeft <= 0) return "ENDED";

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getTimeComponents = (endTime) => {
    const now = currentTime;
    const timeLeft = endTime - now;

    if (timeLeft <= 0) return { hours: 0, minutes: 0, seconds: 0, ended: true };

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, ended: false };
  };

  const handleBidButtonClick = () => {
    onBidClick(auction);
  };

  const isEnded = formatTimeLeft(auction.endTime) === "ENDED";

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Image Section */}
      <div className="relative  bg-gray-100 overflow-hidden">
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-gray-700 px-2 py-1 rounded text-xs font-medium">
            {auction.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Title & Description */}
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {auction.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {auction.description}
        </p>

        {/* Quantity & Location */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Package className="w-4 h-4 mr-1" />
            {auction.quantity} {auction.unit}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {auction.seller.location}
          </div>
        </div>

        {/* Real-time Bidding Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Starting Bid</div>
              <div className="text-sm font-medium text-gray-700">
                ₨{auction && auction.startingBid.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Current Bid</div>
              <div className="text-lg font-bold text-green-600">
                ₨{currentBid && currentBid.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Gavel className="w-4 h-4 mr-1" />
              <span
                className={
                  totalBids > auction.totalBids
                    ? "text-green-600 font-bold"
                    : ""
                }
              >
                {totalBids} bids
              </span>
            </div>
          </div>

          {/* Live bidding activity indicator */}
          {bidsData && bidsData.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-green-600 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Last bid: {bidsData[bidsData.length - 1]?.userName} - ₨
                {bidsData[bidsData.length - 1]?.amount.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Countdown Timer */}
        <div className="mb-4">
          <div
            className={`p-4 rounded-lg border-2 ${
              isEnded
                ? "bg-red-50 border-red-200 "
                : formatTimeLeft(auction.endTime).includes("h") ||
                    parseInt(formatTimeLeft(auction.endTime).split("m")[0]) > 60
                  ? "bg-green-50 border-green-200"
                  : parseInt(formatTimeLeft(auction.endTime).split("m")[0]) > 10
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Timer
                  className={`w-5 h-5 mr-2 ${
                    isEnded
                      ? "text-red-500"
                      : formatTimeLeft(auction.endTime).includes("h") ||
                          parseInt(
                            formatTimeLeft(auction.endTime).split("m")[0]
                          ) > 60
                        ? "text-green-500"
                        : parseInt(
                              formatTimeLeft(auction.endTime).split("m")[0]
                            ) > 10
                          ? "text-yellow-500"
                          : "text-red-500"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {isEnded ? "Auction Ended" : "Time Remaining"}
                </span>
              </div>
            </div>

            {isEnded ? (
              <div className="text-center py-4 space-y-3">
                <div className="text-2xl font-bold text-red-600">ENDED</div>

                {/* Winner Display */}
                {bidsData && bidsData.length > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-800">
                        Winner
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900 mb-1">
                        {bidsData[bidsData.length - 1]?.userName || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Winning bid: ₨ {currentBid?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* No bids case */}
                {(!bidsData || bidsData.length === 0) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="text-sm text-gray-500 text-center">
                      No bids were placed
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[4rem]">
                {" "}
                {/* Live Time Display with H:M:S */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Hours */}
                  {getTimeComponents(auction.endTime).hours > 0 && (
                    <>
                      <div className="text-center bg-white rounded-lg p-2 min-w-[50px]">
                        <div className="text-xl font-bold text-green-600">
                          {String(
                            getTimeComponents(auction.endTime).hours
                          ).padStart(2, "0")}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">H</div>
                      </div>
                      <div className="text-xl font-bold text-gray-400">:</div>
                    </>
                  )}

                  {/* Minutes */}
                  <div className="text-center bg-white rounded-lg p-2 min-w-[50px]">
                    <div
                      className={`text-xl font-bold ${
                        getTimeComponents(auction.endTime).hours > 0 ||
                        getTimeComponents(auction.endTime).minutes > 10
                          ? "text-green-600"
                          : getTimeComponents(auction.endTime).minutes > 5
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {String(
                        getTimeComponents(auction.endTime).minutes
                      ).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">M</div>
                  </div>

                  <div className="text-xl font-bold text-gray-400">:</div>

                  {/* Seconds */}
                  <div className="text-center bg-white rounded-lg p-2 min-w-[50px] max-h-[60px]">
                    <div
                      className={`text-xl font-bold transition-all duration-300 ${
                        getTimeComponents(auction.endTime).hours > 0 ||
                        getTimeComponents(auction.endTime).minutes > 10
                          ? "text-green-600"
                          : getTimeComponents(auction.endTime).minutes > 5
                            ? "text-yellow-600"
                            : getTimeComponents(auction.endTime).minutes < 1
                              ? "text-red-600 animate-pulse scale-110"
                              : "text-red-600"
                      }`}
                    >
                      {String(
                        getTimeComponents(auction.endTime).seconds
                      ).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">S</div>
                  </div>
                </div>
                {/* Urgency Indicator */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      getTimeComponents(auction.endTime).hours > 0 ||
                      getTimeComponents(auction.endTime).minutes > 10
                        ? "bg-green-100 text-green-800"
                        : getTimeComponents(auction.endTime).minutes > 5
                          ? "bg-yellow-100 text-yellow-800"
                          : getTimeComponents(auction.endTime).minutes > 1
                            ? "bg-red-100 text-red-800"
                            : "bg-red-100 text-red-800 animate-pulse"
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {auction.seller.name.charAt(0)}
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-900">
                {auction.seller.name}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleBidButtonClick}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold py-3"
            disabled={isEnded}
          >
            {isEnded ? "Auction Ended" : `Bid ₨${minimumBid.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RealtimeAuctionCard;
