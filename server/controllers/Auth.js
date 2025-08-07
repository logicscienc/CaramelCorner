const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request body
    const { email, purpose } = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // Handle based on purpose
    if (purpose === "registration" && checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    if (purpose === "login" && !checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    // check unique otp or not. this is important because lets imagin at the same time multiple users are trying to register at that time we need to make sure that every single person gets different otp. that's why we had used this while loop.
    let result = await OTP.findOne({ otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    await OTP.create({ email, otp, purpose });

    // send OTP via email
    await mailSender(
      email,
      "CaramelCorner -  OTP  Verification",
      `<p>Your OTP for ${purpose} is: <b>${otp}</b></p>
       <p>This OTP is valid for 5 minutes.</p>`
    );

    // return response successful
    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signUp

exports.signUp = async (req, res) => {
  try {
    // data fetch from request body
    const { name, email, phone, role, password, otp } = req.body;

    // Validate if all the info are filled or not.
    if (!name || !email || !phone || !role || !password || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registured ",
      });
    }

    // find most recent OTP stored for the user
    const recentOtp = await OTP.findOne({
      email,
      purpose: "registration",
    }).sort({ createdAt: -1 });

    console.log(recentOtp);
    // validate OTP
    if (!recentOtp) {
      // OTP not found
      return res.status(400).json({
        success: false,
        message: "Otp not Found or expired",
      });
    }

    // OTP expiry check (5 minutes)
    const otpAge = (Date.now() - recentOtp.createdAt) / 1000;
    if (otpAge > 300) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }
    if (otp !== recentOtp.otp) {
      // Invalis Otp
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      role,
      password,
      
    });

    // Delete all OTP records for this email after successful registration
    await OTP.deleteMany({ email });

    // return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registrered. Please try again",
    });
  }
};

// Login with Password

exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // user chaeck exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registured, please signup first",
      });
    }

    // generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      // user.token = token;
      // await user.save();
      user.password = undefined;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

// Login with OTP
exports.loginWithOTP = async (req, res) => {
  try{
    const {email, otp} = req.body;

    // Validate input
    if(!email || !otp){
      return res.status(403).json({
         success: false,
        message: "Email and OTP are required",
      });
    }

    // check if user exists
    const user = await User.findOne({email});
     if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please sign up first",
      });
    }

    // Find the most recent OTP for login
     const recentOtp = await OTP.findOne({ email, purpose: "login" })
      .sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // check expiry after 5 minutes
    const otpAge = (Date.now() - recentOtp.createdAt) / 1000;
    if (otpAge > 300) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check OTP correctness
      if (otp.toString().trim() !== recentOtp.otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid -> generate JWT
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

     const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    user.password = undefined;

    // Delete all OTP entries for this email
     await OTP.deleteMany({ email });
    
     const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Send response
     return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "Logged in successfully with OTP",
    });

  }
  catch(error)
  {
     console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login with OTP failed, please try again",
    });

  }
};

// change Password
exports.changePassword = async (req, res) => {
  try{
    // get data like email, oldPassword and newPassword from request body
    const { oldPassword, newPassword} = req.body;

    // validation
    if( !oldPassword || !newPassword) {
       return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Get userId from req.user
    const userId = req.user.id;

    // find user by ID
     const user = await User.findById( userId );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare old password with stored hashed password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
     if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update pwd in db
    user.password = hashedPassword;
    await user.save();

    // send mail - password updated
     await mailSender(
      user.email,
      "Password Changed Successfully",
      "<h3>Your password has been changed successfully</h3>"
    );

     // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  }
  catch(error){
     console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while changing the password",
    });

  }
}
