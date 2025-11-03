/**
 * Type definitions for auction-related data structures
 * Note: This is a .js file for now, but can be converted to .ts when TypeScript is added
 */

/**
 * @typedef {Object} AuctionProduct
 * @property {string|number} id - Unique identifier for the auction
 * @property {string} title - Title of the auction item
 * @property {string} description - Description of the auction item
 * @property {string} quantity - Quantity of the product
 * @property {string} unit - Unit of measurement
 * @property {string} category - Product category
 * @property {string} location - Location of the seller
 * @property {AuctionSeller} seller - Information about the seller
 * @property {number} currentBid - Current highest bid amount
 * @property {number} startingPrice - Starting price of the auction
 * @property {number} minimumBid - Minimum next bid amount
 * @property {number} totalBids - Total number of bids placed
 * @property {number} watchers - Number of people watching the auction
 * @property {Date} endTime - When the auction ends
 * @property {string} image - Primary image URL
 * @property {string[]} images - Array of image URLs
 * @property {string} auctionStatus - Status of the auction (active, ended, etc.)
 * @property {boolean} isWatched - Whether the current user is watching
 * @property {string[]} tags - Array of tags for the auction
 */

/**
 * @typedef {Object} AuctionSeller
 * @property {string} name - Name of the seller
 * @property {string} city - City where seller is located
 * @property {string} state - State where seller is located
 * @property {string} role - Role of the seller (buyer, seller, etc.)
 * @property {string} businessAddress - Business address of the seller
 * @property {string} email - Email of the seller
 * @property {string} location - Formatted location string
 * @property {number} rating - Seller rating (1-5)
 * @property {number} totalSales - Total number of completed sales
 */

/**
 * @typedef {Object} AuctionActivity
 * @property {string} id - Unique identifier for the activity
 * @property {string|number} auctionId - ID of the auction this activity belongs to
 * @property {string} auctionTitle - Title of the auction
 * @property {string} bidderName - Name of the person who performed the activity
 * @property {number} amount - Amount involved in the activity (for bids)
 * @property {number} timestamp - Timestamp of when the activity occurred
 * @property {string} type - Type of activity (bid, join, leave, etc.)
 * @property {string} message - Message describing the activity
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category
 * @property {string} name - Display name of the category
 * @property {string} color - CSS gradient color classes for the category
 */

/**
 * @typedef {Object} SortOption
 * @property {string} id - Unique identifier for the sort option
 * @property {string} name - Display name of the sort option
 */

/**
 * @typedef {Object} RealtimeAuctionData
 * @property {Object} metadata - Auction metadata from Firebase
 * @property {Array} bids - Array of bids from Firebase
 * @property {Array} participants - Array of participants from Firebase
 * @property {Array} activity - Array of activities from Firebase
 * @property {boolean} isConnected - Whether Firebase connection is active
 * @property {boolean} isLoading - Whether data is still loading
 * @property {string|null} error - Error message if any
 */

// Export empty object since this is just for JSDoc type definitions
export {};
