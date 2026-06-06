require("dotenv").config();

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Routes

const userRoutes = require("./routes/User");

const productRoutes = require("./routes/Product");

const cartRoutes = require("./routes/Cart");

const orderRoutes = require("./routes/Order");

const paymentRoutes = require("./routes/Payment");

const addressRoutes = require("./routes/Address");

const chatRoutes = require("./routes/Chat");

const PORT = process.env.PORT || 4000;

/* ---------------- DATABASE ---------------- */
database.connect();

/* ---------------- MIDDLEWARES ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- CORS ---------------- */
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://caramel-corner.vercel.app",
// ];

 app.use(
   cors({
     origin: "https://caramel-corner.vercel.app",
     credentials:true,
  })
 )

// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://caramel-corner.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );



/* ---------------- FILE UPLOAD ---------------- */
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  }),
);

/* ---------------- CLOUDINARY ---------------- */
cloudinaryConnect();


/* ---------------- ROUTES ---------------- */
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/chatbot", chatRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
