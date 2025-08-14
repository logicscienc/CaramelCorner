const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")

// importing Product controller function
const {createProduct, updateProduct, getAllProduct, getOneProduct , getFeaturedProducts, getRelatedProducts} = require("../controllers/Product");

// importing Review controller function
const {addReview, getProductReviews, deleteReview} = require("../controllers/Review");

// importing Wishlist controller function
const {addToWishlist, getWishlist, removeFromWishlist} = require("../controllers/Wishlist");

// import Category controller function
const {createCategory, updateCategory, getAllCategories, getOneCategory} = require("../controllers/Category");

// Product routes
// createProduct
router.post("/createProduct", auth, createProduct);
// updateProduct
router.put("/updateProduct", auth, updateProduct);
// getAllProduct
router.get("/getAllProduct", getAllProduct);
// getOneProduct
router.get("/getOneProduct", getOneProduct);
// getFeaturedProducts
router.get("/getFeaturedProducts", getFeaturedProducts);
// getRelatedProducts
router.get("/getRelatedProducts", getRelatedProducts);


// Review routes
// addReview
router.post("/addReview", auth, addReview);
// getProductReviews
router.get("/getProductReviews", getProductReviews);
// deleteReview
router.delete("/deleteReview", auth, deleteReview);

// Wishlist routes
// addToWishlist
router.post("/addToWishlist", auth, addToWishlist);
// getWishlist
router.get("/getWishlist", auth, getWishlist);
// removeFromWishlist
router.delete("/removeFromWishlist", auth, removeFromWishlist);


// Category routes
// createCategory
router.post("/createCategory", auth, createCategory);
// updateCategory
router.put("/updateCategory/:categoryId", auth, updateCategory);
// getAllCategories
router.get("/getAllCategories", getAllCategories);
// getOneCategory
router.get("/getOneCategory/:categoryId", getOneCategory);

module.exports = router;

