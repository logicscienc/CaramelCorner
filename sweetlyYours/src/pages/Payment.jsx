import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiconnector";
import { paymentEndpoints, orderEndpoints } from "../services/apis";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const address = location.state?.address;

  const { cart, total, totalItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  // FIX: backend expects Card, COD, UPI, NetBanking
  const [paymentMethod, setPaymentMethod] = useState("Card");

  // FIX: redirect properly using useEffect
  useEffect(() => {
    if (!address) {
      navigate("/address");
    }
  }, [address, navigate]);

  if (!address) return null;

  const handlePayment = async () => {
    try {
      console.log("ADDRESS:", address);
      console.log("CART:", cart);

      // STEP 1: CREATE ORDER
      const orderRes = await apiConnector(
        "POST",
        orderEndpoints.CREATE_ORDER_API,
        {
          paymentMethod,
          address,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("ORDER RESPONSE:", orderRes.data);

      if (!orderRes.data.success) {
        return;
      }

      const orderId = orderRes.data.order._id;

      // STEP 2: Razorpay flow
      if (paymentMethod === "Card") {
  const paymentRes = await apiConnector(
    "POST",
    paymentEndpoints.CREATE_RAZORPAY_ORDER_API,
    { orderId },
    {
      Authorization: `Bearer ${token}`,
    }
  );

  console.log("RAZORPAY RESPONSE:", paymentRes.data);

  const { razorpayOrderId, amount, currency, key } = paymentRes.data;

  const options = {
    key: key,
    amount: amount,
    currency: currency,
    name: "Sweetly Yours",
    description: "Order Payment",
    order_id: razorpayOrderId,

    handler: async function (response) {
      console.log("PAYMENT SUCCESS RESPONSE:", response);

      try {
        const verifyRes = await apiConnector(
          "POST",
          paymentEndpoints.VERIFY_PAYMENT_API,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );

        console.log("VERIFY RESPONSE:", verifyRes.data);

        navigate("/order-success");
      } catch (err) {
        console.log("Verification Error:", err.response?.data || err);
      }
    },

    prefill: {
      name: address.recipientName,
      contact: address.phone,
    },

    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

      // STEP 3: COD flow
      if (paymentMethod === "COD") {
        navigate("/order-success");
      }
    } catch (error) {
      console.log(
        "Payment Flow Error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center pt-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Payment</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-3">Selected Address</h2>

              <div className="space-y-2">
                <p className="font-semibold">{address.recipientName}</p>
                <p>{address.phone}</p>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state}
                </p>
                <p>
                  {address.pincode}, {address.country}
                </p>
              </div>
            </div>

            <div className="border rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-3">Payment Method</h2>

              {/* Razorpay */}
              <label className="flex gap-3 border p-3 rounded-xl mb-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Razorpay
              </label>

              {/* COD */}
              <label className="flex gap-3 border p-3 rounded-xl">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="border rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>

              <div className="flex justify-between">
                <span>Total</span>
                <span>₹{total + 50 + 20}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-6 bg-maroon-900 text-white py-3 rounded-xl"
            >
              {paymentMethod === "Card" ? "Pay Now" : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
