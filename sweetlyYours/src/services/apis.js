const BASE_URL = process.env.REACT_APP_BASE_URL

// Categories API
export const categories = {
    CATEGORIES_API: BASE_URL + "/product/getAllCategories",
}

// Auth endpoints
export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendOTP",
    SIGNUP_API: BASE_URL + "/auth/signUp",
    LOGIN_API: BASE_URL + "/auth/login",
     RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}



// products endpoints
export const productEndpoints = {
    CREATE_PRODUCT_API: BASE_URL + "/product/createProduct",
    UPDATE_PRODUCT_API: BASE_URL + "/product/updateProduct",
    GET_ALL_PRODUCT_API: BASE_URL + "/product/getAllProduct",
    GET_ONE_PRODUCT_API: BASE_URL + "/product/getOneProduct",
    GET_FEATURED_PRODUCT_API: BASE_URL + "/product/getFeaturedProducts",
    GET_RELATED_PRODUCT_API: BASE_URL + "/product/getRelatedProducts",
    CREATE_CATEGORIE_API: BASE_URL + "/product/createCategory",
    UPDATE_CATEGORIE_API: BASE_URL + "/product/updateCategory/:categoryId",
    GET_ALL_CATEGORIE_API: BASE_URL + "/product/getOneCategory/:categoryId",
}

// rating and review
export const ratingEndpoints = {
    REVIEWS_DETAILS_API: BASE_URL + "/product/getProductReviews",
}




// cart endpoints
export const cartEndpoints = {
    ADD_TO_CART_API: BASE_URL + "/cart/addToCart",
    GET_CART_API: BASE_URL + "/cart/getCart",
    UPDATE_CART_ITEMS_API: BASE_URL + "/cart/updateCartItem",
    REMOVE_FROM_CART_API: BASE_URL + "/cart/removeCartItem",
    CLEAR_CART_API: BASE_URL + "/cart/clearCart",
}

// wishlist endpoints
export const wishlistEndpoint = {
    ADD_TO_WISHLIST_API: BASE_URL + "/product/addToWishlist",
    GET_WISHLIST_API: BASE_URL + "/product/getWishlist",
    REMOVE_FROM_WISHLIST: BASE_URL + "/product/removeFromWishlist",

}

// Address endpoints
export const addressEndpoints = {
  ADD_ADDRESS_API: BASE_URL + "/address",
  GET_ADDRESSES_API: BASE_URL + "/address",
  UPDATE_ADDRESS_API: BASE_URL + "/address/:addressId",
  DELETE_ADDRESS_API: BASE_URL + "/address/:addressId",
  SET_DEFAULT_ADDRESS_API: BASE_URL + "/address/:addressId/default",
};

// Order endpoints
export const orderEndpoints = {
  CREATE_ORDER_API: BASE_URL + "/order/orders",
  GET_USER_ORDER_API: BASE_URL + "/order/orders",
  GET_ORDER_BY_ID_API: BASE_URL + "/order/orders/:orderId",
  CANCEL_ORDER_API: BASE_URL + "/order/orders/:orderId/cancel",
};

// payment endpoints
export const paymentEndpoints = {
  CREATE_RAZORPAY_ORDER_API:
    BASE_URL + "/payment/capture-payment",

  VERIFY_PAYMENT_API:
    BASE_URL + "/payment/verify-payment",
};


// chatbot endpoints
export const chatbotEndpoints = {
  CHAT_API: BASE_URL + "/chatbot/chat",
};


