/**
 * Utility functions for auction-related operations
 */

/**
 * Helper function to generate dummy images for demonstration
 * @param {string} productCategory - Category of the product
 * @param {string} productTitle - Title of the product
 * @returns {Array<string>} Array of image URLs
 */
export const generateDummyImages = (productCategory, productTitle) => {
  const baseUrl = "https://picsum.photos";
  const imageSize = "800/600";

  const seeds = [
    Math.abs(productTitle.charCodeAt(0) * 137),
    Math.abs(productTitle.charCodeAt(1) * 241) % 1000,
    Math.abs(productCategory.charCodeAt(0) * 173) % 1000,
    Math.abs((productTitle.length + productCategory.length) * 191) % 1000,
  ];

  const numImages = Math.floor(Math.random() * 3) + 2;
  return seeds
    .slice(0, numImages)
    .map((seed) => `${baseUrl}/${imageSize}?random=${seed}`);
};

/**
 * Helper function to transform API auction data to auction room format
 * @param {Object} auction - Raw auction data from API
 * @returns {Object} Transformed auction data for UI display
 */
export const transformProductToAuctionFormat = (auction) => {
  const product = auction.product;
  const currentHighestBid =
    auction.currentHighestBid || auction.startingBid || 0;
  const minimumNextBid = currentHighestBid * 1.01;

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

  const location =
    product?.user?.city && product?.user?.state
      ? `${product.user.city}, ${product.user.state}`
      : "Pakistan";

  let timeRemainingFormatted = auction.timeRemainingFormatted || "";

  if (timeRemainingFormatted && auction.startTime) {
    const createdDate = new Date(auction.startTime);
    const now = new Date();
    const timeDiff = Math.floor((now - createdDate) / (1000 * 60));
    timeRemainingFormatted =
      timeDiff < 60
        ? `${timeDiff} minutes ago`
        : `${Math.floor(timeDiff / 60)} hours ago`;
  }

  return {
    id: auction.id,
    serialNumber: product?.serialNumber || auction.id,
    title: product?.title || "Auction Item",
    quantity: product ? `${product.quantity}` : "1",
    unit: product?.unit || "unit",
    category: product?.category || "General",
    location: location,
    seller: {
      name: sellerName,
      city: sellerCity,
      state: sellerState,
      role: sellerRole,
      businessAddress: sellerAddress,
      email: sellerEmail,
      location: location,
      rating: 4.5 + Math.random() * 0.5, // Mock rating
      totalSales: Math.floor(Math.random() * 200) + 50, // Mock sales
    },
    currentHighestBid: currentHighestBid,
    startingBid: auction.startingBid || 0,
    minimumBid: Math.ceil(minimumNextBid),
    totalBids: auction.totalBids || 0,
    endTime: new Date(auction.endTime),
    image: (() => {
      if (product?.images && product.images.length > 0) {
        return product.images[0];
      }
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
      return generateDummyImages(
        product?.category || "General",
        product?.title || "Auction Item"
      );
    })(),
    description: product?.description || "Auction item description",
    auctionEndTime: auction.endTime,
    auctionStatus: auction.status,
    auctionDuration: auction.auctionDuration,
    createdAt: auction.createdAt,
    timeAgo: timeRemainingFormatted,
    isWatched: false, // Default to not watched
    tags: [
      product?.category || "General",
      "Quality Assured",
      auction.status === "active" ? "Live Auction" : "Auction",
    ].filter(Boolean),
  };
};

/**
 * Category definitions for auction products
 */
export const categories = [
  { id: "all", name: "All Categories", color: "from-blue-500 to-blue-600" },
  { id: "wheat", name: "Wheat", color: "from-amber-500 to-amber-600" },
  { id: "rice", name: "Rice", color: "from-green-500 to-green-600" },
  { id: "cotton", name: "Cotton", color: "from-white to-gray-200" },
  { id: "sugarcane", name: "Sugarcane", color: "from-lime-500 to-lime-600" },
  { id: "maize", name: "Maize", color: "from-yellow-500 to-yellow-600" },
  { id: "sesame", name: "Sesame", color: "from-gray-500 to-gray-600" },
  { id: "pulses", name: "Pulses", color: "from-red-500 to-red-600" },
];

/**
 * Sort options for auction listings
 */
export const sortOptions = [
  { id: "ending_soon", name: "Ending Soon" },
  { id: "most_watched", name: "Most Watched" },
  { id: "highest_bid", name: "Highest Bid" },
  { id: "newest", name: "Newest First" },
];

/**
 * Filter and sort auction products based on criteria
 * @param {Array} auctionProducts - Array of auction products
 * @param {string} selectedCategory - Selected category filter
 * @param {string} sortBy - Sort criteria
 * @param {string} search - Search query
 * @returns {Array} Filtered and sorted auction products
 */
export const filterAndSortAuctions = (
  auctionProducts,
  selectedCategory,
  sortBy,
  search
) => {
  let filtered = [...auctionProducts];

  // Apply category filter
  if (selectedCategory !== "all") {
    filtered = filtered.filter(
      (auction) => auction.category.toLowerCase() === selectedCategory
    );
  }

  // Apply search filter
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (auction) =>
        auction.title.toLowerCase().includes(searchLower) ||
        auction.description.toLowerCase().includes(searchLower) ||
        auction.category.toLowerCase().includes(searchLower) ||
        auction.seller.name.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  switch (sortBy) {
    case "ending_soon":
      filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
      break;
    case "most_watched":
      filtered.sort((a, b) => b.watchers - a.watchers);
      break;
    case "highest_bid":
      filtered.sort((a, b) => b.currentBid - a.currentBid);
      break;
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    default:
      break;
  }

  return filtered;
};
