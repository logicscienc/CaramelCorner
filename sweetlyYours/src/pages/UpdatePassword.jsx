import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import Loading from "../assets/Logo/Loading.mp4";
import bee from "../assets/Images/bee.jpeg";
import { resetPassword } from "../services/operations/authAPI";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { password } = formData; // ✅ Destructure for easy access

  // Handle input changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);

    if (!token) {
      toast.error("Invalid or missing token!");
      return;
    }

    if (!password) {
      toast.error("Password cannot be empty!");
      return;
    }

    dispatch(resetPassword(password, token, navigate));
  };

  // Animation for the container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 },
    },
  };

  // Animation for form elements
  const formItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative h-[700px] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bee})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00000080]"></div>

      {/* Center content */}
      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <motion.div
          className="w-[400px] h-[400px] rounded-full backdrop-blur-md bg-[#FFFFFF1A] shadow-2xl border border-[#FFFFFF33] flex flex-col justify-center items-center relative overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Circular border glow */}
          <div className="absolute inset-0 rounded-full border-4 border-pink-400 opacity-40 pointer-events-none"></div>

          {/* Loading state */}
          {loading && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover -z-10 opacity-40"
            >
              <source src={Loading} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Update password form */}
          {!loading && (
            <motion.form
              onSubmit={handleOnSubmit}
              className="relative z-10 flex flex-col w-[80%] text-center space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Title */}
              <motion.h1
                className="text-xl font-semibold text-white-500"
                variants={formItemVariants}
              >
                Choose New Password
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-sm text-black-500"
                variants={formItemVariants}
              >
                Almost done. Enter your new password and you're all set.
              </motion.p>

              {/* Password Input with Eye Icon */}
              <motion.div className="relative" variants={formItemVariants}>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="Enter New Password"
                  className="w-full px-3 py-2 rounded-lg text-black-500 focus:outline-none border border-black-700"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 cursor-pointer"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={24} fill="#555" />
                  ) : (
                    <AiOutlineEye fontSize={24} fill="#555" />
                  )}
                </span>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="mt-2 w-full rounded-lg bg-hover:text-[#FACC15] text-black-500 font-medium py-2 hover:text-[#FDE047] transition"
                variants={formItemVariants}
              >
                Reset Password
              </motion.button>

              {/* Back to Login */}
              <motion.div
                className="mt-4 flex justify-center"
                variants={formItemVariants}
              >
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white-500 hover:text-[#FACC15]"
                >
                  <BiArrowBack /> Back To Login
                </Link>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UpdatePassword;

