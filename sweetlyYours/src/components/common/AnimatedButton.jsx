import React from "react";

const AnimatedButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
    group relative px-6 py-3 rounded-lg font-semibold text-white-500 overflow-hidden
    bg-maroon-700 hover:bg-btn-hover
    transition-all duration-200 transform hover:scale-105
  "
    >
      {/* bubbles container */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="
              absolute bottom-0 w-2 h-2 rounded-full bg-white-500 opacity-0
              group-hover:animate-bubble
            "
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </span>

      {/* button text */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default AnimatedButton;


