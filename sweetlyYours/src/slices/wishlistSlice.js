import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// --- Initial State ---
const initialState = {
  wishlist: (() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  })(),
};

// --- Helper Function to Save to Local Storage ---
const saveToLocalStorage = (wishlist) => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

// --- Wishlist Slice ---
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Load wishlist from backend
    setWishlistFromBackend: (state, action) => {
      state.wishlist = action.payload.wishlist || [];
      saveToLocalStorage(state.wishlist);
    },

    // Add a product to wishlist
    addToWishlist: (state, action) => {
      const product = action.payload;

      // Check if product already exists
      const index = state.wishlist.findIndex((item) => item._id === product._id);

      if (index >= 0) {
        toast.error("Product already in wishlist");
        return;
      }

      // Add product
      state.wishlist.push(product);
      saveToLocalStorage(state.wishlist);
      toast.success("Product added to wishlist");
    },

    // Remove a product from wishlist
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const index = state.wishlist.findIndex((item) => item._id === productId);

      if (index >= 0) {
        state.wishlist.splice(index, 1);
        saveToLocalStorage(state.wishlist);
        toast.success("Product removed from wishlist");
      }
    },

    // Clear the entire wishlist
    resetWishlist: (state) => {
      state.wishlist = [];
      localStorage.removeItem("wishlist");
      toast.success("Wishlist cleared");
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  setWishlistFromBackend,
  resetWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
