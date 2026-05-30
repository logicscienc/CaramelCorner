import React, { useState, useEffect } from 'react'
import { FaTimes } from "react-icons/fa";
import { categories } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";



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
  "Festive Bites": [
    "Diwali Specials",
    "ChristmasSpecials",
    "Eid Specials",
  ],
  "Party Pleasers": [
    "WeddingSpecials",
    "Baby Shower",
    "Birthday",
  ],
  "My Fev": [
    "NorthIndianDesserts",
    "FunAndColourful",
  ],
};

const MobileNavItems = ({ closeDrawer }) => {
   const [subLinks, setSubLinks] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector(
          "GET",
          categories.CATEGORIES_API
        );

        setSubLinks(result.data.categories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSublinks();
  }, []);

  const getDropdown = (parent) => {
    const allowed = parentMenus[parent] || [];

    return subLinks
      .filter((cat) => allowed.includes(cat.name))
      .map((cat) => cat.name);
  };

  return (
    <div className="w-full h-full bg-white">

      {/* Header */}
     <div className="sticky top-0 bg-maroon-900 text-white px-5 py-4 shadow-md flex justify-between items-center">
  <h2 className="font-bold text-xl">
    Dessert Categories
  </h2>

  <button
    onClick={closeDrawer}
    className="text-2xl hover:scale-110 transition-all"
  >
    <FaTimes />
  </button>
</div>

      {/* Home */}
      <Link
        to="/"
          onClick={closeDrawer}
        className="block px-5 py-4 border-b font-bold text-black-500 hover:text-maroon-800"
      >
        Home
      </Link>

      {/* Categories */}
      {Object.keys(parentMenus).map((parent, idx) => (
        <div
          key={idx}
          className="border-b border-pink-100"
        >
          <button
            onClick={() =>
              setOpenMenu(
                openMenu === idx ? null : idx
              )
            }
            className="
              w-full
              px-5
              py-4
              flex
              justify-between
              items-center
              text-left
              font-bold
              text-black-500
              hover:text-maroon-800
              transition-all
            "
          >
            <span>{parent}</span>

            {openMenu === idx ? (
              <FaChevronUp />
            ) : (
              <FaChevronDown />
            )}
          </button>

          {openMenu === idx && (
            <div className="bg-pink-50">
              {getDropdown(parent).map(
                (subItem, subIdx) => (
                  <Link
                    key={subIdx}
                    to={`/${subItem}`}

                     onClick={closeDrawer}
                    className="
                      block
                      px-10
                      py-3
                      text-sm
                      font-semibold
                      text-black-500
                      hover:text-maroon-800
                      hover:bg-pink-100
                      transition-all
                    "
                  >
                    {subItem}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      ))}

      {/* Cake Builder */}
      <a
        href="#cake-builder"

          onClick={closeDrawer}
        className="
          block
          px-5
          py-4
          font-bold
          text-black-500
          hover:text-maroon-800
        "
      >
        Cake Builder
      </a>
    </div>
  );
}

export default MobileNavItems;
