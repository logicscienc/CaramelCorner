import React from 'react'
import { motion } from "framer-motion";
import { FaLeaf } from 'react-icons/fa'
import { FaClock } from 'react-icons/fa'
import { FaGlobeAmericas } from 'react-icons/fa'
import { FaTruck } from 'react-icons/fa'


const highlights = [
  {
    icon: <FaLeaf className="text-green-800 text-4xl" />,
    title: "100% Pure Veg Delights",
    desc: "Authentic Indian sweets and global desserts, made only with vegetarian ingredients.",
  },
  {
    icon: <FaClock className="text-black-700 text-4xl" />,
    title: "Freshly Made, Daily",
    desc: "Prepared every day with premium-quality ingredients — freshness guaranteed.",
  },
  {
    icon: <FaGlobeAmericas className="text-yellow-800 text-4xl" />,
    title: "Global Taste, Indian Heart",
    desc: "From Gulab Jamun to Cheesecake — enjoy worldwide desserts crafted with love.",
  },
  {
    icon: <FaTruck className="text-blue-800 text-4xl" />,
    title: "Safe & Hassle-Free Delivery",
    desc: "Packed with care and delivered fresh to your doorstep, every single time.",
  },
];

// Motion Variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // stagger delay
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const WhyChooseUs = () => {
  return (
    <section className="py-16 ">
        <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-maroon-900">
          🌟 Why Choose Us
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }} // re-animates on scroll up/down
        >
          {highlights.map((item, index) => (
           <motion.div
  key={index}
  variants={card}
  className={`
    rounded-2xl shadow-md p-8 flex flex-col items-center text-center cursor-pointer
    transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
    ${index % 2 === 0 
      ? "bg-[#C74B7B] hover:bg-maroon-900"   // even cards
      : "bg-[#C74B7B] hover:bg-maroon-800"} // odd cards
  `}
>
              {item.icon}
              <h3 className="text-xl font-semibold mt-4 text-white-500">
                {item.title}
              </h3>
              <p className="text-white-700 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div> 
    </section>
  )
}

export default WhyChooseUs
