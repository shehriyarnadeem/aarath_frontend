import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  UserPlus,
  Gavel,
  Activity,
} from "lucide-react";
import Button from "../../../components/Button";
import { apiClient } from "../../../api/client";
import {
  useRealtimeAuction,
  useBidding,
  useAuctionTimer,
  useOnlineParticipants,
} from "../../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
// Helper functions for activity feed
const getActivityIcon = (type) => {
  switch (type) {
    case "bid":
      return <Gavel className="w-4 h-4 text-green-600" />;
    case "join":
      return <UserPlus className="w-4 h-4 text-blue-600" />;
    case "outbid":
      return <TrendingUp className="w-4 h-4 text-orange-600" />;
    case "leave":
      return <Users className="w-4 h-4 text-gray-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case "bid":
      return {
        bg: "bg-green-100",
        badge: "bg-green-100 text-green-800",
      };
    case "join":
      return {
        bg: "bg-blue-100",
        badge: "bg-blue-100 text-blue-800",
      };
    case "outbid":
      return {
        bg: "bg-orange-100",
        badge: "bg-orange-100 text-orange-800",
      };
    case "leave":
      return {
        bg: "bg-gray-100",
        badge: "bg-gray-100 text-gray-800",
      };
    default:
      return {
        bg: "bg-gray-100",
        badge: "bg-gray-100 text-gray-800",
      };
  }
};

const formatActivityMessage = (activity) => {
  if (!activity.message) return "Unknown activity";

  // Make the message more professional
  const message = activity.message;
  const userName = activity.userName || "Someone";

  switch (activity.type) {
    case "bid":
      return `${userName} placed a bid`;
    case "join":
      return `${userName} joined the auction`;
    case "outbid":
      return `${userName} was outbid`;
    case "leave":
      return `${userName} left the auction`;
    default:
      return message;
  }
};

const formatTimeAgo = (timestamp) => {
  const now = new Date().getTime();
  const time = new Date(timestamp).getTime();
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

// Helper function to generate dummy images for demonstration
const generateDummyImages = (productCategory, productTitle) => {
  // Using picsum.photos for dummy images with different seeds for variety
  const baseUrl = "https://picsum.photos";
  const imageSize = "800/600";

  // Generate different seeds based on product info for consistency
  const seeds = [
    Math.abs(productTitle.charCodeAt(0) * 137),
    Math.abs(productTitle.charCodeAt(1) * 241) % 1000,
    Math.abs(productCategory.charCodeAt(0) * 173) % 1000,
    Math.abs((productTitle.length + productCategory.length) * 191) % 1000,
  ];

  // Generate 2-4 images per product
  const numImages = Math.floor(Math.random() * 3) + 2;
  return seeds
    .slice(0, numImages)
    .map((seed) => `${baseUrl}/${imageSize}?random=${seed}`);
};
// Helper function to transform API auction data to auction room format
const transformProductToAuctionFormat = (auction) => {
  // Get product data from the nested product object
  const product = auction.product;
  // Calculate minimum next bid (1% higher than current bid)
  const currentBid = auction.currentHighestBid || auction.startingBid || 0;
  const minimumNextBid = currentBid * 1.01;
  console.log(auction, "real product");
  // Get seller name from user data
  const sellerName =
    product?.user?.businessName ||
    product?.user?.companyName ||
    product?.user?.name ||
    "Anonymous";

  const sellerCity = product?.user?.city || "";
  const sellerState = product?.user?.state || "";
  const sellerRole = product?.user?.role || "buyer";
  const sellerAddress = product?.user?.businessAddress || "";
  const sellerEmail = product?.user?.email || "";

  // Get location from user data
  const location =
    product?.user?.city && product?.user?.state
      ? `${product.user.city}, ${product.user.state}`
      : "Pakistan";

  // Use the formatted time remaining from backend if available
  let timeRemainingFormatted = auction.timeRemainingFormatted || "";

  // Fallback: Calculate time since created if no timeRemaining
  if (timeRemainingFormatted && auction.startTime) {
    const createdDate = new Date(auction.startTime);
    const now = new Date();
    const timeDiff = Math.floor((now - createdDate) / (1000 * 60)); // minutes
    timeRemainingFormatted =
      timeDiff < 60
        ? `${timeDiff} minutes ago`
        : `${Math.floor(timeDiff / 60)} hours ago`;
  }

  return {
    id: auction.id,
    serialNumber: product?.serialNumber || auction.id,
    title: product?.title || "Auction Item",
    quantity: product ? `${product.quantity} ${product.unit}` : "1 unit",
    category: product?.category || "General",
    location: location,
    seller: {
      name: sellerName,
      city: sellerCity,
      state: sellerState,
      role: sellerRole,
      businessAddress: sellerAddress,
      email: sellerEmail,
    },
    currentBid: currentBid,
    startingBid: auction.startingBid || 0,
    minimumNextBid: Math.ceil(minimumNextBid),
    totalBids: auction.totalBids || Math.floor(Math.random() * 15) + 3, // Use API data or fallback to random
    watchers: auction.totalParticipants || Math.floor(Math.random() * 25) + 5, // Use API data or fallback to random
    image: (() => {
      if (product?.images && product.images.length > 0) {
        return product.images[0];
      }
      // Generate dummy images if no real images available
      const dummyImages = generateDummyImages(
        product?.category || "General",
        product?.title || "Auction Item"
      );
      return dummyImages[0];
    })(),
    images: (() => {
      if (product?.images && product.images.length > 0) {
        return product.images;
      }
      // Generate dummy images for testing the gallery
      return generateDummyImages(
        product?.category || "General",
        product?.title || "Auction Item"
      );
    })(),
    description: product?.description || "Auction item description",
    auctionEndTime: auction.endTime, // Use endTime from auction data
    auctionStatus: auction.status,
    auctionDuration: auction.auctionDuration, // Duration in hours from API
    createdAt: auction.createdAt,
    timeAgo: timeRemainingFormatted,
    // Remove specifications for now - not in our schema
    specifications: null,
  };
};

const AuctionRoom = (props) => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidHelp, setShowBidHelp] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // API data state
  const [auctionProducts, setAuctionProducts] = useState([]);
  const [rawAuctionData, setRawAuctionData] = useState([]); // Store raw API data for Firebase
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use API data only
  const effectiveAuctionRooms = auctionProducts;
  const currentAuction = effectiveAuctionRooms[currentRoom];
  const currentRawAuction = rawAuctionData[currentRoom]; // Raw auction data for Firebase

  // Firebase real-time integration - pass raw auction data
  const realtimeAuction = useRealtimeAuction(
    currentAuction?.id,
    currentRawAuction && currentAuction ? currentRawAuction : null
  );
  const { placeBid, isPlacing } = useBidding(currentAuction?.id);
  const timeLeft = useAuctionTimer(
    currentAuction?.id,
    currentRawAuction && currentAuction ? currentRawAuction : null
  );

  const { onlineCount } = useOnlineParticipants(realtimeAuction.participants);

  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.products.getAuctions("active");

        if (response.success && response.data && response.data.auctions) {
          // Store raw auction data for Firebase
          setRawAuctionData(response.data.auctions);

          // Transform API auctions to auction room format for UI
          const transformedProducts = response.data.auctions.map(
            transformProductToAuctionFormat
          );
          setAuctionProducts(transformedProducts); // TODO: Handle pagination data from response.data.pagination for future pagination implementation
          // Available pagination data: currentPage, totalPages, totalCount, hasNext, hasPrevious
        } else {
          setRawAuctionData([]);
          setAuctionProducts([]);
        }
      } catch (err) {
        console.error("Error fetching auction products:", err);
        setError("Failed to load auction products");
        setAuctionProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionProducts();
  }, []);

  // Firebase timer and real-time data replaces the old timer logic

  const nextRoom = () => {
    setCurrentRoom((prev) => (prev + 1) % effectiveAuctionRooms.length);
    setBidAmount("");
    setShowBidHelp(false);
    setSelectedImageIndex(0); // Reset to first image
  };

  const prevRoom = () => {
    setCurrentRoom(
      (prev) =>
        (prev - 1 + effectiveAuctionRooms.length) % effectiveAuctionRooms.length
    );
    setBidAmount("");
    setShowBidHelp(false);
    setSelectedImageIndex(0); // Reset to first image
  };

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    const minBid = realtimeAuction.metadata?.currentHighestBid
      ? realtimeAuction.metadata.currentHighestBid + 100
      : currentAuction?.startingBid || 0;

    if (!amount || amount < minBid) {
      alert(`Please bid at least PKR ${minBid.toLocaleString()}`);
      return;
    }

    try {
      await placeBid(amount);
      setBidAmount("");
      // Success feedback will come from real-time updates
    } catch (error) {
      alert(`Failed to place bid: ${error.message}`);
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const formatTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading auction products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Auctions
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (effectiveAuctionRooms.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Active Auctions
            </h2>
            <p className="text-gray-600 mb-6">
              There are currently no active auction products available. Check
              back later or list your own products for auction.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/my-products")}
            >
              List Your Product
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow border p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="w-3 h-3 bg-red-600 rounded-full animate-pulse"
                title="Live"
              ></div>
              <span className="text-base sm:text-lg font-semibold text-green-700">
                Live Bidding Room
              </span>

              <span className="ml-1 sm:ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {onlineCount} Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                Auction <span className="font-bold">{currentRoom + 1}</span> /{" "}
                {effectiveAuctionRooms.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-4 mb-6">
          {/* Mobile Layout - Stacked */}
          <div className="block md:hidden space-y-4">
            {/* Title and location on mobile */}
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-center gap-2">
                <span>{currentAuction.title}</span>
                {currentAuction.image && (
                  <img
                    src={currentAuction.image}
                    alt={currentAuction.title}
                    className="w-8 h-8 object-cover rounded-full border"
                  />
                )}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentAuction.location}
              </div>
            </div>

            {/* Navigation buttons on mobile - full width */}
            <div className="flex gap-3">
              <button
                onClick={prevRoom}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-base"
                disabled={effectiveAuctionRooms.length <= 1}
                aria-label="Previous Auction"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </button>

              <button
                onClick={nextRoom}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-base"
                disabled={effectiveAuctionRooms.length <= 1}
                aria-label="Next Auction"
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Layout - Original three-column */}
          <div className="hidden md:flex items-center justify-between">
            <button
              onClick={prevRoom}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg"
              disabled={effectiveAuctionRooms.length <= 1}
              aria-label="Previous Auction"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <span>{currentAuction.title}</span>
                {currentAuction.image && (
                  <img
                    src={currentAuction.image}
                    alt={currentAuction.title}
                    className="w-8 h-8 object-cover rounded-full border"
                  />
                )}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentAuction.location}
              </div>
            </div>

            <button
              onClick={nextRoom}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg"
              disabled={effectiveAuctionRooms.length <= 1}
              aria-label="Next Auction"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Section - Left Side (1/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image & Basic Info */}
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="mb-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-3">
                  {currentAuction.category}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {currentAuction.title}
                </h2>
                <div className="text-lg text-blue-600 font-semibold">
                  Quantity: {currentAuction.quantity}
                </div>
              </div>

              {/* Enhanced Image Gallery */}
              <div className="mb-6">
                {currentAuction.image ? (
                  <div className="space-y-4">
                    {/* Main Image - Enlarged */}
                    <div className="relative items-center flex justify-center">
                      <img
                        src={
                          currentAuction.images?.[selectedImageIndex] ||
                          currentAuction.image
                        }
                        alt={currentAuction.title}
                        className="md:w-[40rem] md:h-full object-cover rounded-lg border"
                      />
                      {/* Image counter */}
                      {currentAuction.images &&
                        currentAuction.images.length > 1 && (
                          <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                            {selectedImageIndex + 1} /{" "}
                            {currentAuction.images.length}
                          </div>
                        )}
                    </div>

                    {/* Image Thumbnails */}
                    {currentAuction.images &&
                      currentAuction.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {currentAuction.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`flex-shrink-0 relative ${
                                selectedImageIndex === index
                                  ? "ring-2 ring-blue-500 ring-offset-2"
                                  : "ring-1 ring-gray-200"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${currentAuction.title} ${index + 1}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                              {selectedImageIndex === index && (
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded border"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">📷</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 mb-2">
                  {currentAuction.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Product Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium text-sm">
                      Category:
                    </span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {currentAuction.category}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium text-sm">
                      Quantity:
                    </span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {currentAuction.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium text-sm">
                      Location:
                    </span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {currentAuction.location}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium text-sm">
                      Auction Duration:
                    </span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {currentAuction.auctionDuration} hours
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium text-sm">
                      Listed:
                    </span>
                    <span className="text-gray-900 font-semibold text-sm">
                      {currentAuction.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Seller Info - Real-time */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Seller Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border">
                  {/* If seller avatar available in auctionProducts, show it */}
                  {auctionProducts?.seller?.avatar ? (
                    <img
                      src={auctionProducts?.seller?.avatar}
                      alt={auctionProducts?.seller?.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <UserPlus className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {currentAuction?.seller?.name}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {realtimeAuction.metadata?.seller?.location ||
                      currentAuction.location}
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Info className="w-4 h-4" />
                    <span>
                      <span className="font-semibold">Email:</span>{" "}
                      {currentAuction?.seller?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>
                      <span className="font-semibold">Business Address:</span>{" "}
                      {currentAuction?.seller?.businessAddress ||
                        currentAuction?.location ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserPlus className="w-4 h-4" />
                    <span>
                      <span className="font-semibold">Role:</span>{" "}
                      {currentAuction?.seller?.role || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Everything Else - Right Side (2/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timer */}
            <div
              className={`${timeLeft.ended ? "bg-gray-50 border-gray-200" : "bg-red-50 border-red-200"} rounded-lg p-6`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock
                    className={`w-5 h-5 ${timeLeft.ended ? "text-gray-600" : "text-red-600"}`}
                  />
                  <span
                    className={`${timeLeft.ended ? "text-gray-600" : "text-red-600"} font-medium`}
                  >
                    {timeLeft.ended ? "Auction Ended" : "Time Remaining"}
                  </span>
                </div>
                {timeLeft.ended ? (
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    00:00:00
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatTime(timeLeft?.hours)}
                      </div>
                      <div className="text-xs text-red-500">Hours</div>
                    </div>
                    <div className="text-red-600 text-2xl">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatTime(timeLeft?.minutes)}
                      </div>
                      <div className="text-xs text-red-500">Minutes</div>
                    </div>
                    <div className="text-red-600 text-2xl">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatTime(timeLeft?.seconds)}
                      </div>
                      <div className="text-xs text-red-500">Seconds</div>
                    </div>
                  </div>
                )}
                <div
                  className={`text-xs ${timeLeft.ended ? "text-gray-600" : "text-red-600"}`}
                >
                  {timeLeft.ended ? "No more bidding allowed" : "Hurry Up!"}
                </div>
              </div>
            </div>

            {/* Current Bid Status */}
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Current Highest Bid
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {formatCurrency(
                    realtimeAuction.metadata?.currentHighestBid ||
                      currentAuction?.currentBid ||
                      currentAuction?.startingBid ||
                      0
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {realtimeAuction.bids && realtimeAuction.bids.length > 0
                    ? `by ${realtimeAuction.bids[0].userName}`
                    : "Starting bid"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    Starting Bid
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(currentAuction.startingBid)}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-orange-600 font-medium mb-1">
                    Online Now
                  </div>
                  <div className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                    <Users className="w-5 h-5" />
                    {onlineCount}
                  </div>
                </div>
              </div>

              {/* Bid Input */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-lg font-semibold text-gray-700">
                    Place Your Bid
                  </label>
                  <button
                    onClick={() => setShowBidHelp(!showBidHelp)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>

                {showBidHelp && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">Bidding Rules:</div>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>
                          Minimum bid: PKR{" "}
                          {currentAuction.minimumNextBid.toLocaleString()}
                        </li>
                        <li>
                          Each bid must be 1% higher than the previous bid
                        </li>
                        <li>Place your bid before time expires</li>
                        <li>Highest bidder wins the product</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="relative mb-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Minimum PKR ${(
                      (realtimeAuction.metadata?.currentHighestBid ||
                        currentAuction?.startingBid ||
                        0) + 100
                    ).toLocaleString()}`}
                    className="w-full pl-10 pr-4 py-4 text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Minimum Bid:{" "}
                  {formatCurrency(
                    (realtimeAuction.metadata?.currentHighestBid ||
                      currentAuction?.startingBid ||
                      0) + 100
                  )}
                </div>

                <Button
                  onClick={handlePlaceBid}
                  disabled={isPlacing || timeLeft.ended}
                  className={`w-full py-4 text-xl font-bold rounded-lg ${
                    timeLeft.ended
                      ? "bg-gray-400 cursor-not-allowed"
                      : isPlacing
                        ? "bg-green-400"
                        : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isPlacing
                    ? "Placing Bid..."
                    : timeLeft.ended
                      ? "Auction Ended"
                      : "Place Bid"}
                </Button>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bid History ({realtimeAuction.bids?.length || 0} bids)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {realtimeAuction.bids && realtimeAuction.bids.length > 0 ? (
                  realtimeAuction.bids.map((bid, index) => (
                    <div
                      key={bid.id || index}
                      className={`p-3 rounded-lg border-2 ${
                        index === 0
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {bid.userName}
                            {index === 0 && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {bid.timestamp
                              ? new Date(bid.timestamp).toLocaleTimeString()
                              : "Just now"}
                          </div>
                        </div>
                        <div
                          className={`font-bold text-lg ${
                            index === 0 ? "text-green-600" : "text-gray-700"
                          }`}
                        >
                          {formatCurrency(bid.amount)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-2xl mb-2">📋</div>
                    <p>No bids yet. Be the first to bid!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              {/* Header with Activity Count */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="relative">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    Live Activity
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      Last updated: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="p-4">
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {realtimeAuction.activity &&
                  realtimeAuction.activity.length > 0 ? (
                    realtimeAuction.activity
                      .slice(0, 100)
                      .map((activity, index) => {
                        const isRecent = index < 3; // Highlight recent activities
                        const activityIcon = getActivityIcon(activity.type);
                        const activityColor = getActivityColor(activity.type);

                        return (
                          <div
                            key={activity.id || index}
                            className={`relative p-3 rounded-lg border   ${
                              isRecent
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200  "
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {/* Activity Type Indicator */}
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activityColor.bg}`}
                              >
                                {activityIcon}
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Activity Message */}
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {formatActivityMessage(activity)}
                                </div>

                                {/* Activity Details */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>
                                      {activity.timestamp
                                        ? formatTimeAgo(activity.timestamp)
                                        : "Just now"}
                                    </span>
                                    {activity.amount && (
                                      <>
                                        <span>•</span>
                                        <span className="font-semibold text-green-600">
                                          {formatCurrency(activity.amount)}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {/* Activity Type Badge */}
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${activityColor.badge}`}
                                  >
                                    {activity.type?.charAt(0).toUpperCase() +
                                      activity.type?.slice(1) || "Activity"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        No Activity Yet
                      </h4>
                      <p className="text-xs text-gray-500 max-w-xs mx-auto">
                        When bidders join or place bids, their activity will
                        appear here in real-time.
                      </p>
                    </div>
                  )}
                </div>

                {/* Activity Summary */}
                {realtimeAuction && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">
                          {realtimeAuction.participants?.length || 0}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          Participants
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">
                          {realtimeAuction.bids?.length || 0}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Bids Placed
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium mb-1">Safety Information:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Only bid if you intend to purchase</li>
                    <li>Contact seller within 24 hours if you win</li>
                    <li>Inspect product before making payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;
