import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";
import { apiClient } from "../../../api/client";
const UNITS = ["Kgs", "mounds", "bags", "tons"];

const ProductListingModal = ({ isOpen, onClose, onSuccess }) => {
  const { userProfile } = useAuth();
  const userCategories = userProfile?.businessCategories || [];
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    quantity: "",
    unit: UNITS[0],
    images: [],
    auction_live: false, // Boolean toggle for auction vs marketplace
    // Marketplace fields
    price: "",
    priceType: "fixed",
    // Auction fields
    startingBid: "",
    auctionDuration: "24",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Remove unused userProfile warning by using userProfile for categories dropdown

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    // Convert to base64
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((base64Images) => {
      setForm((prev) => ({ ...prev, images: base64Images }));
    });
  };

  // Validate form
  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = "Category is required.";
    if (!form.title) errs.title = "Product title is required.";
    if (!form.description) errs.description = "Description is required.";
    if (!form.quantity || isNaN(form.quantity))
      errs.quantity = "Quantity must be a number.";
    if (!form.unit) errs.unit = "Unit is required.";
    if (!form.images || form.images.length === 0)
      errs.images = "At least one image is required.";

    // Validate pricing based on auction_live toggle
    if (!form.auction_live) {
      if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
        errs.price = "Valid price is required for marketplace listing.";
      }
    } else {
      if (
        !form.startingBid ||
        isNaN(form.startingBid) ||
        parseFloat(form.startingBid) <= 0
      ) {
        errs.startingBid = "Valid starting bid is required for auction.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await apiClient.products.create(form);
      if (response.success) {
        toast.success("Product listed successfully!");
        onSuccess?.(response);
        onClose();
      } else {
        setErrors({ submit: response.error || "Failed to create product." });
      }
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl lg:max-w-4xl relative my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button for mobile UX */}
        <button
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full text-gray-500 hover:text-primary-700 hover:bg-gray-100 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-primary-700">
          Add Product Listing
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Category and Title - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select category</option>
                {userCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.category}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Premium Basmati Rice"
                className="input-field"
              />
              {errors.title && (
                <div className="text-red-500 text-xs mt-1">{errors.title}</div>
              )}
            </div>
          </div>

          {/* Listing Type Toggle */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Where do you want to list this product?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, auction_live: false }))
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  !form.auction_live
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-2xl">🏪</div>
                  <div className="font-semibold">Marketplace</div>
                  <div className="text-xs text-center">
                    Direct sale with fixed or negotiable price
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, auction_live: true }))
                }
                className={`p-4 rounded-lg border-2 transition-all ${
                  form.auction_live
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="text-2xl">🔨</div>
                  <div className="font-semibold">Auction</div>
                  <div className="text-xs text-center">
                    Let buyers compete with bids
                  </div>
                </div>
              </button>
            </div>
            {form.auction_live && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-500 mt-0.5">ℹ️</div>
                  <div className="text-sm text-blue-700">
                    <strong>Auction Process:</strong> Your product will go live
                    for bidding. If no winner is found after the auction ends,
                    it will automatically move to the marketplace for direct
                    sale.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field"
              rows={3}
              maxLength={500}
              placeholder="Describe your product"
            />
            {errors.description && (
              <div className="text-red-500 text-xs mt-1">
                {errors.description}
              </div>
            )}
          </div>
          {/* Quantity & Unit */}
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="input-field"
                min={1}
                placeholder="e.g. 100"
              />
              {errors.quantity && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.quantity}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="input-field"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <div className="text-red-500 text-xs mt-1">{errors.unit}</div>
              )}
            </div>
          </div>

          {/* Pricing - Conditional based on listing type */}
          {!form.auction_live && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price per {form.unit || "unit"} (PKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price || ""}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  className="input-field"
                />
                {errors.price && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.price}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pricing Type
                </label>
                <select
                  name="priceType"
                  value={form.priceType || "fixed"}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>
          )}

          {form.auction_live && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Starting Bid (PKR)
                </label>
                <input
                  type="number"
                  name="startingBid"
                  value={form.startingBid || ""}
                  onChange={handleChange}
                  placeholder="e.g., 40000"
                  className="input-field"
                />
                {errors.startingBid && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.startingBid}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Auction Duration
                </label>
                <select
                  name="auctionDuration"
                  value={form.auctionDuration || "24"}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="72">72 Hours</option>
                </select>
              </div>
            </div>
          )}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="input-field"
            />
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-3">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-lg border hover:border-primary-500 transition-colors"
                />
              ))}
            </div>
            {errors.images && (
              <div className="text-red-500 text-xs mt-1">{errors.images}</div>
            )}
          </div>
          {/* Error */}
          {errors.submit && (
            <div className="text-red-500 text-sm mb-2">{errors.submit}</div>
          )}
          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {form.auction_live ? "Create Auction" : "List in Marketplace"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductListingModal;
