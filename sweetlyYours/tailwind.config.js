/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      maroon: {
        800: "#981638",
        900: "#701127"

      },
      yellow: {
        500: "#FFFACD",
        600: "#FFF44F",
        700: "#FFD700",
        800: "#FFBF00",
        900: "#B8860B"

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
       black30: 'rgba(0,0,0,0.3)',
      },
       black30: 'rgba(0,0,0,0.3)',
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

      }
    },
    extend: {
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-25%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        slideInLeft: 'slideInLeft 0.3s ease-in-out backwards', 
    },
  },
},
  plugins: [],
};
