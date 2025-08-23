/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      maroon: {
        700: "#9D3C56",
        800: "#981638",
        900: "#701127",
      },
      yellow: {
        500: "#FFFACD",
        600: "#FFF44F",
        700: "#FFD700",
        800: "#FFBF00",
        900: "#B8860B",
      },
      white: {
        500: "#FFFFFF",
        600: "#FFFAFA",
        700: "#FFFFF0",
        800: "#F8F8FF",
        900: "#FFFAF0",
      },
      black: {
        500: "#000000",
        600: "#0A0A0A",
        700: "#1C1C1C",
        800: "#353839",
        900: "#2F4F4F",
        black30: "rgba(0,0,0,0.3)",
      },
      black30: "rgba(0,0,0,0.3)",
      pink: {
        50: "#BE185D4D",
        100: "#FFC0CB",
        200: "#FFB6C1",
        300: "#FF69B4",
        400: "#FF1493",
        500: "#FF00FF",
        600: "#FF66CC",
        700: "#FFA6C9",
        800: "#FADADD",
        900: "#DCAE96",
        1000: "#DE5D83",
      },

      // 💡 Added button colors
      btn: {
        DEFAULT: "#701127" , // maroon-900 for button bg
        text: "#FFFFFF", // white text
        bubble: "#FFFFFF", // white bubbles
        bgOverlay: "#701127",
         hover: "#981638", // maroon-800 overlay for hover effect
      },
       glow: {
        gold: "#FFD700",
        pink: "#FF1493",
        white: "#FFFFFF",
      },
    },
 

    extend: {
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-25%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
       bubble: {
  "0%": { transform: "translateY(0) scale(0.5)", opacity: "0" },
      "20%": { opacity: "1" },
      "100%": { transform: "translateY(-250%) scale(1.2)", opacity: "0" },
},
      },
      animation: {
        slideInLeft: "slideInLeft 0.3s ease-in-out backwards",
         bubble: "bubble 3s ease-in-out infinite",
      },
       boxShadow: {
        "glow-pink": "0 0 15px #FF1493",
        "glow-gold": "0 0 15px #FFD700",
        "glow-white": "0 0 15px #FFFFFF",
      },
    },
  },
  plugins: [],
};
