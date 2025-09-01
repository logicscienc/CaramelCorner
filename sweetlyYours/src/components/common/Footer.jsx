import React from "react";
import logo from "../../assets/Logo/logo.png";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import footer from "../../assets/Logo/footer.mp4";

const Footer = () => {
  return (
     <footer className="relative text-white-600 pt-10 pb-6 mt-16 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src={footer} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

     
      {/* Footer Content */}
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 relative z-10">
        {/* column 1 */}
        <div>
          <img src={logo} alt="Sweetly Yours Logo" />
          <p className="mt-3 text-md leading-relaxed">
            Spreading sweetness across India — Fresh, delicious, and made with love.
          </p>
        </div>

        {/* column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Trending</h3>
          <ul className="space-y-2 text-md">
            {["Cakes", "Donuts", "Cupcakes", "Indian Sweets", "Chocolates"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="hover:text-black-600 transition-colors">
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
            {[
              "Contact Us",
              "FAQ",
              "Track Order",
              "Return & Refund",
              "Privacy Policy",
            ].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-black-600 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* column 4 */}
        <div>
          <h3 className="font-semibold text-lg mb-6">Stay Connected</h3>
          <div className="flex space-x-4 mb-4">
            <a
              href="#"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-600 hover:text-white-500 text-2xl transition-transform duration-300 hover:-translate-y-2"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-600 hover:text-white-500 text-2xl transition-transform duration-300 hover:-translate-y-2"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-600 hover:text-white-500 text-2xl transition-transform duration-300 hover:-translate-y-2"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-600 hover:text-white-500  text-2xl transition-transform duration-300 hover:-translate-y-2"
            >
              <FaYoutube />
            </a>
          </div>

          {/* Newsletter */}
          <p className="text-sm mb-4">Subscribe & get 10% off 🍭</p>
          <form className="flex" aria-label="Newsletter subscription">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 w-full rounded-l-lg border border-maroon-800 focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
            <button className="bg-maroon-900 text-white-500 px-4 rounded-r-lg hover:bg-maroon-800 transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="relative text-center text-sm text-white-500 mt-10 border-t border-black-500 pt-4">
        © {new Date().getFullYear()} Sweetly Yours. Made with ❤ and lots of sugar.
      </div>
    </footer>
  );
};

export default Footer;
