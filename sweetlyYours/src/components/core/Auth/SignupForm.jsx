import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { motion } from "framer-motion";
import macrons from "../../../assets/Images/macrons.jpeg";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState(ACCOUNT_TYPE.CUSTOMER);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const { name, email, phone, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) return;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

const handleSignupSubmit = async (e) => {
  e.preventDefault();

  if (!name || !email || !phone || !password) {
    toast.error("Please fill all the fields");
    return;
  }

  if (phone.length !== 10) {
    toast.error("Phone number must be exactly 10 digits");
    return;
  }

  const signupData = { ...formData, role };
  dispatch(setSignupData(signupData));

  try {
  const result = await dispatch(sendOTP(email, null, "registration"));
  console.log("OTP sent result:", result); // should log { success: true, message: "OTP Send Successfully" }

  if (result.success) {
    console.log("Navigating now...");
    navigate("/verify-email"); //  redirect happens here
  }
} catch (error) {
  console.error(error);
  toast.error("Failed to send OTP. Try again.");
}


  setFormData({ name: "", email: "", phone: "", password: "" });
  setRole(ACCOUNT_TYPE.CUSTOMER);
};



  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 } },
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
      <div className="absolute inset-0 bg-[#00000080]"></div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <motion.div
          className="w-full max-w-lg p-10 rounded-2xl backdrop-blur-md bg-[#FFFFFF1A] shadow-xl border border-[#FFFFFF33]"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-3xl font-bold text-maroon-900">Welcome Sweety</h1>
            <h2 className="text-xl font-medium text-black-700 mt-2">Signup</h2>
          </motion.div>

          <motion.form className="space-y-6" onSubmit={handleSignupSubmit} variants={containerVariants} initial="hidden" animate="visible">
            {/* Name */}
            <motion.div variants={inputVariants}>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleOnChange}
                placeholder="Username"
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

            {/* Phone */}
            <motion.div variants={inputVariants}>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleOnChange}
                placeholder="Phone Number"
                maxLength={10}
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
              <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-0 top-1 cursor-pointer text-black-700 hover:text-white-500">
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </span>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-[#C74B7B] text-white-500 font-semibold py-3 text-lg rounded-xl shadow-lg hover:bg-maroon-900 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign Up
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SignupForm;


