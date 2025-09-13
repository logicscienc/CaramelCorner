import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";



const initialState = {
  cart: (() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  })(),
  total: (() => {
    try {
      return JSON.parse(localStorage.getItem("total")) || 0;
    } catch {
      return 0;
    }
  })(),
  totalItems: (() => {
    try {
      return JSON.parse(localStorage.getItem("totalItems")) || 0;
    } catch {
      return 0;
    }
  })(),
};

const saveToLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state.cart));
  localStorage.setItem("total", JSON.stringify(state.total));
  localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

      setCartFromBackend: (state, action) => {
      state.cart = action.payload.cart;
      state.total = action.payload.total;
      state.totalItems = action.payload.totalItems || 0;
      saveToLocalStorage(state);
    },


    addToCart: (state, action) => {
      // here in the below code you will see action.payload what thsi mean here action is simpley an object and .payload coantin the data. all information.
      const product = action.payload;

      // the below code is just to check if that particular product in inside the cart or not. if it is present it will send the index and if not it will send -1, state.cart is an array which stores the product inside it.

      const index = state.cart.findIndex((item) => item._id === product._id);

      if (index >= 0) {
        // if the product is already in the cart, do not modify the quantity
        toast.error("Product already in cart");
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

    
    // DECREASE QUANTITY
    decreaseQty: (state, action) => {
      const productId = action.payload;
      const index = state.cart.findIndex((item) => item._id === productId);

      if (index >= 0 && state.cart[index].qty > 1) {
        state.cart[index].qty -= 1;
        state.totalItems -= 1;
        state.total -= state.cart[index].price;

        saveToLocalStorage(state);
      } else if (index >= 0 && state.cart[index].qty === 1) {
        // If quantity is 1 and user decreases, remove product
        state.totalItems -= 1;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1);

        saveToLocalStorage(state);
        toast.success("Product removed from cart");
      }
    },

    // SET QUANTITY DIRECTLY (for manual input)
    setQty: (state, action) => {
      const { productId, qty } = action.payload;
      const index = state.cart.findIndex((item) => item._id === productId);

      if (index >= 0 && qty > 0) {
        // Update totals by removing old qty then adding new qty
        state.totalItems = state.totalItems - state.cart[index].qty + qty;
        state.total =
          state.total - state.cart[index].price * state.cart[index].qty + state.cart[index].price * qty;

        state.cart[index].qty = qty;

        saveToLocalStorage(state);
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

export const {addToCart, removeFromCart, increaseQty, decreaseQty, setQty,   setCartFromBackend, resetCart} = cartSlice.actions

export default cartSlice.reducer 
