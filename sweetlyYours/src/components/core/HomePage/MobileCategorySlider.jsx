import React, { useEffect, useRef, useState } from "react";
import { categories } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { useNavigate } from "react-router-dom";
import bunny from "../../../assets/Images/bunny.gif";

export default function MobileCategorySlider() {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const runningTimeRef = useRef(null);
  const navigate = useNavigate();

  // stagger animation
  useEffect(() => {
    setVisibleIndex(0);

    const interval = setInterval(() => {
      setVisibleIndex((prev) => prev + 1);
    }, 250);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // progress bar reset
  const resetTimeAnimation = () => {
    if (runningTimeRef.current) {
      runningTimeRef.current.style.transition = "none";
      runningTimeRef.current.style.width = "0%";

      void runningTimeRef.current.offsetWidth;

      runningTimeRef.current.style.transition = "width 7s linear";
      runningTimeRef.current.style.width = "100%";
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    resetTimeAnimation();
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
    resetTimeAnimation();
  };

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await apiConnector(
          "GET",
          categories.CATEGORIES_API
        );

        setSlides(result.data.categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  // auto slide
  useEffect(() => {
    if (!slides.length) return;

    resetTimeAnimation();

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      resetTimeAnimation();
    }, 7000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <img src={bunny} alt="loading" />
      </div>
    );
  }

  const slide = slides[activeIndex];

  return (
    <div className="w-full px-4 py-6">

      {/* Heading */}
      <h2 className="text-3xl font-bold text-maroon-800 text-center mb-4">
        Here You Go...
      </h2>

      {/* Progress */}
      <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mb-5">
        <div
          ref={runningTimeRef}
          className="h-full bg-maroon-800 w-0"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Image */}
        <div className="w-full h-[260px] flex items-center justify-center bg-pink-50">
          <img
            src={slide.image}
            alt={slide.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-5">

          {/* Counter */}
          <div className="text-center text-sm text-gray-500 mb-3">
            {activeIndex + 1} / {slides.length}
          </div>

          {/* Name */}
          <h3
            className={`text-3xl font-bold text-maroon-800 text-center transition-all duration-500
            ${
              visibleIndex >= 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {slide.name}
          </h3>

          {/* Description */}
          <p
            className={`mt-3 text-center text-gray-700 transition-all duration-500
            ${
              visibleIndex >= 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {slide.description}
          </p>

          {/* CTA */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate(`/${slide.name}`)}
              className={`px-6 py-3 rounded-xl bg-maroon-800 text-white font-semibold transition-all duration-500
              ${
                visibleIndex >= 3
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              }
              hover:shadow-glow-pink`}
            >
              See More
            </button>
          </div>

          {/* Arrows */}
          <div className="flex justify-center gap-5 mt-8">
            <button
              onClick={handlePrev}
              className="w-14 h-14 rounded-full bg-maroon-800 text-white text-2xl font-bold hover:scale-110 transition-all"
            >
              ‹
            </button>

            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-full bg-maroon-800 text-white text-2xl font-bold hover:scale-110 transition-all"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
