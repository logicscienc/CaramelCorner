import React from "react";
import logo from "../../assets/Logo/logo.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-maroon-700 text-gray-700 pt-10 pb-6 mt-16 border-t">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* column 1 */}
        <div>
          <img src={logo} />
          <p className="mt-3 text-md leading-relaxed">
            Spreading sweetness across India Fresh, delicious, and made with
            love.
          </p>
        </div>

        {/* column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Trending</h3>
          <ul className="space-y-2 text-md ">
            {["Cakes", "Donuts", "Cupcakes", "Indian Sweets", "Chocolates"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="hover:text-black-700 transition-colors">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* column 3 */}
        <div>
            <h3 className="font-semibold text-lg mb-3">Support</h3>
          <ul className="space-y-2 text-md">
            {["Contact Us", "FAQ", "Track Order", "Return & Refund", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-black-700 transition-colors">{item}</a>
              </li>
            ))}
          </ul> 
        </div>

        {/* column 4 */}
        <div>
             <h3 className="font-semibold text-lg mb-6">Stay Connected</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-black-700 hover:text-pink-800 text-2xl hover: transform transition-transform duration-300 hover:-translate-y-[10px]"><FaInstagram /></a>
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-black-700 hover:text-pink-800 text-2xl hover: transform transition-transform duration-300 hover:-translate-y-[10px]"><FaFacebook /></a>
            <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-black-700 hover:text-pink-800 text-2xl hover: transform transition-transform duration-300 hover:-translate-y-[10px]"><FaTwitter /></a>
            <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="text-black-700 hover:text-pink-800 text-2xl hover: transform transition-transform duration-300 hover:-translate-y-[10px]"><FaYoutube /></a>
          </div>

          {/* Newsletter */}
          <p className="text-sm mb-4">Subscribe & get 10% off 🍭</p>
          <form className="flex" aria-label="Newsletter subscription">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 w-full rounded-l-lg border border-black-600 focus:outline-none focus:ring-2 focus:ring-black-700"
            />
            <button className="bg-black-700 text-white-500 px-4 rounded-r-lg hover:bg-black-800 transition-colors">
              Join
            </button>
          </form>
        </div>
        </div>
       {/* Bottom Line */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t pt-4">
        © {new Date().getFullYear()} Sweetly Yours. Made with ❤ and lots of sugar.
      </div>
    </footer>
  );
};

export default Footer;
