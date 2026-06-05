import React from 'react'
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg">
        <div className="text-7xl mb-4">🎂</div>

        <h1 className="text-4xl font-bold text-maroon-900 mb-4">
          Hoooray! 🎉
        </h1>

        <h2 className="text-2xl font-semibold mb-4">
          Your Happiness Is On The Way! 🍰
        </h2>

        <p className="text-gray-600 mb-8">
          We've received your order and our bakers are already preparing your
          sweet treats with love. 💖
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 rounded-xl bg-maroon-900 text-white"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl border"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
