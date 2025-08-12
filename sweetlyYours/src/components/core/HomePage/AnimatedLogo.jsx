import React from 'react';
import { motion } from 'framer-motion';
import logo from "../../../assets/Logo/logo.png";

const AnimatedLogo = () => {
  return (
    <motion.img
      src={logo}
      alt="Sweetly Yours Logo"
      className="h-60 w-60 object-contain drop-shadow-lg"
      // Initial bounce-in effect
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{
        opacity: 1,
        scale: [1, 1.05, 1], // pulse
        rotate: [0, 2, 0], // gentle tilt
      }}
      transition={{
        opacity: { duration: 0.8, ease: "easeOut" },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { type: "spring", stiffness: 200 }
      }}
    />
  );
};

export default AnimatedLogo;
