import { useState, useEffect } from "react";
import { ref, onValue, off, set } from "firebase/database";
import { realtimeDb } from "../firebaseConfig";

/**
 * Hook to aggregate real-time activity from all auctions using Firebase Realtime Database
 * @param {Array} rawAuctionData - Array of auction data from API
 * @returns {Array} globalActivity - Array of recent bidding activities across all auctions
 */
export const useGlobalAuctionActivity = () => {
  const [globalActivity, setGlobalActivity] = useState([]);

  useEffect(() => {
    try {
      // Create reference to this auction's activity
      const activityRef = ref(realtimeDb, `aarath/activities`);

      // Listen for activity changes
      const unsubscribe = onValue(activityRef, (snapshot) => {
        if (snapshot.exists()) {
          const activities = snapshot.val();
          setGlobalActivity(
            Object.values(activities).sort((a, b) => b.timestamp - a.timestamp)
          );
        }
      });
    } catch (error) {
      console.warn(`Error setting up auction activity subscriptions:`, error);
    }
  }, []);

  return globalActivity;
};
