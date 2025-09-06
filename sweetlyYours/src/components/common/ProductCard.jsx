import React, {useState} from 'react'
import {motion} from "framer-motion"
import { FiHeart } from 'react-icons/fi'

const ProductCard = ({product, onAddToWishlist}) => {
     const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      onAddToWishlist(product);
    }
  };
  return (
    <motion.div
  className="relative h-72 rounded-2xl p-3 shadow-lg bg-[#FEF9C3] transition hover:scale-105 hover:shadow-xl hover:cursor-pointer "
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
   whileHover={{
        scale: 1.08,       // Zoom in
        y: -5,             // Lift slightly
        boxShadow: "0px 15px 25px rgba(0,0,0,0.2)", // Enhanced shadow
      }}
      transition={{ duration: 0.3 }}
>
  {/* Wishlist Heart */}
  <button
    onClick={handleWishlistToggle}
    className="absolute top-3 right-3 z-30 p-2 rounded-full bg-[#FFFFFFCC] backdrop-blur-md hover:bg-white-500 transition"
  >
    <FiHeart
      size={24}
      className={isWishlisted ? "fill-[#EF4444] text-[#EF4444]" : "text-black"}
    />
  </button>

  {/* Image Section */}
  <div className="relative overflow-hidden rounded-xl">
    <img
      src={product?.images?.[0] || "https://picsum.photos/200"}
      alt={product?.name || "Product"}
      className="w-full h-48 object-cover rounded-xl z-0"
    />
  </div>

  {/* Glassmorphism Overlay for Name & Price */}
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[85%] 
                  bg-[#FFFFFF33] backdrop-blur-md text-center rounded-xl px-3 py-1 z-20 shadow-lg">
    <h3 className="text-black-500 font-semibold text-lg">{product.name}</h3>
    <p className="text-black-500 font-bold">₹{product.price}</p>
  </div>
</motion.div>

  )
}

export default ProductCard
