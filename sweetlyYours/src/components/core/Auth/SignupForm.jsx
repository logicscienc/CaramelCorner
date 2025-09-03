import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import macrons from "../../../assets/Images/macrons.jpeg";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.CUSTOMER);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    
  });

  const { name, email, phone, password } = formData;

  const [showPassword, setShowPassword] = useState(false);
 

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password ) {
      toast.error("Please fill all the fields");
      return;
    }

    

    const signupData = {
      ...formData,
      accountType,
    };

    dispatch(setSignupData(signupData));
    dispatch(sendOTP(formData.email, navigate));

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      
    });
    setAccountType(ACCOUNT_TYPE.CUSTOMER);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "signup") setIsLogin(false);
  }, []);

  return (
    <div
      className="relative h-[700px] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${macrons})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00000080]"></div>

      <div className="relative z-10 flex justify-center items-center h-full px-4">
        <div className="w-full max-w-lg p-10 rounded-2xl backdrop-blur-md bg-[#FFFFFF1A] shadow-xl border border-[#FFFFFF33]">
          {/* Headings */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-maroon-900">
              Welcome Sweety
            </h1>
            <h2 className="text-xl font-medium text-black-700 mt-2">Signup</h2>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSignupSubmit}>
            <div>
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
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  paddingBottom: "8px",
                  fontSize: "18px",
                  width: "100%",
                }}
              />
            </div>

            <div>
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
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  paddingBottom: "8px",
                  fontSize: "18px",
                  width: "100%",
                }}
              />
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleOnChange}
                placeholder="Phone Number"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #ccc",
                  color: "white",
                  outline: "none",
                  boxShadow: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  paddingBottom: "8px",
                  fontSize: "18px",
                  width: "100%",
                }}
              />
            </div>

            <div className="relative">
              <input
                type="password"
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
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  paddingBottom: "8px",
                  fontSize: "18px",
                  width: "100%",
                  paddingRight: "40px",
                }}
              />

              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1 cursor-pointer text-gray-300 hover:text-white"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-[#C74B7B] text-white font-semibold py-3 text-lg rounded-xl shadow-lg hover:bg-maroon-900 transition duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
