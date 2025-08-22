import React, { useState, useEffect } from "react";
import { categories } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { Link, useLocation, matchPath } from "react-router-dom";


// 🔹 Your parent menus definition
const parentMenus = {
  "Treat Yourself": [
    "NorthIndianDesserts",
    "EastIndianDesserts",
    "WestIndianDesserts",
    "SouthIndianDesserts",
    "Cakes",
    "Cupcakes",
    "Brownies",
    "Donuts",
  ],
  "Royal Indian": [
    "NorthIndianDesserts",
    "EastIndianDesserts",
    "WestIndianDesserts",
    "SouthIndianDesserts",
  ],
  "Classic Western": [
    "Cakes",
    "Cupcakes",
    "Brownies",
    "Donuts",
    "Truffles",
    "IceCreams",
  ],
  "World Bites": [
    "French Desserts",
    "Italian Desserts",
    "MiddleEast Desserts",
    "Japanese Desserts",
  ],
  "Tiny Tummies": ["FunAndColourful", "ChilledTreats"],
  "Best Picks": [
    "NorthIndianDesserts",
    "Brownies",
    "WestIndianDesserts",
    "Italian Desserts",
  ],
  "Festive Bites": ["Diwali Specials", "ChristmasSpecials", "Eid Specials"],
  "Party Pleasers": ["WeddingSpecials", "Baby Shower", "Birthday"],
  "My Fev": ["NorthIndianDesserts", "FunAndColourful"],
};

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [subLinks, setSubLinks] = useState([]);
  const location = useLocation();

  // fetch categories from backend
  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        console.log("Printing sublink result", result);
        // store backend categories
        setSubLinks(result.data.categories);
      } catch (error) {
        console.log("Could not fetch the category list", error);
      }
    };
    fetchSublinks();
  }, []);

  // check if the current route matches
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  // get dropdown children for parent
 const getDropdown = (parent) => {
  const allowed = parentMenus[parent] || [];
  if (!subLinks || !Array.isArray(subLinks)) return [];   // guard
  return subLinks
    .filter((cat) => allowed.includes(cat.name))
    .map((cat) => cat.name);
};


  return (
    <nav className="w-full flex justify-center mt-6 relative z-50">
      <ul className="flex text-black-500 rounded-t-md max-w-[100%] w-full">
        {/* 🔹 Home link */}
        <li className="relative flex-1 text-center uppercase tracking-wide">
          <Link
            to="/"
            className={`py-4 block text-lg font-bold transition-all duration-200 ${
              matchRoute("/") ? "text-maroon-800" : "text-black-500 hover:text-maroon-800"
            }`}
          >
            Home
          </Link>
        </li>

        {/* 🔹 Dropdown Parents */}
        {Object.keys(parentMenus).map((parent, idx) => (
          <li
            key={idx}
            className="relative flex-1 text-center uppercase tracking-wide cursor-pointer"
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="py-4 text-lg font-bold transition-all duration-200 text-black-500 hover:text-maroon-800">
              {parent}
              
            </div>

            {/* Dropdown */}
            {activeIndex === idx && (
              <ul className="absolute top-full left-0 w-fit bg-pink-50 backdrop-blur-sm text-black-600 rounded-b-md shadow-md py-3">
                {getDropdown(parent).map((subItem, subIdx) => (
                  <li
                    key={subIdx}
                    className={`px-4 py-2 font-bold animate-slideInLeft ${
                      matchRoute(`/${subItem}`)
                        ? "text-maroon-800"
                        : "hover:text-maroon-800"
                    }`}
                    style={{ animationDelay: `${0.1 + subIdx * 0.03}s` }}
                  >
                    <Link to={`/${subItem}`}>{subItem}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {/* 🔹 Cake Builder */}
        <li className="relative flex-1 text-center uppercase tracking-wide">
          <a
            href="#cake-builder"
            className={`py-4 block text-lg font-bold transition-all duration-200 ${
              location.hash === "#cake-builder"
                ? "text-maroon-800"
                : "text-black-500 hover:text-maroon-800"
            }`}
          >
            Cake Builder
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavItems;

