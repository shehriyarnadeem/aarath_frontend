import {
  ref,
  set,
  push,
  onValue,
  off,
  update,
  serverTimestamp,
  onDisconnect,
} from "firebase/database";
import { realtimeDb, auth } from "../firebaseConfig";

/**
 * Firebase Realtime Database Service for Auction Rooms
 *
 * Database Structure:
 * /auctions/{auctionId}/
 *   ├── metadata/
 *   │   ├── auctionId: string
 *   │   ├── productId: string
 *   │   ├── title: string
 *   │   ├── status: "active" | "ended" | "paused"
 *   │   ├── startTime: timestamp
 *   │   ├── endTime: timestamp
 *   │   ├── currentHighestBid: number
 *   │   └── totalBids: number
 *   ├── bids/
 *   │   └── {bidId}/
 *   │       ├── userId: string
 *   │       ├── userName: string
 *   │       ├── amount: number
 *   │       ├── timestamp: serverTimestamp
 *   │       └── isWinning: boolean
 *   ├── participants/
 *   │   └── {userId}/
 *   │       ├── userId: string
 *   │       ├── userName: string
 *   │       ├── joinedAt: timestamp
 *   │       ├── lastSeen: timestamp
 *   │       ├── isOnline: boolean
 *   │       └── totalBids: number
 *   └── activity/
 *       └── {activityId}/
 *           ├── type: "bid" | "join" | "leave" | "status_change"
 *           ├── userId: string
 *           ├── userName: string
 *           ├── message: string
 *           ├── timestamp: serverTimestamp
 *           └── data: object (additional activity-specific data)
 */

export class FirebaseAuctionService {
  /**
   * Initialize an auction room in Firebase
   * @param {Object} auctionData - Auction data from your API
   */
  static async initializeAuctionRoom(auctionId, auctionData) {
    try {
      const auctionRef = ref(realtimeDb, `aarath/auctions/${auctionId}`);
      const participantRef = ref(realtimeDb, `aarath/participants`);

      // Check if auction room already exists
      const existingData = await new Promise((resolve) => {
        onValue(
          auctionRef,
          (snapshot) => {
            resolve(snapshot.val());
          },
          { onlyOnce: true }
        );
      });

      if (existingData) {
        console.log(
          `♻️ Auction room ${auctionId} already exists, skipping initialization`
        );
        return true;
      }

      // Handle different data structures - the auctionData could be transformed auction or raw API data
      const productId =
        auctionData.productId ||
        auctionData.product?.id ||
        auctionData.serialNumber ||
        (auctionData.id ? `product_${auctionData.id}` : "unknown"); // Create a valid productId

      const title =
        auctionData.product?.title || auctionData.title || "Auction Item";

      // Validate that we have all required fields before creating the auction room
      if (!auctionData.id) {
        throw new Error("Auction ID is required");
      }

      const auctionRoomData = {
        auctionId: auctionData.id,
        productId: productId,
        title: title,
        status: auctionData.auctionStatus || auctionData.status || "active",
        startTime: auctionData.startTime || auctionData.createdAt,
        endTime: auctionData.auctionEndTime || auctionData.endTime,
        currentHighestBid:
          auctionData.currentBid ||
          auctionData.currentHighestBid ||
          auctionData.startingBid ||
          0,
        seller: auctionData?.seller,
        startingBid: auctionData.startingBid,
        serialNumber: auctionData?.serialNumber,
        totalBids: auctionData.totalBids || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        bids: {},
        activity: {},
      };
      const participantData = { participants: {} };
      await set(auctionRef, auctionRoomData);
      await set(participantRef, participantData);

      console.log(`✅ Auction room ${auctionData.id} initialized in Firebase`);
      return true;
    } catch (error) {
      console.error("❌ Error initializing auction room:", error);
      throw error;
    }
  }

  static async updateAuctionParticipant(auctionId, userId, userName) {
    try {
      const participantRef = ref(realtimeDb, `aarath/participants/${userId}`);
      const participantData = {
        userId,
        userName,
        joinedAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        isOnline: true,
        totalBids: 0,
      };

      await set(participantRef, participantData);

      // Update total participants count (for both new and returning participants)
      await this.updateParticipantCount();

      return true;
    } catch (error) {
      console.error("❌ Error joining auction room:", error);
      throw error;
    }
  }

  /**
   * Join an auction room as a participant
   * @param {string} auctionId
   * @param {Object} userData - Current user data
   */
  static async joinAuctionRoom(auctionId, userData) {
    try {
      if (!auth.currentUser) {
        throw new Error("User must be authenticated to join auction");
      }

      console.log("Joining auction room with user data:");
      const userId = auth.currentUser.uid;
      const userName =
        userData.businessName ||
        userData.personalName ||
        userData.companyName ||
        "Anonymous";

      const participantRef = ref(realtimeDb, `aarath/participants/${userId}`);
      const existingParticipant = await new Promise((resolve) => {
        onValue(
          participantRef,
          (snapshot) => {
            resolve(snapshot.val());
          },
          { onlyOnce: true }
        );
      });

      // ✅ Only set up disconnect handlers for NEW or OFFLINE users
      if (existingParticipant && existingParticipant.isOnline) {
        // Set up presence system - mark offline when disconnected
        const presenceRef = ref(
          realtimeDb,
          `aarath/participants/${userId}/isOnline`
        );
        onDisconnect(presenceRef).set(false);

        // Set up participant count decrement
        const metadataRef = ref(
          realtimeDb,
          `aarath/auctionMetadata/totalParticipants`
        );

        // Get current count and set up decrement
        const currentCount = await new Promise((resolve) => {
          onValue(
            metadataRef,
            (snapshot) => {
              resolve(snapshot.val() || 0);
            },
            { onlyOnce: true }
          );
        });

        // Decrement count on disconnect (not set to 0!)
        onDisconnect(metadataRef).set(Math.max(0, currentCount - 1));

        console.log(`🔌 Disconnect handlers set up for ${userName}`);
      }

      // Update participant data
      await this.updateAuctionParticipant(auctionId, userId, userName);

      // Add join activity only for new/returning users
      console.log("Existing participant data:", existingParticipant);
      if (existingParticipant && !existingParticipant.isOnline) {
        await this.addActivity(
          auctionId,
          {
            type: "join",
            userId,
            userName,
            message: `${userName} joined the auction`,
          },
          "global"
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Error joining auction room:", error);
      throw error;
    }
  }
  /**
   * Leave an auction room
   * @param {string} auctionId
   */
  static async leaveAuctionRoom(auctionId) {
    try {
      if (!auth.currentUser) return;

      const userId = auth.currentUser.uid;
      const participantRef = ref(realtimeDb, `aarath/participants/${userId}`);

      // Mark as offline instead of removing (to preserve bid history)
      await update(participantRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });

      console.log(`✅ User left auction ${auctionId}`);
    } catch (error) {
      console.error("❌ Error leaving auction room:", error);
    }
  }

  /**
   * Place a bid in the auction
   * @param {string} auctionId
   * @param {number} bidAmount
   * @param {Object} userData
   */
  static async placeBid(auctionId, bidAmount, userData) {
    try {
      if (!auth.currentUser) {
        throw new Error("User must be authenticated to place bid");
      }

      const userId = auth.currentUser.uid;
      const userName =
        userData.businessName ||
        userData.personalName ||
        userData.companyName ||
        "Anonymous";
      console.log(
        `💰 Placing bid of $${bidAmount} by ${userName} in auction ${auctionId}`
      );
      // Create new bid
      const bidsRef = ref(realtimeDb, `aarath/auctions/${auctionId}/bids`);
      const newBidRef = push(bidsRef);

      const bidData = {
        userId,
        userName,
        amount: bidAmount,
        timestamp: serverTimestamp(),
        isWinning: true, // Will be updated after validation
      };

      await set(newBidRef, bidData);

      // Update auction metadata
      const metadataRef = ref(realtimeDb, `aarath/auctions/${auctionId}`);
      await update(metadataRef, {
        currentHighestBid: bidAmount,
        totalBids: (await this.getTotalBids(auctionId)) + 1,
        updatedAt: serverTimestamp(),
      });

      // Update participant's bid count
      const participantRef = ref(realtimeDb, `aarath/participants/${userId}`);
      await update(participantRef, {
        totalBids: (await this.getUserBidCount(auctionId, userId)) + 1,
        lastSeen: serverTimestamp(),
      });

      // Add bid activity
      await this.addActivity(auctionId, {
        type: "bid",
        userId,
        userName,
        timestamp: serverTimestamp(),
        message: `${userName} placed a bid of $${bidAmount.toLocaleString()}`,
        data: { bidAmount },
      });

      await this.addActivity(
        auctionId,
        {
          type: "bid",
          userId,
          userName,
          timestamp: serverTimestamp(),
          message: `${userName} placed a bid of $${bidAmount.toLocaleString()}`,
          data: { bidAmount },
        },
        "global"
      );

      console.log(`✅ Bid placed: $${bidAmount} by ${userName}`);
      return newBidRef.key;
    } catch (error) {
      console.error("❌ Error placing bid:", error);
      throw error;
    }
  }

  /**
   * Subscribe to auction room updates
   * @param {string} auctionId
   * @param {Function} callback
   */
  static subscribeToAuction(auctionId, callback) {
    const auctionRef = ref(realtimeDb, `aarath/auctions/${auctionId}`);

    const unsubscribe = onValue(auctionRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.bids) {
        const bids = [];
        Object.entries(data.bids).forEach(([key, value]) => {
          bids.push({
            id: key,
            ...value,
          });
        });
        data.bids = bids;
      }
      if (data) {
        callback(data);
      }
    });

    // Return unsubscribe function
    return () => off(auctionRef, "value", unsubscribe);
  }

  static subscribeToAuctionMetadata(callback) {
    const metadataRef = ref(realtimeDb, `aarath/auctionMetadata`);

    const unsubscribe = onValue(metadataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });

    // Return unsubscribe function
    return () => off(metadataRef, "value", unsubscribe);
  }

  /**
   * Subscribe to live bids
   * @param {string} auctionId
   * @param {Function} callback
   */
  static subscribeToBids(auctionId, callback) {
    const bidsRef = ref(realtimeDb, `aarath/auctions/${auctionId}/bids`);

    const unsubscribe = onValue(bidsRef, (snapshot) => {
      const bids = [];
      snapshot.forEach((childSnapshot) => {
        bids.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      // Sort bids by timestamp (newest first)
      bids.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(bids);
    });

    return () => off(bidsRef, "value", unsubscribe);
  }

  /**
   * Subscribe to participants (for showing who's online)
   * @param {string} auctionId
   * @param {Function} callback
   */
  static subscribeToParticipants(callback) {
    const participantsRef = ref(realtimeDb, `aarath/participants`);

    const unsubscribe = onValue(participantsRef, (snapshot) => {
      const participants = [];
      snapshot.forEach((childSnapshot) => {
        participants.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      callback(participants);
    });

    return () => off(participantsRef, "value", unsubscribe);
  }

  /**
   * Subscribe to activity feed
   * @param {string} auctionId
   * @param {Function} callback
   */
  static subscribeToActivity(auctionId, callback) {
    const activityRef = ref(
      realtimeDb,
      `aarath/auctions/${auctionId}/activity`
    );

    const unsubscribe = onValue(activityRef, (snapshot) => {
      const activities = [];
      snapshot.forEach((childSnapshot) => {
        activities.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      // Sort by timestamp (newest first)
      activities.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(activities.slice(0, 50)); // Limit to last 50 activities
    });

    return () => off(activityRef, "value", unsubscribe);
  }

  static subscribeToGlobalActivity(auctionId, userId, callback) {
    const activityRef = ref(realtimeDb, `aarath/activities}`);

    const unsubscribe = onValue(activityRef, (snapshot) => {
      const activities = [];
      snapshot.forEach((childSnapshot) => {
        activities.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      // Sort by timestamp (newest first)
      activities.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(activities); // Limit to last 50 activities
    });

    return () => off(activityRef, "value", unsubscribe);
  }

  /**
   * Add activity to the auction feed
   * @param {string} auctionId
   * @param {Object} activityData
   * @param {string} activityScope
   */
  static async addActivity(auctionId, activityData, activityScope = "auction") {
    try {
      const path =
        activityScope === "auction"
          ? `aarath/auctions/${auctionId}/activity`
          : `aarath/activities`;

      const activityRef = ref(realtimeDb, path);
      const newActivityRef = push(activityRef);

      await set(newActivityRef, {
        ...activityData,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("❌ Error adding activity:", error);
    }
  }

  /**
   * Update participant count
   * @param {string} auctionId
   */
  static async updateParticipantCount() {
    try {
      const participantsRef = ref(realtimeDb, `aarath/participants`);
      onValue(
        participantsRef,
        (snapshot) => {
          const count = snapshot.size;
          const metadataRef = ref(realtimeDb, `aarath/auctionMetadata/`);
          set(metadataRef, { totalParticipants: count });
        },
        { onlyOnce: true }
      );
    } catch (error) {
      console.error("❌ Error updating participant count:", error);
    }
  }

  /**
   * Get total bids count
   * @param {string} auctionId
   */
  static async getTotalBids(auctionId) {
    return new Promise((resolve) => {
      const bidsRef = ref(realtimeDb, `aarath/auctions/${auctionId}/bids`);
      onValue(
        bidsRef,
        (snapshot) => {
          resolve(snapshot.size || 0);
        },
        { onlyOnce: true }
      );
    });
  }

  /**
   * Get user's bid count
   * @param {string} auctionId
   * @param {string} userId
   */
  static async getUserBidCount(auctionId, userId) {
    return new Promise((resolve) => {
      const bidsRef = ref(realtimeDb, `aarath/auctions/${auctionId}/bids`);
      onValue(
        bidsRef,
        (snapshot) => {
          let count = 0;
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().userId === userId) {
              count++;
            }
          });
          resolve(count);
        },
        { onlyOnce: true }
      );
    });
  }

  /**
   * Clean up auction room (call when component unmounts)
   * @param {string} auctionId
   */
  static async cleanup(auctionId) {
    try {
      await this.leaveAuctionRoom(auctionId);
      console.log(`✅ Cleaned up auction room ${auctionId}`);
    } catch (error) {
      console.error("❌ Error cleaning up auction room:", error);
    }
  }
}

export default FirebaseAuctionService;
