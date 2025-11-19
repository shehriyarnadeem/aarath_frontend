import React from "react";

const AuctionQuickStats = ({ auctionProducts }) => {
  const totalAuctions = auctionProducts.length;
  const activeBids = auctionProducts.reduce(
    (sum, auction) => sum + (auction.totalBids || 0),
    0
  );

  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
        Quick Stats
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Auctions</span>
          <span className="font-semibold text-gray-900">{totalAuctions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Active Bids</span>
          <span className="font-semibold text-green-600">{activeBids}</span>
        </div>
      </div>
    </div>
  );
};

export default AuctionQuickStats;
