import React, { useEffect, useRef, useState } from "react";
import { categories } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { useNavigate } from "react-router-dom";
import bunny from "../../../assets/Images/bunny.gif";

export default function CategorySlider() {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const listRef = useRef(null);
  const runningTimeRef = useRef(null);
  const navigate = useNavigate();

  const [visibleIndex, setVisibleIndex] = useState(0);

// Trigger staggered animation whenever active slide changes
useEffect(() => {
  setVisibleIndex(0); // reset animation on slide change
  const interval = setInterval(() => {
    setVisibleIndex((prev) => prev + 1);
  }, 300); // 0.3s per element
  return () => clearInterval(interval);
}, [activeIndex]);


  // Reset progress bar by forcing reflow
  const resetTimeAnimation = () => {
    if (runningTimeRef.current) {
      runningTimeRef.current.style.transition = "none";
      runningTimeRef.current.style.width = "0%";
      void runningTimeRef.current.offsetWidth; // force reflow
      runningTimeRef.current.style.transition = "width 7s linear";
      runningTimeRef.current.style.width = "100%";
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    resetTimeAnimation();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimeAnimation();
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        // const featured = result.data.categories.filter((cat) => cat.isFeatured);
        // setSlides(featured.length > 0 ? featured : result.data.categories);
        const allCategories = result.data.categories;
setSlides(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Auto-slide every 7s
  useEffect(() => {
    if (!slides.length) return;

    resetTimeAnimation(); // initial animation

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      resetTimeAnimation();
    }, 7000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) {
    return (
      <div className="flex items-center justify-center w-full h-96 text-gray-500">
        <img src={bunny} />
      </div>
    );
  }

  return (
    <div className="w-full relative  mb-4">
      <h2 className="text-6xl font-bold text-maroon-800 text-center mt-20 mb-4">
        Here You Go...
      </h2>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-300 mb-6 relative overflow-hidden">
        <div
          ref={runningTimeRef}
          className="absolute top-0 left-0 h-1 bg-maroon-800 w-0"
        ></div>
      </div>

      {/* Slider */}
      <div className="relative w-full h-[800px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
            style={{
              opacity: index === activeIndex ? 1 : 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute top-1/2 left-20 -translate-y-1/2 w-[400px]  z-50">
              <div  className={`text-maroon-800 font-bold text-8xl uppercase transition-all duration-500
      ${visibleIndex >= 1 && index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                SLIDER
              </div>
              <div  className={`font-bold text-8xl uppercase drop-shadow-lg transition-all duration-500 delay-200
      ${visibleIndex >= 2 && index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
                {slide.name}
              </div>
              <div  className={`mt-2 mb-5 text-4lg transition-all duration-500 delay-400
      ${visibleIndex >= 3 && index === activeIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>{slide.description}</div>
              <button
                onClick={() => navigate(`/${slide.name}`)}
                 className={`px-8 py-4 bg-maroon-800 text-white rounded-lg transition-all duration-500 delay-600
      ${visibleIndex >= 4 && index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-90"}
      hover:shadow-glow-pink hover:scale-105 focus:shadow-glow-gold
      `}
              >
                See More
              </button>
            </div>
          </div>
        ))}

        {/* Small next slides cards */}
        <div className="absolute top-[20%] right-10 flex flex-col gap-4 z-50 ">
          {Array.from({ length: 5 }).map((_, i) => {
           let nextIndex = activeIndex + i + 1;
    if (nextIndex >= slides.length) nextIndex -= slides.length;
            const slide = slides[nextIndex];
            return (
              <div
                key={slide._id}
                className="w-40 h-60 rounded-xl shadow-lg bg-white relative"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute bottom-10 left-2 text-sm font-bold text-white drop-shadow-md">
                  {slide.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-50">
          <button
            onClick={handlePrev}
            className="w-20 h-20 rounded-full bg-maroon-800 text-white-500 font-bold text-xl  hover:shadow-glow-gold hover:scale-110 transition-all"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
             className="w-20 h-20 rounded-full bg-maroon-800 text-white-500 font-bold text-xl hover:bg-white-500 hover:text-black-500 transition"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}









