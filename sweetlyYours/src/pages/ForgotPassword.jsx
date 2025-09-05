import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { getPasswordResetToken } from "../services/operations/authAPI";
import Loading from "../assets/Logo/Loading.mp4";
import bee from "../assets/Images/bee.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(getPasswordResetToken(email, setEmailSent));
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

      {/* Center container */}
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

          {/* Forgot password form */}
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
                {!emailSent ? "Reset your password" : "Check email"}
              </motion.h1>

              {/* Subtitle / Description */}
              <motion.p
                className="text-sm text-black-700"
                variants={formItemVariants}
              >
                {!emailSent
                  ? "Enter your registered email and we'll send you instructions to reset your password."
                  : `We have sent a reset link to ${email}`}
              </motion.p>

              {/* Email Input */}
              {!emailSent && (
                <motion.input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="px-3 py-2 rounded-lg text-black-500 focus:outline-none border border-black-700"
                  variants={formItemVariants}
                />
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="mt-2 w-full rounded-lg bg-hover:text-[#FACC15] py-2 font-medium text-black-500 hover:bg-yellow-300 transition"
                variants={formItemVariants}
              >
                {!emailSent ? "Submit" : "Resend Email"}
              </motion.button>

              {/* Back to Login */}
              <motion.div
                className="mt-4 flex justify-center"
                variants={formItemVariants}
              >
                <Link to="/login" className="flex items-center gap-2 text-white-500 hover:text-[#FACC15]">
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

export default ForgotPassword;

