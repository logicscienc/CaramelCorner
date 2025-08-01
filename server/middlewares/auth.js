const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async (req, res, next) => {
    try{
        // extract token
         const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");

        //  if token missing, then retuen response
         if(!token) {
            return res.status(401).json({
                success:false,
                message: 'Token is missing',
            });
        }

          // verify the token
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded);
            req.user = decoded;
        }
        catch(error) {
            // verification issue
            return res.status(401).json({
                success:false,
                message: 'token is invalid or expired',
            });

        }
        next();

    }
    catch(error)
    {
        return res.status(401).json({
            success:false,
            message: 'Something went wrong while validating the token',
        });

    }
}

// isCustomer

exports.isCustomer = async (req, res, next) => {
     try{
        if(req.user.role !== "Customer") {
            return res.status(401).json({
                success:false,
                message: "This is a protected route for customer only",
            });
        }
        next();

    }
    catch(error) 
    {
        return res.status(500).json({
            success:false,
            message: "User role cannot be verified, please try again"
        })

    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message: "This is a protected route for Admin only",
            });
        }
        next();

    }
    catch(error) 
    {
        return res.status(500).json({
            success:false,
            message: "User role cannot be verified, please try again"
        })

    }
}