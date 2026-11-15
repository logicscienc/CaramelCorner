import { Link } from "react-router-dom";

const OrderSuccess = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-3xl font-bold mb-3">Payment successful 🎉</h1>
    <p className="mb-6">Thank you for your order. We've sent the details to your email.</p>
    <Link to="/" className="bg-maroon-900 text-white px-6 py-3 rounded-xl">
      Continue shopping
    </Link>
  </div>
);

export default OrderSuccess;
