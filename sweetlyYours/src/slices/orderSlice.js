import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiconnector";
import { orderEndpoints } from "../services/apis";


// in short this orderSlice manages all order related data in redux. uses thunks createAsyncThunk for calling APIs. updates state whe APIs succeed/fail. show success error with toast.

// Extracts the API URLs from orderEndpoints so we can use them leter in this.
const {
  CREATE_ORDER_API,
  GET_USER_ORDER_API,
  GET_ORDER_BY_ID_API,
  CANCEL_ORDER_API,
} = orderEndpoints;

// Initial state
const initialState = {
  status: "idle",
  orderFetchStatus: "idle",
  orderCancelStatus: "idle",
  orders: [],
  currentOrder: null,
  errors: null,
  successMessage: null,
};

// Thunks
// Create order calls POST/ orders to create a new order.
export const createOrderAsync = createAsyncThunk(
    "orders/createOrderAsync",
    async (order, {rejectWithValue}) => {
        try {
            const response = await apiConnector("POST", CREATE_ORDER_API, order);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create order");
        }
    }
);

// Get all orders for logged-in user. Calls GET /orders to fetch all orders of the logged-in user.
export const getUserOrdersAsync = createAsyncThunk(
  "orders/getUserOrdersAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiConnector("GET", GET_USER_ORDER_API);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// get specific order by id. Calls GET /orders/:orderId to fetch a single order.
export const getOrderByIdAsync = createAsyncThunk(
  "orders/getOrderByIdAsync",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_ORDER_BY_ID_API.replace(":orderId", orderId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
  }
);

// Cancel order. Calls PUT /orders/:orderId/cancel to cancel order.
export const cancelOrderAsync = createAsyncThunk(
  "orders/cancelOrderAsync",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await apiConnector(
        "PUT",
        CANCEL_ORDER_API.replace(":orderId", orderId)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
  }
);

// Slice
const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetStatuses: (state) => {
      state.status = "idle";
      state.orderFetchStatus = "idle";
      state.orderCancelStatus = "idle";
    },
    clearErrors: (state) => {
      state.errors = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    }, 
    },

    extraReducers: (builder) => {
        builder
        // create order

        .addCase(createOrderAsync.pending, (state) => {
             state.status = "pending";
        state.errors = null;
        })
       .addCase(createOrderAsync.fulfilled, (state, action) => {
          state.status = "fulfilled";
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        state.successMessage = "Order created successfully!";
        toast.success("Order created successfully");
       }) 
       .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.errors = action.payload;
        toast.error(action.payload); 
       })

    //    Get user order
       .addCase(getUserOrdersAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = "fulfilled";
        state.orders = action.payload;
      })
      .addCase(getUserOrdersAsync.rejected, (state, action) => {
        state.orderFetchStatus = "rejected";
        state.errors = action.payload;
        toast.error(action.payload);
      })

    //   get order by id
       .addCase(getOrderByIdAsync.fulfilled, (state, action) => {
        state.orderFetchStatus = "fulfilled";
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByIdAsync.rejected, (state, action) => {
        state.orderFetchStatus = "rejected";
        state.errors = action.payload;
        toast.error(action.payload);
      })

    //   cancel order
     .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        state.orderCancelStatus = "fulfilled";
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.successMessage = "Order cancelled successfully!";
        toast.success("Order cancelled ");
      })
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.orderCancelStatus = "rejected";
        state.errors = action.payload;
        toast.error(action.payload);
      });
    },
});

// exporting actions
export const {
     resetCurrentOrder,
  resetStatuses,
  clearErrors,
  clearSuccess,
} = orderSlice.actions;


// Selectors
export const selectOrderStatus = (state) => state.orders.status;
export const selectOrders = (state) => state.orders.orders;
export const selectOrdersErrors = (state) => state.orders.errors;
export const selectOrdersSuccessMessage = (state) =>
  state.orders.successMessage;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrderFetchStatus = (state) =>
  state.orders.orderFetchStatus;
export const selectOrderCancelStatus = (state) =>
  state.orders.orderCancelStatus;

export default orderSlice.reducer;
