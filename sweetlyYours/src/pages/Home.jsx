import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/core/HomePage/Navbar";
import indian from "../assets/Images/indian.jpg";
import download from "../assets/Images/download.jpeg";
import cakeBuffet from "../assets/Images/cake_buffet.jpg";
import pannaCotta from "../assets/Images/panna_cotta.jpg";
import CategorySlider from "../components/core/HomePage/CategorySlider";
import AnimatedButton from "../components/common/AnimatedButton";
import { Link } from "react-router-dom";
import kitchen from "../assets/Images/kitchen.jpg";
import shop from "../assets/Images/shop.jpg";
import order from "../assets/Images/order.jpg";
import enjoy from "../assets/Images/enjoy.jpg";
import parsal from "../assets/Images/parsal.jpg";
import butterfly from "../assets/Images/butterfly.jpg";
import Footer from "../components/common/Footer";
import Favorites from "../components/core/HomePage/Favorites";
import WhyChooseUs from "../components/core/HomePage/WhyChooseUs";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const images = [
    { src: indian, text: "Indian" },
    { src: cakeBuffet, text: "Western" },
    { src: pannaCotta, text: "Global" },
  ];

  const OrderFlow = [
    { src: order, text: "STEP 1" },
    { src: parsal, text: "STEP 2" },
    { src: enjoy, text: "STEP 3 ENJOY" },
  ];

  const handleRegister = () => {
    setIsLoggedIn(true);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      {/* Section 1 Navbar */}
      {/* <Navbar /> */}

      
      {/* Section 2 */}
      <div className="flex flex-row w-full h-[500px] ">
        {/* image 1 */}

          <motion.div
    className="relative w-[40%]"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <img
      src={download}
      alt="Blueberry Dessert"
      className="w-full h-full object-cover"
    />
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }} // appears after image
    >
      <h2 className="text-white-500 text-4xl">
        <span className="font-extrabold font-serif text-white-500">
          Blueberry
        </span>{" "}
        <span className="italic font-light">is Love</span>
      </h2>
    </motion.div>
  </motion.div>
        {/* image 2 */}
        <div className="relative w-[60%]">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].text}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <h2 className="text-white text-4xl font-bold animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">
              {images[currentIndex].text}
            </h2>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <CategorySlider />

      {/* Section 4 */}
      <div className="flex flex-col text-center gap-4 mt-16">
        <motion.div
          className="text-4xl font-sans md:font-serif"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.7 }}
        >
          Every <span className="text-maroon-800 font-semibold">Bite</span>{" "}
          takes you home
        </motion.div>
        <div className="text-4xl font-sans md:font-serif ">
          FREE SHIPPING ON ORDERS OVER $99 with Coupon{" "}
          <span className="text-maroon-800 font-semibold">"FREESHIPPING"</span>{" "}
        </div>
        <div className="text-4xl font-sans md:font-serif ">
          it's Okey TO Have More Love.....
        </div>
        <div className="">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/signup" onClick={handleRegister}>
              <AnimatedButton>Sign Up</AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Section 5 */}
      <div className="flex flex-row gap-8 items-start mt-16 mx-8 lg:mx-16">
        {/* left side */}
        <div className="flex flex-col gap-3 w-1/2">
          <h1 className="text-4xl font-sans md:font-serif ">
            From Our{" "}
            <span className="text-maroon-800 font-semibold">Heart</span> to
            Yours
          </h1>
          <p className="font-sans md:font-serif text-lg">
            At{" "}
            <span className="text-maroon-800 font-semibold">
              Sweetley Yours
            </span>
            , we believe every moment deserves a sweet touch. From traditional
            Indian sweets to Western cakes and pastries, and even Continental
            delicacies, our kitchen crafts desserts that delight every palate.
            Every creation is made with love, care, and the finest ingredients,
            turning your celebrations into unforgettable memories.
          </p>
          <p className="font-sans md:font-serif text-lg">
            Whether it’s a festive gathering, a birthday, or just a treat for
            yourself, our desserts are Sweetley Yours—personalized, handcrafted,
            and designed to bring joy. With every bite, we promise flavor,
            quality, and a little magic that makes your special moments even
            sweeter.
          </p>
        </div>

        {/* right side */}
        <div className="flex flex-col gap-4 w-1/2">
          <motion.img
            src={kitchen}
            className="w-full h-60 object-cover rounded-lg"
            whileHover={{ scale: 1.08 }}
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8 }}
          />

          <motion.img
            src={shop}
            className="w-full h-60 object-cover rounded-lg"
            whileHover={{ scale: 1.08 }}
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Section 6 */}

      <div className="flex flex-col text-center gap-3 mt-20">
        <motion.h1
          className="text-6xl font-bold text-maroon-800 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          Fall Favorites
        </motion.h1>
        <h3 className="text-maroon-900 text-lg font-bold">
          Customers top picks for the season
        </h3>
        <div>
          <Favorites />
        </div>
      </div>

      {/* Section 7 */}
      <div className="flex flex-row w-full h-[500px] mt-4 ">
        {" "}
        {/* left section */}{" "}
        <div className="relative w-[40%]">
          {" "}
          <img
            src={butterfly}
            alt="Build your own cake"
            className="w-full h-full object-cover "
          />{" "}
          <div className="absolute inset-0 flex flex-col items-start bg-black/40">
            {" "}
            <h2 className="text-maroon-800 text-6xl mt-52 ml-6">
              {" "}
              <span className="italic font-light text-maroon-800 animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">
                {" "}
                Build your{" "}
              </span>{" "}
              <br />{" "}
              <span className="italic font-light animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">
                {" "}
                own CAKE{" "}
              </span>{" "}
            </h2>{" "}
          </div>{" "}
        </div>{" "}
        {/* right section */}{" "}
        <div className="relative w-[60%]">
          {" "}
          <img
            src={OrderFlow[currentIndex].src}
            alt={OrderFlow[currentIndex].text}
            className="w-full h-full object-cover transition-all duration-500"
          />{" "}
          <div className="absolute inset-0 flex items-end justify-end bg-black/40 mb-20 mr-6">
            {" "}
            <h2 className="text-black-500 text-6xl italic font-light animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">
              {" "}
              {OrderFlow[currentIndex].text}{" "}
            </h2>{" "}
          </div>{" "}
        </div>{" "}
      </div>

      {/* Section 8 */}
      <WhyChooseUs />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
