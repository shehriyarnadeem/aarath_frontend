import { useState, useEffect, useCallback, useContext } from "react";
import { FirebaseAuctionService } from "../services/firebaseAuctionService";
import AuthContext from "../context/AuthContext";

/**
 * Hook to manage real-time auction data
 * @param {string} auctionId - The auction ID to subscribe to
 * @param {Object} auctionData - Initial auction data from API
 */
export const useRealtimeAuction = (auctionId, auctionData) => {
  const { userProfile } = useContext(AuthContext);
  const [auctionState, setAuctionState] = useState({
    metadata: null,
    bids: [],
    participants: [],
    activity: [],
    isConnected: false,
    isLoading: true,
    error: null,
  });

  // Initialize auction room in Firebase
  const initializeRoom = useCallback(async () => {
    if (!auctionId || !auctionData) {
      console.log("❌ Missing auction data:", {
        auctionId,
        hasAuctionData: !!auctionData,
      });
      return;
    }

    try {
      console.log("🚀 Initializing auction room:", auctionId, auctionData);
      await FirebaseAuctionService.initializeAuctionRoom(auctionData);

      // Join the auction room
      if (userProfile) {
        await FirebaseAuctionService.joinAuctionRoom(auctionId, userProfile);
      }
    } catch (error) {
      console.error("Error initializing auction room:", error);
      setAuctionState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, [auctionId, auctionData, userProfile]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!auctionId) return;

    const unsubscribeFunctions = [];

    const setupSubscriptions = async () => {
      try {
        // Initialize room first
        await initializeRoom();

        // Subscribe to auction metadata
        const unsubscribeAuction = FirebaseAuctionService.subscribeToAuction(
          auctionId,
          (data) => {
            setAuctionState((prev) => ({
              ...prev,
              metadata: data.metadata,
              isConnected: true,
              isLoading: false,
              error: null,
            }));
          }
        );
        unsubscribeFunctions.push(unsubscribeAuction);

        // Subscribe to bids
        const unsubscribeBids = FirebaseAuctionService.subscribeToBids(
          auctionId,
          (bids) => {
            setAuctionState((prev) => ({
              ...prev,
              bids,
            }));
          }
        );
        unsubscribeFunctions.push(unsubscribeBids);

        // Subscribe to participants
        const unsubscribeParticipants =
          FirebaseAuctionService.subscribeToParticipants(
            auctionId,
            (participants) => {
              setAuctionState((prev) => ({
                ...prev,
                participants,
              }));
            }
          );
        unsubscribeFunctions.push(unsubscribeParticipants);

        // Subscribe to activity feed
        const unsubscribeActivity = FirebaseAuctionService.subscribeToActivity(
          auctionId,
          (activity) => {
            setAuctionState((prev) => ({
              ...prev,
              activity,
            }));
          }
        );
        unsubscribeFunctions.push(unsubscribeActivity);
      } catch (error) {
        console.error("Error setting up subscriptions:", error);
        setAuctionState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
      }
    };

    setupSubscriptions();

    // Cleanup function
    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
      FirebaseAuctionService.cleanup(auctionId);
    };
  }, [auctionId]);

  return auctionState;
};

/**
 * Hook to manage bid placement
 * @param {string} auctionId
 */
export const useBidding = (auctionId) => {
  const { userProfile } = useContext(AuthContext);
  const [bidState, setBidState] = useState({
    isPlacing: false,
    error: null,
    lastBidId: null,
  });

  const placeBid = useCallback(
    async (bidAmount) => {
      if (!auctionId || !userProfile || !bidAmount) {
        throw new Error("Missing required parameters for bid placement");
      }
      console.log(`💰 Placing bid of $${bidAmount} in auction ${auctionId}`);
      setBidState((prev) => ({ ...prev, isPlacing: true, error: null }));

      try {
        const bidId = await FirebaseAuctionService.placeBid(
          auctionId,
          bidAmount,
          userProfile
        );

        setBidState((prev) => ({
          ...prev,
          isPlacing: false,
          lastBidId: bidId,
          error: null,
        }));

        return bidId;
      } catch (error) {
        setBidState((prev) => ({
          ...prev,
          isPlacing: false,
          error: error.message,
        }));
        throw error;
      }
    },
    [auctionId, userProfile]
  );

  const getTotalBids = useCallback(async () => {
    if (!auctionId) {
      throw new Error("Auction ID is required to fetch total bids");
    }
    try {
      const total = await FirebaseAuctionService.getTotalBids(auctionId);
      return total;
    } catch (error) {
      setBidState((prev) => ({
        ...prev,
        error: error.message,
      }));
      throw error;
    }
  }, [auctionId]);

  return {
    placeBid,
    getTotalBids,
    isPlacing: bidState.isPlacing,
    bidError: bidState.error,
    lastBidId: bidState.lastBidId,
  };
};

/**
 * Hook to manage auction timer with real-time updates
 * @param {Object} auctionMetadata - Real-time auction metadata
 */
export const useAuctionTimer = (auctionId, auctionMetadata) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
    totalSeconds: 0,
  });
  useEffect(() => {
    if (auctionMetadata && auctionMetadata?.hasEnded) {
      setTimeLeft({
        hours: 0,
        minutes: 0,
        seconds: 0,
        ended: true,
        totalSeconds: 0,
      });
      return;
    }
    console.log(auctionMetadata, "--endtime");
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(auctionMetadata?.endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        return {
          hours: 0,
          minutes: 0,
          seconds: 0,
          ended: true,
          totalSeconds: 0,
        };
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return {
        hours,
        minutes,
        seconds,
        ended: false,
        totalSeconds,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Set up timer
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [auctionId]);

  return timeLeft;
};

/**
 * Hook to get online participants count
 * @param {Array} participants - Array of participants from Firebase
 */
export const useOnlineParticipants = (participants) => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!participants || !Array.isArray(participants)) {
      setOnlineCount(0);
      setOnlineUsers([]);
      return;
    }

    const online = participants.filter((p) => p.isOnline);
    setOnlineCount(online.length);
    setOnlineUsers(online);
  }, [participants]);

  return {
    onlineCount,
    onlineUsers,
    totalParticipants: participants?.length || 0,
  };
};

/**
 * Hook to get auction statistics
 * @param {Object} auctionState - Complete auction state from useRealtimeAuction
 */
export const useAuctionStats = (auctionState) => {
  const [stats, setStats] = useState({
    totalBids: 0,
    uniqueBidders: 0,
    averageBidIncrement: 0,
    highestBidder: null,
    bidFrequency: 0, // bids per minute
  });

  useEffect(() => {
    if (!auctionState.bids || auctionState.bids.length === 0) {
      setStats({
        totalBids: 0,
        uniqueBidders: 0,
        averageBidIncrement: 0,
        highestBidder: null,
        bidFrequency: 0,
      });
      return;
    }

    const { bids, metadata } = auctionState;

    // Calculate unique bidders
    const uniqueBidders = new Set(bids.map((bid) => bid.userId)).size;

    // Find highest bidder
    const highestBid = bids.find((bid) => bid.isWinning) || bids[0];

    // Calculate average bid increment
    let totalIncrement = 0;
    if (bids.length > 1) {
      const sortedBids = [...bids].sort((a, b) => a.amount - b.amount);
      for (let i = 1; i < sortedBids.length; i++) {
        totalIncrement += sortedBids[i].amount - sortedBids[i - 1].amount;
      }
    }
    const averageBidIncrement =
      bids.length > 1 ? totalIncrement / (bids.length - 1) : 0;

    // Calculate bid frequency (bids per minute)
    let bidFrequency = 0;
    if (bids.length > 1 && metadata?.startTime) {
      const firstBidTime = Math.min(...bids.map((bid) => bid.timestamp || 0));
      const lastBidTime = Math.max(...bids.map((bid) => bid.timestamp || 0));
      const timeSpanMinutes = (lastBidTime - firstBidTime) / (1000 * 60);
      bidFrequency = timeSpanMinutes > 0 ? bids.length / timeSpanMinutes : 0;
    }

    setStats({
      totalBids: bids.length,
      uniqueBidders,
      averageBidIncrement,
      highestBidder: highestBid,
      bidFrequency,
    });
  }, [auctionState.bids, auctionState.metadata]);

  return stats;
};
