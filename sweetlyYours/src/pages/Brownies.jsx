import React, { useState, useEffect } from "react";
import { productEndpoints } from "../services/apis";
import { apiConnector } from "../services/apiconnector";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/common/ProductCard";
import { FaRegUserCircle } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { BiShoppingBag } from "react-icons/bi";
import { MdCardGiftcard } from "react-icons/md";
import delivery from "../assets/Logo/delivery.svg";
import shop from "../assets/Logo/shop.svg";
import Footer from "../components/common/Footer";

const Brownies = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `${productEndpoints.GET_ALL_PRODUCT_API}?categoryId=689df50d5af9247fe96567a5`
        );
        setProducts(response?.data?.products || []);
      } catch (error) {
        console.error("Error fetching West Indian products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToWishlist = (product) => {
    if (!wishlist.find((item) => item._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div className="p-6">
      <motion.h1
        className="text-4xl font-bold mb-4 text-center text-maroon-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        Brownies
      </motion.h1>

      {products.length === 0 ? (
        <p className="text-black-700 text-center">
          No products found in this category.
        </p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToWishlist={addToWishlist}
            />
          ))}
        </motion.div>
      )}

      {/* Horizontal line at the bottom */}
      <div className="mt-8">
        <hr className="border-t-4 border-maroon-900 w-full" />
      </div>

      <div className="mt-6 flex justify-center gap-12 flex-wrap">
        {/* Icon Item */}
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

  {/* Content Container */}
  <motion.div
    className="flex flex-col md:flex-row justify-center items-start gap-16 max-w-5xl w-full"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, staggerChildren: 0.2 }}
  >
    {/* Left */}
    <motion.div
      className="flex flex-col gap-6 flex-1"
      whileHover={{ scale: 1.05 }}
    >
      <img src={delivery} className="w-20 h-20 mx-auto md:mx-0" />
      <motion.h2 className="font-bold text-black-700 text-4xl text-center md:text-left">
        STORAGE
      </motion.h2>
      <ul className="text-black-700 text-lg space-y-2">
        <li>Cakes ship frozen with dry ice, may thaw in transit</li>
        <li>Do not remove dry ice with bare hands</li>
        <li>If not serving immediately, store in the refrigerator for up to 72 hours</li>
      </ul>
    </motion.div>

    {/* Right */}
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
    <span className="font-bold text-black-500">Step 1:</span> Remove shrink wrap and paper collar while cake is still frozen
  </li>
  <li>
    <span className="font-bold text-black-500">Step 2:</span> To serve, leave at room temperature for around 3 hours
  </li>
  <li>
    <span className="font-bold text-black-500">Step 3:</span> When serving, be sure to wipe your knife between cuts to remove excess crumbs and icing. For an extra smooth cut, run your knife under hot water between cuts for the perfect slice
  </li>
  <li>
    <span className="font-bold text-black-500">Step 4:</span> Enjoy!
  </li>
</ul>

    </motion.div>
  </motion.div>
</motion.div>
<Footer/>

    </motion.div>
  );
};

export default Brownies;