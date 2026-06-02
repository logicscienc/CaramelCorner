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
import { apiConnector } from "../../../services/apiconnector";
import { cartEndpoints } from "../../../services/apis";
import { setCartFromBackend } from "../../../slices/cartSlice";
import { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import MobileNavItems from "./MobileNavItems";
import tongueout from "../../../assets/Logo/tongueout.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth); // Read login state from Redux
  console.log("Navbar token:", token);
  const { totalItems } = useSelector((state) => state.cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        console.log("Fetching cart for Navbar badge...");

        const response = await apiConnector(
          "GET",
          cartEndpoints.GET_CART_API,
          null,
          { Authorization: `Bearer ${token}` },
        );

        console.log("Navbar cart response:", response.data);

        if (response.data.success) {
          const backendCart = response.data.cart;

          // Map backend cart format
          const mappedCart = backendCart.items.map((item) => ({
            ...item.productId,
            qty: item.quantity,
          }));

          const totalItems = mappedCart.reduce(
            (acc, item) => acc + item.qty,
            0,
          );
          const total = mappedCart.reduce(
            (acc, item) => acc + item.price * item.qty,
            0,
          );

          dispatch(
            setCartFromBackend({
              cart: mappedCart,
              total,
              totalItems,
            }),
          );
        }
      } catch (err) {
        console.error(
          "Error fetching cart in Navbar:",
          err.response?.data || err.message,
        );
      }
    };

    fetchCart();
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    // for mobile
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-col">
        {/* Sticky top strip */}
        <div
          className="w-full h-8 flex items-center justify-center text-black-500 text-xs sm:text-sm font-bold relative overflow-hidden"
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
                    className="absolute top-1 left-1 w-4 sm:w-6 h-4 sm:h-6 object-contain opacity-80"
                  />
                  <img
                    src={bottomRightImage}
                    alt=""
                    className="absolute bottom-1 right-1 w-4 sm:w-6 h-4 sm:h-6  object-contain opacity-80"
                  />
                </div>
              ),
            )}
          </div>
          <span className="relative z-10 drop-shadow-md text-[10px] sm:text-sm">
            Welcome to{" "}
            <span className="text-white-600 mx-1">Sweetly Yours</span> — Delight
            in Indian & Western Desserts!
          </span>
        </div>

        {/* Logo & navigation */}
        <div className="sticky top-0 z-50 bg-white-500 shadow-md">
          <div className="flex flex-row justify-between items-center px-4 py-2 gap-6">
            {/* Logo */}
            <div className="-mt-4">
              <AnimatedLogo />
            </div>

            {/* Search bar */}
            <div className="hidden md:flex flex-1 justify-center">
              <SearchBar />
            </div>

            {/* Right side actions for desktop */}
            <div className="hidden md:flex flex-row gap-6 items-center font-bold">
              {token ? (
                <>
                  <Link
                    to="/cart"
                    className="relative hover:text-maroon-900 flex items-center gap-1 text-3xl"
                  >
                    <BsCart />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 z-50 bg-[#DC2626] text-white-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/wishlist"
                    className="hover:text-maroon-900 flex items-center gap-1 text-3xl"
                  >
                    <FcLike />
                  </Link>
                  <div className="relative group">
                    <button className="hover:text-maroon-900  text-3xl">
                      {user?.name || <FaRegUserCircle />}
                    </button>
                    {/* Dropdown for logout */}
                    <div className="absolute right-0 mt-2 w-32 bg-white-500 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:text-maroon-900"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex flex-row gap-6 items-center font-bold">
                  <AnimatedButton to="/signup">Sign Up</AnimatedButton>
                  <AnimatedButton to="/login">Log in</AnimatedButton>
                </div>
              )}
              <div className="cursor-pointer hover:text-maroon-900">
                CONSULTATIONS
              </div>
            </div>

           
            {/* Mobile Icons */}
            <div className="md:hidden flex flex-col items-center gap-3">
              {/* Burger Icon */}
              <div
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="text-maroon-900 transition-all duration-300 hover:shadow-[0_0_20px_#800000B3] rounded-full p-2">
                  {mobileMenuOpen ? (
                    <FaTimes size={28} />
                  ) : (
                    <FaBars size={28} />
                  )}
                </div>
              </div>

              {/* Dessert Categories Icon */}
              <div
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="transition-all duration-300 hover:shadow-[0_0_20px_#800000B3] rounded-full p-2">
                 <img
  src={tongueout}
  alt="Dessert Menu"
  className="w-10 h-10 object-contain"
  style={{
    filter:
      "brightness(0) saturate(100%) invert(14%) sepia(40%) saturate(2276%) hue-rotate(325deg) brightness(95%) contrast(95%)",
  }}
/>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block border-t">
            <NavItems />
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden  bg-white shadow-lg">
              <div className="flex flex-col items-start px-4 py-2 gap-3">
                {/* Search Bar */}
                <div className="w-full sm:hidden  hidden  sm:block">
                  <SearchBar />
                </div>

                {token ? (
                  <>
                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <BsCart className="text-xl" /> Cart ({totalItems})
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <FcLike className="text-xl" /> Wishlist
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <FaRegUserCircle className="text-xl" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col  gap-3">
                    {/* Use AnimatedButton instead of plain text */}
                    <AnimatedButton
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </AnimatedButton>
                    <AnimatedButton
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log In
                    </AnimatedButton>
                  </div>
                )}

                <div
                  onClick={() => setMobileMenuOpen(false)}
                  className="mb-3 cursor-pointer hover:text-maroon-900"
                >
                  CONSULTATIONS
                </div>
              </div>
            </div>
          )}


  {categoryMenuOpen && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/50 z-[998]"
      onClick={() => setCategoryMenuOpen(false)}
    />

    {/* Drawer */}
    <div
    style={{ backgroundColor: "#fff" }}
      className="
        fixed
        top-0
        right-0
        h-screen
        w-[85%]
        max-w-[350px]
        bg-white
        opacity-100
        z-[999]
        shadow-2xl
        overflow-y-auto

      
      "
    >
      <MobileNavItems
        closeDrawer={() => setCategoryMenuOpen(false)}
      />
    </div>
  </>
)}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
