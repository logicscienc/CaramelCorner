import React, {useState} from 'react';
import topLeftImage from "../../../assets/Logo/topLeftImage.png";
import bottomRightImage from "../../../assets/Logo/bottomRightImage.png";
import AnimatedLogo from './AnimatedLogo';
import { Link } from 'react-router-dom';
import { BsCart } from "react-icons/bs";
import { FcLike } from "react-icons/fc";
import NavItems from './NavItems';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // simulate login success call after backednd success
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // simulate registration success
  const handleRegister = () => {
    setIsLoggedIn(true);
  }

  // handle logout 
  const handleLogout = () => {
    setIsLoggedIn(false);
  }
  return (
    <div>
      <div className='flex flex-col '>
        {/* stickey strip */}
        <div 
        className='w-full h-8 flex items-center justify-center text-black-500 text-sm font-bold relative overflow-hidden'
        style={{
            backgroundImage: `repeating-linear-gradient(
            90deg,
             #981638 0 60px,
          #701127 60px 120px
            )`,
        }}
        >
          {/* Decorative image overlay */}
          <div className="absolute inset-0 flex">
            {/* Repeat stripes with images */}
            {Array.from({ length: Math.ceil(window.innerWidth / 120) }).map((_, i) => (
              <div key={i} className="relative w-[120px] h-full">
                {/* Top-left image */}
                <img
                  src={topLeftImage}
                  alt=""
                  className="absolute top-1 left-1 w-6 h-6 object-contain opacity-80"
                />
                {/* Bottom-right image */}
                <img
                  src={bottomRightImage}
                  alt=""
                  className="absolute bottom-1 right-1 w-6 h-6 object-contain opacity-80"
                />
              </div>
            ))}
          </div>

            <span className='relative z-10 drop-shadow-md'>
             Welcome to <span className="text-white-600 mx-1">Sweetly Yours</span> — Delight in Indian & Western Desserts!
             </span>
         


        </div >
        {/* Logo signup  */}
        <div className='flex flex-row justify-between items-center px-4'>
          <div className='-mt-8'>
           <AnimatedLogo/>

          </div>
          {/* Right side actions */}

          <div className='flex flex-row gap-6 items-center font-bold'>
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="hover:text-maroon-900 flex items-center gap-1">
                  <BsCart /> Cart
                </Link>
                <Link to="/wishlist" className="hover:text-maroon-900 flex items-center gap-1">
                  <FcLike /> Wishlist
                </Link>
                <button onClick={handleLogout} className="hover:text-maroon-900">
                  Log out
                </button>
                <div className="cursor-pointer hover:text-maroon-900">
                  CONSULTATIONS
                </div>
              </>
            ) : (
              <>
                <Link to="/signup" onClick={handleRegister} className='hover:text-maroon-900'>
                  Sign Up
                </Link>
                <Link to="/login" onClick={handleLogin} className='hover:text-maroon-900'>
                  Log in
                </Link>
                <div className="cursor-pointer hover:text-maroon-900">
                  CONSULTATIONS
                </div>
              </>
            )}
          </div>
        </div>

        
        {/* navitems */}
        <div>
          <NavItems/>

        </div>
      </div>
    </div>
  )
}

export default Navbar
