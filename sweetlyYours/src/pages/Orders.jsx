import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const getToken = () => {
  const raw = localStorage.getItem("token");
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://caramelcorner.onrender.com/api/v1/order/orders",
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setOrders((res.data.orders || []).filter((o) => o.paymentStatus === "Paid"));
      } catch (err) {
        console.error("Fetch orders error:", err.response?.data || err.message);
        setError("Could not load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading your orders...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  if (!orders.length) {
    return (
      <div className="text-center mt-20">
        <p className="mb-4">You haven't placed any orders yet.</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-maroon-900 text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white border rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex flex-wrap justify-between gap-2 mb-4 text-sm text-gray-600">
            <span>Order #{order._id.slice(-8).toUpperCase()}</span>
            <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
            <span>Payment: {order.paymentStatus}</span>
            <span className="font-semibold text-black">{order.orderStatus}</span>
          </div>

          {order.products.map((item) => {
            const p = item.productId;
            const img = Array.isArray(p?.image) ? p.image[0] : p?.image;
            return (
              <div key={item._id || p?._id} className="flex items-center gap-4 mb-3">
                {img && <img src={img} alt={p?.name} className="w-16 h-16 rounded-lg object-cover" />}
                <div className="flex-1">
                  <p className="font-medium">{p?.name || "Product"}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>₹{item.price * item.quantity}</p>
              </div>
            );
          })}

          <p className="text-right font-bold mt-3">Total: ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}
