import React, { useState } from "react";


const navItems = [
  {
    name: "Treat Yourself",
    dropdown: [
      "North Indian",
      "South Indian",
      "East Indian",
      "West Indian",
      "Cakes",
      "Cupcakes",
      "Brownies",
      "Donuts",
    ],
  },
  {
    name: "Royal Indian",
    dropdown: ["North Indian", "South Indian", "East Indian", "West Indian"],
  },
  {
    name: "Classic Western",
    dropdown: [
      "Cakes",
      "Pastry",
      "Cupcakes",
      "Brownies",
      "Donuts",
      "Truffles",
      " pies & Tarts",
      "Ice Creams",
    ],
  },
  {
    name: "World Bites",
    dropdown: [
      "French Desserts ",
      "Italian Desserts",
      "American Desserts",
      "Middle Eastern Desserts",
      "Japanese Desserts ",
    ],
  },
  {
    name: "Tiny Tummies",
    dropdown: [
      "Classic Favorites",
      "Chocolate heaven",
      "Fun & Colorful",
      "Chilled Treats",
    ],
  },
  {
    name: "Best Picks",
    dropdown: ["North Indian", "Brownies", "West Indian", "Italian Desserts"],
  },
  {
    name: "Festive Bites",
    dropdown: [
      "Diwali",
      "Christmas",
      "eid",
      
    ],
  },
  {
    name: "Party Pleasers",
    dropdown: ["Wedding", "Baby Shower", "Birthday"],
  },
  { name: "Cake Builder", dropdown: ["Build Your own  Cake"] },
  { name: "My Fev", dropdown: ["North Indian", "Classic Favorites"] },
];

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  return (
    <nav className="w-full flex justify-center mt-6 relative z-50">
      <ul className="flex  text-black-500 rounded-t-md max-w-[90%] w-full">
        {navItems.map((item, idx) => (
          <li
            key={idx}
            className="relative flex-1 text-center uppercase tracking-wide cursor-pointer "
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="py-4 text-black-500 text-lg font-bold hover:text-maroon-800 transition-all duration-200 "
              >
              {item.name}
            </div>

            {/* Dropdown */}
            {activeIndex === idx && (
              <ul className="absolute top-full left-0 w-fit bg-pink-50 backdrop-blur-sm text-black-600 rounded-b-md shadow-md py-3 ">
                {item.dropdown.map((subItem, subIdx) => (
                  <li
                    key={subIdx}
                    className={`px-4 py-2 font-bold hover:text-maroon-800 animate-slideInLeft`}
                    style={{ animationDelay: `${0.1 + subIdx * 0.03}s` }}
                  >
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavItems;
