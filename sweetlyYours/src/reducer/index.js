import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import orderReducer from "../slices/orderSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
     orders: orderReducer,
})

export default rootReducer