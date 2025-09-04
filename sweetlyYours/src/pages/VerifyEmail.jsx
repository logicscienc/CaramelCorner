import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OTPInput from "react-otp-input";
import { signUp, sendOTP } from "../services/operations/authAPI";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import bee from "../assets/Images/bee.jpeg";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, signupData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!signupData) return;

    const { role, name, email, phone, password } = signupData;

    // Dispatch signUp and wait for success
    try {
      await dispatch(signUp(name, email, phone, password, otp, navigate));
    } catch (error) {
      toast.error("Signup failed. Please check OTP and try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!signupData?.email) return;
    try {
      await dispatch(sendOTP(signupData.email, null, "registration"));
      toast.success("OTP resent successfully!");
    } catch {
      toast.error("Failed to resend OTP. Try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 },
    },
  };

  return (
    <motion.div
      className="relative h-[700px] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bee})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-[#00000080]"></div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <motion.div
          className="w-[400px] h-[400px] rounded-full backdrop-blur-md bg-[#FFFFFF1A] shadow-2xl border border-[#FFFFFF33] flex flex-col justify-center items-center relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-pink-400 opacity-40"></div>

          <motion.div className="text-center mb-6 z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-2xl font-bold text-white-500">Enter the OTP</h1>
            <p className="text-sm text-black-700 mt-1">A code has been sent to your email</p>
          </motion.div>

          {loading ? (
            <div className="text-center text-white-500">Loading...</div>
          ) : (
            <motion.form onSubmit={handleOnSubmit} className="flex flex-col items-center space-y-6 z-10" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={containerVariants} className="flex justify-center">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="mx-1 text-white">-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-10 h-10 text-center rounded-md bg-transparent border-b-2 border-black-700 text-white-500 text-lg focus:outline-none focus:border-pink-400 transition"
                    />
                  )}
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-32 bg-[#C74B7B] text-white-500 font-semibold py-2 text-md rounded-full shadow-lg hover:bg-maroon-900 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Verify Email
              </motion.button>

              <div className="flex justify-between items-center text-xs text-gray-200 w-full px-4 mt-2">
                <Link to="/login" className="hover:underline">
                  Back to Login
                </Link>
                <button type="button" onClick={handleResendOTP} className="hover:text-pink-400 transition">
                  Resend OTP
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;

