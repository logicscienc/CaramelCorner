import React, { useState, useEffect, useRef } from "react";
import { VscSearch } from "react-icons/vsc";
import { categories } from "../../../services/apis";
import { apiConnector } from "../../../services/apiconnector";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const SearchBar = () => {
  const [subLinks, setSubLinks] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  // fetch categories from backend
  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(result.data.categories || []);
      } catch (error) {
        console.log("Could not fetch the category list", error);
      }
    };
    fetchSublinks();
  }, []);

  // filter suggestions
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
    } else {
      const filtered = subLinks.filter((cat) =>
        cat.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    }
  }, [query, subLinks]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      navigate(`/${suggestions[0].name}`);
      setShowDropdown(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center w-[450px] bg-[#981638]/30 border border-[#981638]/30 rounded-full px-4 py-2 shadow-sm"
    >
      {/* input */}
      <div className="flex items-center justify-center w-10 h-10 bg-[#981638] rounded-full mr-2">
        <VscSearch className="text-white text-2xl" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search desserts..."
        className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-800 rounded-r-full"
      />

      {/* dropdown using portal */}
      {showDropdown &&
        suggestions.length > 0 &&
        createPortal(
          <ul
            ref={dropdownRef}
            className="absolute bg-white-500 shadow-lg rounded-md z-[9999] w-[450px]"
            style={{
              top:
                containerRef.current?.getBoundingClientRect().bottom +
                window.scrollY,
              left: containerRef.current?.getBoundingClientRect().left,
            }}
          >
            {suggestions.map((cat, idx) => (
              <li
                key={idx}
                onClick={() => {
                  navigate(`/${cat.name}`);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 cursor-pointer hover:text-black-500"
              >
                {cat.name}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

export default SearchBar;


