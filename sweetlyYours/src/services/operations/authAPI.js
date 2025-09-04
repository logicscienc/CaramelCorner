import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

// Send OTP
export function sendOTP(email, navigate, purpose = "registration") {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, { email, purpose });
      toast.success("OTP Sent Successfully");

      dispatch(setLoading(false));
      toast.dismiss(toastId);

      // Return success so component can handle navigation
      return response.data;
    } catch (error) {
      toast.error("Could Not Send OTP");
      dispatch(setLoading(false));
      toast.dismiss(toastId);
      throw error;
    }
  };
}





// Sign Up
export function signUp(name, email, phone, password, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        name,
        email,
        phone,
        role: "Customer",
        password,
        otp,
      });

      console.log("SIGNUP API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Signup Successful");
      navigate("/login");

      dispatch(setLoading(false));
      toast.dismiss(toastId);

      return response.data; // Return success for .then() or await
    } catch (error) {
      console.error("SIGNUP API ERROR:", error);
      toast.error(error.response?.data?.message || "Signup Failed");

      dispatch(setLoading(false));
      toast.dismiss(toastId);

      throw error; // Throw so component can catch
    }
  };
}


// Login
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");

      // Save token to Redux
      dispatch(setToken(response.data.token));

      // Save token to localStorage
      localStorage.setItem("token", JSON.stringify(response.data.token));

      navigate("/");
    } catch (error) {
      console.error("LOGIN API ERROR:", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Logout
export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    toast.success("Logged Out");
    navigate("/");
  };
}

// Request Password Reset Email
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, { email });

      console.log("RESETPASSTOKEN RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.error("RESETPASSTOKEN ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to send reset email");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// Reset Password (NO confirmPassword now)
export function resetPassword(password, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        token,
      });

      console.log("RESETPASSWORD RESPONSE:", response);

      if (response.data.success) {
        toast.success("Password Reset Successfully");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("RESETPASSWORD ERROR:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}
