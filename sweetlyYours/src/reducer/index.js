import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import orderReducer from "../slices/orderSlice";
import wishlistReducer from "../slices/wishlistSlice"

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
     orders: orderReducer,
      wishlist: wishlistReducer,
})

export default rootReducer