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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2 sm:px-0 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-full sm:max-w-lg relative"
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
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Category */}
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
              <div className="text-red-500 text-xs mt-1">{errors.category}</div>
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
              className="input-field"
              maxLength={100}
              placeholder="Enter product title"
            />
            {errors.title && (
              <div className="text-red-500 text-xs mt-1">{errors.title}</div>
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
            <div className="flex space-x-2 mt-2">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border"
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
              Save Listing
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductListingModal;
