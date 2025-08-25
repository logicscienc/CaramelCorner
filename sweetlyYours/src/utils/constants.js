export const ACCOUNT_TYPE = {
     CUSTOMER: "Customer",
  ADMIN: "Admin", 
};

export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Payment Status (for order history)
export const PAYMENT_STATUS = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  REFUNDED: "Refunded",
};
// Sizes
export const CAKE_SIZE = {
  SMALL: "0.5 Kg",
  MEDIUM: "1 Kg",
  LARGE: "2 Kg",
  CUSTOM: "Custom",
};