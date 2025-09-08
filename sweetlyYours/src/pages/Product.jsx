import React, { useState, useEffect } from "react";
import { productEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegUserCircle } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { BiShoppingBag } from "react-icons/bi";
import { MdCardGiftcard } from "react-icons/md";
import delivery from "../assets/Logo/delivery.svg";
import shop from "../assets/Logo/shop.svg";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

const Product = () => {
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { productId } = useParams();

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiConnector(
        "GET",
        `${productEndpoints.GET_ONE_PRODUCT_API}/${productId}`
      );

      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        setError("Failed to fetch product details.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading product details...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  // Product Not Found
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-black-700 text-lg">
        Product not found
      </div>
    );
  }

  return (
    
     <div className="">
      {/* === Top Product Card === */}
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="bg-pink-50 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* LEFT: Product Image */}
          <motion.img
            src={product.images?.[0] || "https://picsum.photos/300"}
            alt={product.name}
            className="w-60 h-60 object-cover rounded-xl shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />

          {/* RIGHT: Product Details */}
          <div className="flex flex-col space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-black-700 uppercase">
              {product.name}
            </h1>

            <p className="text-black-700 text-sm md:text-base">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <span className="text-2xl font-semibold text-maroon-900">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="line-through text-black-800">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <p
              className={`font-medium ${
                product.stock > 0 ? "text-[#16A34A]" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {/* Add to Box Button */}
            <motion.button
              className="bg-maroon-900 hover:bg-maroon-800 text-white-500 font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300 w-fit mx-auto md:mx-0 gap-2 flex flex-row items-center justify-center"
              disabled={product.stock === 0}
              whileTap={{ scale: 0.95 }}
            >
              <IoMdAdd className="text-lg" />
              {product.stock > 0 ? "Add to Box" : "Out of Stock"}
            </motion.button>
          </div>
        </motion.div>

        {/* === Additional Product Details === */}
        <div className="bg-white mt-10 p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-maroon-900 border-b pb-2">
            Product Details
          </h2>

          {/* Shipping Details */}
          <div>
            <h3 className="text-lg font-semibold text-maroon-900">
              Shipping Details
            </h3>
            <p className="text-black-700">{product.shippingDetails}</p>
          </div>

          {/* Long Description */}
          <div>
            <h3 className="text-lg font-semibold text-maroon-900">
              About This Product
            </h3>
            <p className="text-black-700">{product.longDescription}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-maroon-900">
              Ingredients
            </h3>
            <ul className="list-disc list-inside text-black-700">
              {product.ingredients && product.ingredients.length > 0 ? (
                product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))
              ) : (
                <li>No ingredients listed</li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-maroon-900">
              Instructions
            </h3>
            <p className="text-black-700">{product.instructions}</p>
          </div>

          {/* Expert Tips */}
          <div>
            <h3 className="text-lg font-semibold text-maroon-900">
              Expert Tips
            </h3>
            <p className="text-black-700">{product.expertTips}</p>
          </div>
        </div>
      </div>

      {/* === Horizontal Line === */}
      <div className="mt-8">
        <hr className="border-t-4 border-maroon-900 w-full" />
      </div>

      {/* === Icon Section === */}
      <div className="mt-6 flex justify-center gap-12 flex-wrap">
        {[
          { icon: <FaRegUserCircle size={40} />, label: "My Account" },
          { icon: <FiHeart size={40} />, label: "Favorites" },
          { icon: <BiShoppingBag size={40} />, label: "Shopping Bag" },
          { icon: <MdCardGiftcard size={40} />, label: "Gift Cards" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ scale: 1.2 }}
          >
            <div className="text-maroon-900 transition-shadow duration-300 hover:shadow-[0_0_20px_#800000B3] rounded-full p-2">
              {item.icon}
            </div>
            <span className="mt-2 text-black-700 font-semibold transition-colors duration-300 hover:text-maroon-900 text-lg">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* === Storage & Serving Section === */}
      <motion.div
        className="flex flex-col gap-8 justify-center items-center mt-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h3 className="text-black-500 text-2xl font-bold">Steps</motion.h3>
        <motion.h1 className="text-maroon-900 text-4xl font-bold">
          Storage and Serving
        </motion.h1>

        <motion.div
          className="flex flex-col md:flex-row justify-center items-start gap-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          {/* Storage */}
          <motion.div
            className="flex flex-col gap-6 flex-1 "
            whileHover={{ scale: 1.05 }}
          >
            <img src={delivery} className="w-20 h-20 mx-auto md:mx-0 " />
            <motion.h2 className="font-bold text-black-700 text-4xl text-center md:text-left">
              STORAGE
            </motion.h2>
            <ul className="text-black-700 text-lg space-y-2">
              <li>Cakes ship frozen with dry ice, may thaw in transit</li>
              <li>Do not remove dry ice with bare hands</li>
              <li>
                If not serving immediately, store in the refrigerator for up to 72 hours
              </li>
            </ul>
          </motion.div>

          {/* Serving */}
          <motion.div
            className="flex flex-col gap-6 flex-1"
            whileHover={{ scale: 1.05 }}
          >
            <img src={shop} className="w-20 h-20 mx-auto md:mx-0" />
            <motion.h2 className="font-bold text-black-700 text-4xl text-center md:text-left">
              SERVING
            </motion.h2>
            <ul className="text-black-700 text-lg space-y-2">
              <li>
                <span className="font-bold text-black-500">Step 1:</span> Remove shrink
                wrap and paper collar while cake is still frozen
              </li>
              <li>
                <span className="font-bold text-black-500">Step 2:</span> To serve, leave
                at room temperature for around 3 hours
              </li>
              <li>
                <span className="font-bold text-black-500">Step 3:</span> Wipe your knife
                between cuts to remove crumbs and icing. For extra smooth cuts, run under
                hot water between slices.
              </li>
              <li>
                <span className="font-bold text-black-500">Step 4:</span> Enjoy!
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* === Footer === */}
      <Footer />
    </div>
    
   
    
  );
};

export default Product;
