import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";
import macrons from "../../../assets/Images/macrons.jpeg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData;

  //  Handle input changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //  Handle login submit
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in both fields");
    }

    dispatch(login(email, password, navigate));
  };

  // Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="relative h-[700px] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${macrons})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00000080]"></div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <motion.div
          className="w-full max-w-lg p-10 rounded-2xl backdrop-blur-md bg-[#FFFFFF1A] shadow-xl border border-[#FFFFFF33]"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Headings */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold text-maroon-900">
              Awww, we missed you!!
            </h1>
            <h2 className="text-xl font-medium text-black-700 mt-2">Log in</h2>
          </motion.div>

          {/* Form */}
          <motion.form
            className="space-y-6"
            onSubmit={handleOnSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Email */}
            <motion.div variants={inputVariants}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Email"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  color: "white",
                  outline: "none",
                  boxShadow: "none",
                  paddingBottom: "8px",
                  fontSize: "18px",
                  width: "100%",
                }}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={inputVariants} className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Password"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  color: "white",
                  outline: "none",
                  boxShadow: "none",
                  paddingBottom: "8px",
                  fontSize: "18px",
                  width: "100%",
                  paddingRight: "40px",
                }}
              />

              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1 cursor-pointer text-black-700 hover:text-white-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full bg-[#C74B7B] text-white-500 font-semibold py-3 text-lg rounded-xl shadow-lg hover:bg-maroon-900 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Log in
            </motion.button>
            {/* Forgot Password */}
            <p className="text-center text-black-500 text-sm mt-3">
              Forgot password?{" "}
              <Link
                to="/forgot-password"
                className="text-softpink-100 hover:underline"
              >
                Click here
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
