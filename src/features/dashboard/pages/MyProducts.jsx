import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, RefreshCw } from "lucide-react";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";
import { apiClient } from "../../../api/client";

const MyProducts = () => {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.products.getByUser(userProfile?.id);
      setProducts(res.products || []);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.id) fetchProducts();
  }, []);
  console.log(userProfile?.id);
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Package className="w-8 h-8 mr-2 text-primary-600" /> My Products
          </h1>
          <p className="text-gray-600">
            View and manage your product listings.
          </p>
        </div>
        <Button variant="primary" onClick={fetchProducts} disabled={loading}>
          <RefreshCw className="w-5 h-5 mr-2" /> Refresh
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Loading your products...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-4" />
          <div className="mb-2 font-semibold">No products found.</div>
          <div>
            Click the plus button in your dashboard to add your first product!
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center mb-4">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">
                  #{product.serialNumber}
                </span>
                <span className="text-gray-500 text-xs">
                  {product.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {product.title}
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center mb-3">
                <span className="font-semibold text-primary-700 mr-2">
                  {product.quantity}
                </span>
                <span className="text-gray-500">{product.unit}</span>
              </div>
              <div className="flex space-x-2 mb-3">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Product"
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                  ))
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Package className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">Listed by you</span>
                {/* Future: Add edit/delete buttons here */}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
