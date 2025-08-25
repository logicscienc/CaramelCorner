import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  // first for cart if there is any item already in it or not if there is set it as it is and it not set it as empty
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  // total calculated amount in the cart if cart is not empty set is after the calculation and if it is empty set is an 0
  total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  // total items keep the number of items same and 0 if there is nothing
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // here in the below code you will see action.payload what thsi mean here action is simpley an object and .payload coantin the data. all information.
      const product = action.payload;

      // the below code is just to check if that particular product in inside the cart or not. if it is present it will send the index and if not it will send -1, state.cart is an array which stores the product inside it.

      const index = state.cart.findIndex((item) => item._id === product._id);

      if (index >= 0) {
        // if the product is already in the cart, do not modify the quantity
        toast.error("Course already in cart");
        return;
      }

      // if the product is not in the cart, add it to the cart
      state.cart.push(product);
      // Update the total quantity and price
      state.totalItems++;
      state.total += product.price;
      //  update to loacl storage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      // show toast
      toast.success("Product added to cart");
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const index = state.cart.findIndex((item) => item._id === productId);

      if (index >= 0) {
        // if the product is found in the cart, remove it
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1);

        // update to localstorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
        // show toast
        toast.success("Product removed from cart");
      }
    },

    resetCart: (state) => {
        state.cart = []
        state.total = 0
        state.totalItems = 0
        // update to local storage
          localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
  },
})

export const {addToCart, removeFromCart, resetCart} = cartSlice.actions

export default cartSlice.reducer 
