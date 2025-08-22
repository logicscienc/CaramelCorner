import React, {useState, useEffect} from "react";
import Navbar from "../components/core/HomePage/Navbar";
import indian from "../assets/Images/indian.jpg";
import download from "../assets/Images/download.jpeg";
import cakeBuffet from "../assets/Images/cake_buffet.jpg";
import pannaCotta from "../assets/Images/panna_cotta.jpg";
import CategorySlider from "../components/core/HomePage/CategorySlider";
import AnimatedButton from "../components/common/AnimatedButton";
import { Link } from 'react-router-dom';

const Home = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const images = [
    { src: indian, text: "Indian" },
    { src: cakeBuffet, text: "Western" },
    { src: pannaCotta, text: "Global" },
  ];

   const handleRegister = () => {
    setIsLoggedIn(true);
  }

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

        <div className="relative w-[40%]">
          <img
            src={download}
            alt="Blueberry Dessert"
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <h2 className="text-white-500 text-4xl">
              <span className="font-extrabold font-serif text-white-500 animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">
                Blueberry
              </span>{" "}
              <span className="italic font-light animate-[fadeIn_1s_ease-in-out_0.3s_forwards]">is Love</span>
            </h2>
          </div>
        </div>
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
      <CategorySlider/>


      {/* Section 4 */}
      <div className="flex flex-col text-center gap-4 mt-16">
        <div className="text-4xl font-sans md:font-serif ">Every <span className="text-maroon-800 font-semibold">Bite</span> takes you home</div>
        <div className="text-4xl font-sans md:font-serif ">FREE SHIPPING ON ORDERS OVER $99 with Coupon <span className="text-maroon-800 font-semibold">"FREESHIPPING"</span> </div>
        <div className="text-4xl font-sans md:font-serif ">it's Okey TO Have More Love.....</div>
        <div className=""><Link to="/signup" onClick={handleRegister} >
                <AnimatedButton>Sign Up</AnimatedButton>
                </Link></div>
      </div>

      {/* Section 5 */}
      <div>
        {/* left side */}
        <div>
          <h1>From Our Heart to Yours</h1>
          <p>At Sweetley Yours, we believe every moment deserves a sweet touch. From traditional Indian sweets to Western cakes and pastries, and even Continental delicacies, our kitchen crafts desserts that delight every palate. Every creation is made with love, care, and the finest ingredients, turning your celebrations into unforgettable memories.</p>
          <p>Whether it’s a festive gathering, a birthday, or just a treat for yourself, our desserts are Sweetley Yours—personalized, handcrafted, and designed to bring joy. With every bite, we promise flavor, quality, and a little magic that makes your special moments even sweeter.</p>

        </div>
        {/* right side */}
        <div>

        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default Home;
