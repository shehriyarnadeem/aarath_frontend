import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { realtimeDb } from "../firebaseConfig";

/**
 * Hook to aggregate real-time activity from all auctions using Firebase Realtime Database
 * @param {Array} rawAuctionData - Array of auction data from API
 * @returns {Array} globalActivity - Array of recent bidding activities across all auctions
 */
export const useGlobalAuctionActivity = (rawAuctionData) => {
  const [globalActivity, setGlobalActivity] = useState([]);

  useEffect(() => {
    if (!rawAuctionData || rawAuctionData.length === 0) {
      setGlobalActivity([]);
      return;
    }

    console.log(
      "Setting up Firebase subscriptions for auctions:",
      rawAuctionData.map((a) => a.id)
    );

    const cleanup = [];
    const allActivities = new Map();

    // Show initial mock data immediately while Firebase loads
    const initialMockActivities = rawAuctionData
      .slice(0, 6)
      .map((auction, index) => ({
        id: `initial-${auction.id}-${index}`,
        auctionId: auction.id,
        auctionTitle: auction.product?.title || "Auction Item",
        bidderName: `AgriTrader${Math.floor(Math.random() * 999) + 1}`,
        amount:
          (auction.currentHighestBid || auction.startingBid || 10000) +
          Math.floor(Math.random() * 2000) +
          500,
        timestamp: Date.now() - (Math.floor(Math.random() * 180) + 30) * 1000, // 30-210 seconds ago
        type: "bid",
        message: "Placed a bid",
      }));

    setGlobalActivity(initialMockActivities);

    // Subscribe to each auction's activity feed using Firebase Realtime Database
    rawAuctionData.forEach((auctionData) => {
      if (!auctionData?.id) return;

      try {
        // Create reference to this auction's activity
        const activityRef = ref(
          realtimeDb,
          `auctions/${auctionData.id}/activity`
        );

        console.log(`Subscribing to activities for auction ${auctionData.id}`);

        // Listen for activity changes
        const unsubscribe = onValue(
          activityRef,
          (snapshot) => {
            const activities = [];

            if (snapshot.exists()) {
              const activityData = snapshot.val();

              // Convert Firebase object to array and sort by timestamp
              Object.entries(activityData || {}).forEach(
                ([activityId, activity]) => {
                  activities.push({
                    id: activityId,
                    auctionId: auctionData.id,
                    auctionTitle: auctionData.product?.title || "Auction Item",
                    bidderName:
                      activity.userName ||
                      activity.bidderName ||
                      `Bidder${Math.floor(Math.random() * 999) + 1}`,
                    amount:
                      activity.data?.bidAmount ||
                      activity.amount ||
                      activity.bidAmount ||
                      0,
                    timestamp: activity.timestamp || Date.now(),
                    type: activity.type || "bid",
                    message: activity.message || "",
                    ...activity,
                  });
                }
              );

              // Sort by timestamp (newest first) and take latest 5 per auction
              activities.sort((a, b) => b.timestamp - a.timestamp);
              activities.splice(5); // Keep only latest 5
            }

            // Update activities for this auction
            allActivities.set(auctionData.id, activities);

            // Combine all activities and sort by timestamp
            const combinedActivities = [];
            allActivities.forEach((auctionActivities) => {
              combinedActivities.push(...auctionActivities);
            });

            // Sort by timestamp (newest first) and take top 8
            const sortedActivities = combinedActivities
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 100);
            setGlobalActivity(sortedActivities);
          },
          (error) => {
            console.warn(
              `Could not subscribe to auction ${auctionData.id} activity:`,
              error
            );
          }
        );

        cleanup.push(() => off(activityRef, "value", unsubscribe));
      } catch (error) {
        console.warn(
          `Error setting up auction ${auctionData.id} activity subscription:`,
          error
        );
      }
    });

    return () => {
      cleanup.forEach((cleanupFn) => cleanupFn());
    };
  }, [rawAuctionData]);

  return globalActivity;
};
