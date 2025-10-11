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
} from "lucide-react";
import Button from "../../../components/Button";
import { apiClient } from "../../../api/client";

// Helper function to generate dummy bid history for demonstration
const generateDummyBidHistory = (currentBid, startingBid) => {
  const bidders = [
    "Ahmad Khan",
    "Fatima Ali",
    "Hassan Sheikh",
    "Ayesha Malik",
    "Usman Ahmad",
    "Zara Hussain",
    "Bilal Tariq",
    "Sana Qureshi",
    "Fahad Iqbal",
    "Rabia Nawaz",
    "Kamran Shah",
    "Nida Afridi",
  ];

  const history = [];
  const numBids = Math.floor(Math.random() * 8) + 2; // 2-10 bids
  let bidAmount = startingBid;
  const increment = (currentBid - startingBid) / numBids;

  for (let i = 0; i < numBids; i++) {
    const isLast = i === numBids - 1;
    bidAmount = isLast
      ? currentBid
      : bidAmount + increment + Math.random() * 1000;

    const minutesAgo = Math.floor(Math.random() * 60) + (numBids - i) * 5;
    const timeAgo =
      minutesAgo < 60
        ? `${minutesAgo} min ago`
        : `${Math.floor(minutesAgo / 60)}h ago`;

    history.unshift({
      bidder: bidders[Math.floor(Math.random() * bidders.length)],
      amount: Math.round(bidAmount),
      time: timeAgo,
      isWinning: isLast,
    });
  }

  return history;
};

// Helper function to transform API product data to auction room format
const transformProductToAuctionFormat = (product) => {
  // Calculate minimum next bid (1% higher than current bid)
  const currentBid = product.currentBid || product.startingBid || 0;
  const minimumNextBid = currentBid * 1.01;

  // Get seller name from user data
  const sellerName =
    product.user?.personalName ||
    product.user?.companyName ||
    product.user?.name ||
    "Zaaran traders";

  // Get location from user data
  const location =
    product.user?.city && product.user?.state
      ? `${product.user.city}, ${product.user.state}`
      : "Pakistan";

  // Calculate time since created
  const createdDate = new Date(product.createdAt);
  const now = new Date();
  const timeDiff = Math.floor((now - createdDate) / (1000 * 60)); // minutes
  const timeAgo =
    timeDiff < 60
      ? `${timeDiff} minutes ago`
      : `${Math.floor(timeDiff / 60)} hours ago`;

  return {
    id: product.id,
    serialNumber: product.serialNumber,
    title: product.title,
    quantity: `${product.quantity} ${product.unit}`,
    category: product.category,
    location: location,
    seller: {
      name: sellerName,
      phone: "Contact via platform", // Don't expose phone directly
      experience: "Verified Seller", // Can be calculated from user.createdAt later
      rating: "Platform Verified", // Can be implemented later with rating system
      verified: true, // All users on platform are verified
    },
    currentBid: currentBid,
    startingBid: product.startingBid || 0,
    minimumNextBid: Math.ceil(minimumNextBid),
    totalBids: Math.floor(Math.random() * 15) + 3, // Random 3-18 bids for demo
    watchers: Math.floor(Math.random() * 25) + 5, // Random 5-30 watchers for demo
    image:
      product.images && product.images.length > 0 ? product.images[0] : null, // No default image - show placeholder in UI if null
    description: product.description,
    auctionEndTime: product.auctionEndTime,
    auctionStatus: product.auctionStatus,
    auctionDuration: product.auctionDuration, // Duration in hours from API
    createdAt: product.createdAt,
    timeAgo: timeAgo,
    // Remove specifications for now - not in our schema
    specifications: null,
    // Generate dummy bid history for demonstration
    bidHistory: generateDummyBidHistory(currentBid, product.startingBid || 0),
  };
};

const AuctionRoom = () => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidHelp, setShowBidHelp] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    ended: false,
  });

  // API data state
  const [auctionProducts, setAuctionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // All data now comes from API - no dummy data needed

  // Fetch auction products from API
  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.products.getAuctions("active");
        console.log(response);
        if (response.success && response.products) {
          // Transform API products to auction room format
          const transformedProducts = response.products.map(
            transformProductToAuctionFormat
          );
          setAuctionProducts(transformedProducts);
        } else {
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

  // Use API data only
  const effectiveAuctionRooms = auctionProducts;
  const currentAuction = effectiveAuctionRooms[currentRoom];

  // Calculate time remaining for current auction
  const calculateTimeLeft = (endTime) => {
    if (!endTime) return { hours: 0, minutes: 0, seconds: 0, ended: true };

    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, ended: true };
    }

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      ended: false,
    };
  };

  // Update timer every second for current auction
  useEffect(() => {
    if (!currentAuction?.auctionEndTime) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentAuction.auctionEndTime));
    }, 1000);

    // Calculate initial time
    setTimeLeft(calculateTimeLeft(currentAuction.auctionEndTime));

    return () => clearInterval(timer);
  }, [currentAuction]);

  const nextRoom = () => {
    setCurrentRoom((prev) => (prev + 1) % effectiveAuctionRooms.length);
    setBidAmount("");
    setShowBidHelp(false);
  };

  const prevRoom = () => {
    setCurrentRoom(
      (prev) =>
        (prev - 1 + effectiveAuctionRooms.length) % effectiveAuctionRooms.length
    );
    setBidAmount("");
    setShowBidHelp(false);
  };

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (amount >= currentAuction.minimumNextBid) {
      alert(
        `Your bid of PKR ${amount.toLocaleString()} has been placed successfully!`
      );
      setBidAmount("");
    } else {
      alert(
        `Please bid at least PKR ${currentAuction.minimumNextBid.toLocaleString()}`
      );
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Auction Room
              </h1>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Bidding Active</span>
              </div>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 font-medium">
                Product {currentRoom + 1} of {effectiveAuctionRooms.length}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow border p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevRoom}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {currentAuction.title}
              </div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentAuction.location}
              </div>
            </div>

            <button
              onClick={nextRoom}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Details - Left Side */}
          <div className="space-y-6">
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

              <div className="mb-6">
                {currentAuction.image ? (
                  <img
                    src={currentAuction.image}
                    alt={currentAuction.title}
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
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

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seller Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      {currentAuction.seller.name}
                      {currentAuction.seller.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Rating: {currentAuction.seller.rating}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Section - Right Side */}
          <div className="space-y-6">
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
                        {formatTime(timeLeft.hours)}
                      </div>
                      <div className="text-xs text-red-500">Hours</div>
                    </div>
                    <div className="text-red-600 text-2xl">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatTime(timeLeft.minutes)}
                      </div>
                      <div className="text-xs text-red-500">Minutes</div>
                    </div>
                    <div className="text-red-600 text-2xl">:</div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatTime(timeLeft.seconds)}
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
                  {formatCurrency(currentAuction.currentBid)}
                </div>
                <div className="text-sm text-gray-600">
                  {currentAuction.bidHistory &&
                  currentAuction.bidHistory.length > 0
                    ? `by ${currentAuction.bidHistory[0].bidder}`
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
                    Watchers
                  </div>
                  <div className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                    <Users className="w-5 h-5" />
                    {currentAuction.watchers}
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
                    placeholder={`Minimum PKR ${currentAuction.minimumNextBid.toLocaleString()}`}
                    className="w-full pl-10 pr-4 py-4 text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Minimum Bid: {formatCurrency(currentAuction.minimumNextBid)}
                </div>

                <Button
                  onClick={handlePlaceBid}
                  className="w-full bg-green-600 hover:bg-green-700 py-4 text-xl font-bold rounded-lg"
                >
                  Place Bid
                </Button>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bid History ({currentAuction.totalBids} bids)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentAuction.bidHistory &&
                currentAuction.bidHistory.length > 0 ? (
                  currentAuction.bidHistory.map((bid, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        bid.isWinning
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {bid.bidder}
                            {bid.isWinning && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {bid.time}
                          </div>
                        </div>
                        <div
                          className={`font-bold text-lg ${
                            bid.isWinning ? "text-green-600" : "text-gray-700"
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
