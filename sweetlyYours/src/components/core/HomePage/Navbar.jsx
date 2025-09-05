import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../services/operations/authAPI";
import topLeftImage from "../../../assets/Logo/topLeftImage.png";
import bottomRightImage from "../../../assets/Logo/bottomRightImage.png";
import AnimatedLogo from "./AnimatedLogo";
import AnimatedButton from "../../common/AnimatedButton";
import NavItems from "./NavItems";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth); // Read login state from Redux

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="relative">
      <div className="flex flex-col">
        {/* Sticky top strip */}
        <div
          className="w-full h-8 flex items-center justify-center text-black-500 text-sm font-bold relative overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              #981638 0 60px,
              #701127 60px 120px
            )`,
          }}
        >
          <div className="absolute inset-0 flex">
            {Array.from({ length: Math.ceil(window.innerWidth / 120) }).map(
              (_, i) => (
                <div key={i} className="relative w-[120px] h-full">
                  <img
                    src={topLeftImage}
                    alt=""
                    className="absolute top-1 left-1 w-6 h-6 object-contain opacity-80"
                  />
                  <img
                    src={bottomRightImage}
                    alt=""
                    className="absolute bottom-1 right-1 w-6 h-6 object-contain opacity-80"
                  />
                </div>
              )
            )}
          </div>
          <span className="relative z-10 drop-shadow-md">
            Welcome to{" "}
            <span className="text-white-600 mx-1">Sweetly Yours</span> — Delight
            in Indian & Western Desserts!
          </span>
        </div>

        {/* Logo & navigation */}
        <div className="sticky top-0 z-50 bg-white-500 shadow-md">
          <div className="flex flex-row justify-between items-center px-4 gap-6">
            {/* Logo */}
            <div className="-mt-8">
              <AnimatedLogo />
            </div>

            {/* Search bar */}
            <div className="flex-1 flex justify-center">
              <SearchBar />
            </div>

            {/* Right side actions */}
            <div className="flex flex-row gap-6 items-center font-bold">
              {token ? (
                <>
                  <Link
                    to="/cart"
                    className="hover:text-maroon-900 flex items-center gap-1"
                  >
                    <BsCart />
                  </Link>
                  <Link
                    to="/wishlist"
                    className="hover:text-maroon-900 flex items-center gap-1"
                  >
                    <FcLike />
                  </Link>
                  <div className="relative group">
                    <button className="hover:text-maroon-900">
                      {user?.name || "Profile"}
                    </button>
                    {/* Dropdown for logout */}
                    <div className="absolute right-0 mt-2 w-32 bg-white-500 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-black-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AnimatedButton to="/signup">Sign Up</AnimatedButton>
                  <AnimatedButton to="/login">Log in</AnimatedButton>
                </>
              )}
              <div className="cursor-pointer hover:text-maroon-900">
                CONSULTATIONS
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <NavItems />
      </div>
    </div>
  );
};

export default Navbar;
