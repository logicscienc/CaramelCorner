import React, {useState, useEffect} from "react";
import Navbar from "../components/core/HomePage/Navbar";
import indian from "../assets/Images/indian.jpg";
import download from "../assets/Images/download.jpeg";
import cakeBuffet from "../assets/Images/cake_buffet.jpg";
import pannaCotta from "../assets/Images/panna_cotta.jpg";
import CategorySlider from "../components/core/HomePage/CategorySlider";

const Home = () => {

  const images = [
    { src: indian, text: "Indian" },
    { src: cakeBuffet, text: "Western" },
    { src: pannaCotta, text: "Global" },
  ];

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

      {/* Section 5 */}

      {/* Footer */}
    </div>
  );
};

export default Home;
