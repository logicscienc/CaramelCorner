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
        const featured = result.data.categories.filter((cat) => cat.isFeatured);
        setSlides(featured.length > 0 ? featured : result.data.categories);
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
    <div className="w-full relative">
      <h2 className="text-4xl font-bold text-maroon-800 text-center mt-8 mb-4">
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
      <div className="relative w-full h-[600px] overflow-hidden">
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
            <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[400px] text-white z-50">
              <div className="text-maroon-800 font-bold text-6xl uppercase">
                SLIDER
              </div>
              <div className="font-bold text-6xl uppercase drop-shadow-lg">
                {slide.name}
              </div>
              <div className="mt-2 mb-5 text-lg">{slide.description}</div>
              <button
                onClick={() => navigate(`/${slide.name}`)}
                className="px-6 py-3 bg-maroon-800 text-white rounded-lg"
              >
                See More
              </button>
            </div>
          </div>
        ))}

        {/* Small next slides cards */}
        <div className="absolute top-[20%] right-10 flex flex-col gap-4 z-50">
          {Array.from({ length: 5 }).map((_, i) => {
            const nextIndex = (activeIndex + i + 1) % slides.length;
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
                <div className="absolute bottom-2 left-2 text-sm font-bold text-white drop-shadow-md">
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
            className="w-12 h-12 rounded-full bg-maroon-800 text-white font-bold text-xl hover:bg-white hover:text-black transition"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-maroon-800 text-white font-bold text-xl hover:bg-white hover:text-black transition"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}








