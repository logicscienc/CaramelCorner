import React, { useState, useEffect } from "react";
import { productEndpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Favorites = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${productEndpoints.GET_FEATURED_PRODUCT_API}?limit=6`
        );
        setProducts(response?.data?.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            onClick={() => navigate(`/product/${product.name}`)}
            className="bg-white-500 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl 
                       transition-all duration-300 cursor-pointer group relative"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            {/* Image with hover zoom */}
            <div className="overflow-hidden">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 
                           transition-transform duration-500"
              />
            </div>

            {/* Details */}
            <div className="p-5 text-center">
              <h3 className="font-semibold text-lg text-black-700 group-hover:text-maroon-900 transition-colors">
                {product.name}
              </h3>
              <p className="text-black-700 mt-2 group-hover:text-black-600 transition-colors font-bold">
                ₹{product.price}
              </p>
            </div>

            {/* Fancy bottom bar animation */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-maroon-900 
                            group-hover:w-full transition-all duration-500"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;

