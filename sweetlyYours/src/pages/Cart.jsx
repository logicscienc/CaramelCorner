import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { GrAdd } from 'react-icons/gr';
import { FiMinus, FiX } from 'react-icons/fi';
import { setCartFromBackend } from "../slices/cartSlice"; 
import { apiConnector } from "../services/apiconnector";
import { cartEndpoints } from "../services/apis";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, total } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);

  // ==============================
  // FETCH CART ON PAGE LOAD
  // ==============================
//  useEffect(() => {
//   const fetchCart = async () => {
//     try {
//       const token = JSON.parse(localStorage.getItem("token"));
//       if (!token) {
//         console.log("No token found in localStorage when fetching cart");
//         return;
//       }

//       console.log("Fetching cart with token:", token);

//       const response = await apiConnector(
//         "GET",
//         cartEndpoints.GET_CART_API,
//         null,
//         { Authorization: `Bearer ${token}` }
//       );

//       console.log("Fetch cart response:", response.data);

//       if (response.data.success) {
//         dispatch(setCartFromBackend(response.data.cart));
//       } else {
//         console.warn("Backend returned failure on getCart:", response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching cart:", err.response?.data || err.message);
//     }
//   };

//   fetchCart();
// }, [dispatch]);


 useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;

      try {
        const response = await apiConnector(
          "GET",
          cartEndpoints.GET_CART_API,
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (response.data.success) {
          const backendCart = response.data.cart;

          const mappedCart = backendCart.items.map((item) => ({
            ...item.productId,
            qty: item.quantity,
          }));

          const totalItems = mappedCart.reduce((acc, item) => acc + item.qty, 0);
          const total = mappedCart.reduce((acc, item) => acc + item.price * item.qty, 0);

          dispatch(
            setCartFromBackend({
              cart: mappedCart,
              total,
              totalItems,
            })
          );
        }
      } catch (err) {
        console.error("Error fetching cart:", err.response?.data || err.message);
      }
    };

    fetchCart();
  }, [dispatch, token]);





  // ==============================
  // UPDATE QUANTITY
  // ==============================
    const handleQtyChange = async (productId, quantity) => {
    try {
      const response = await apiConnector(
        "PUT",
        cartEndpoints.UPDATE_CART_ITEMS_API,
        { productId, quantity },
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const backendCart = response.data.cart;

        const mappedCart = backendCart.items.map((item) => ({
          ...item.productId,
          qty: item.quantity,
        }));

        const totalItems = mappedCart.reduce((acc, item) => acc + item.qty, 0);
        const total = mappedCart.reduce((acc, item) => acc + item.price * item.qty, 0);

        dispatch(
          setCartFromBackend({
            cart: mappedCart,
            total,
            totalItems,
          })
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error.message);
    }
  };

  // ==============================
  // INCREASE QUANTITY
  // ==============================
  const increaseQtyHandler = (productId, currentQty) => {
    handleQtyChange(productId, currentQty + 1);
  };

  // ==============================
  // DECREASE QUANTITY
  // ==============================
  const decreaseQtyHandler = (productId, currentQty) => {
    if (currentQty > 1) {
      handleQtyChange(productId, currentQty - 1);
    }
  };

 

 const handleRemoveFromCart = async (productId) => {
    try {
      const response = await apiConnector(
        "DELETE",
        `${cartEndpoints.REMOVE_FROM_CART_API}/${productId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        const backendCart = response.data.cart;

        const mappedCart = backendCart.items.map((item) => ({
          ...item.productId,
          qty: item.quantity,
        }));

        const totalItems = mappedCart.reduce((acc, item) => acc + item.qty, 0);
        const total = mappedCart.reduce((acc, item) => acc + item.price * item.qty, 0);

        dispatch(
          setCartFromBackend({
            cart: mappedCart,
            total,
            totalItems,
          })
        );
      }
    } catch (error) {
      console.error("Error removing product:", error.response?.data || error.message);
    }
  };



  // ==============================
  // EMPTY CART VIEW
  // ==============================
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md px-10 py-12 max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-black-700 mb-6">Add some delicious items to your box.</p>
          <button
            onClick={() => navigate("/products")}
            className="inline-block bg-maroon-900 text-white px-6 py-2 rounded-lg"
          >
            Shop now
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // MAIN CART VIEW
  // ==============================
  return (
    <div className="min-h-screen bg-[#EFF6FF] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-black-700">My Cart</h1>
            <button
              onClick={() => navigate("/products")}
              className="text-sm px-4 py-2 rounded-md border border-[#E5E7EB]"
            >
              ← Continue shopping
            </button>
          </div>

          {/* table header (desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-sm uppercase text-black-600 pb-4">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* items list */}
          <div className="space-y-6">
            {cart.map((item) => {
              const price = Number(item.price) || 0;
              const qty = Number(item.qty) || 1;
              const rowTotal = price * qty;

              return (
                <div
                  key={item._id}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  {/* product column */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                    <img
                      src={item.images?.[0] || "https://picsum.photos/120"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <div className="font-semibold text-black-600">{item.name}</div>
                      {item.subtitle && (
                        <div className="text-xs text-black-700">{item.subtitle}</div>
                      )}
                      {/* mobile header labels */}
                      <div className="mt-2 md:hidden text-sm text-black-700 flex gap-4">
                        <span>Price: ₹{price.toFixed(2)}</span>
                        <span>Qty: {qty}</span>
                        <span>Total: ₹{rowTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* price */}
                  <div className="col-span-6 md:col-span-2 text-right hidden sm:block">
                    <div className="font-medium">₹{price.toFixed(2)}</div>
                  </div>

                  {/* qty control */}
                  <div className="col-span-6 md:col-span-2 flex items-center justify-start md:justify-center gap-3">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={() => decreaseQtyHandler(item._id, qty)}
                        className="px-3 py-1 hover:bg-[#F3F4F6]"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) =>
                          handleQtyChange(item._id, Number(e.target.value))
                        }
                        className="w-14 text-center py-1 outline-none"
                        aria-label="Quantity"
                      />
                      <button
                        onClick={() => increaseQtyHandler(item._id, qty)}
                        className="px-3 py-1 hover:bg-[#F3F4F6]"
                        aria-label="Increase quantity"
                      >
                        <GrAdd />
                      </button>
                    </div>
                  </div>

                  {/* total */}
                  <div className="col-span-6 md:col-span-2 text-right">
                    <div className="font-semibold text-black-700">
                      ₹{rowTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* remove button */}
                  <div className="col-span-12 md:col-span-0 md:ml-auto md:pl-2">
                    <button
                      onClick={() => handleRemoveFromCart(item._id)}
                      title="Remove"
                      className="text-black-700 hover:text-black-700 ml-auto md:ml-0"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* bottom summary */}
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <div className="text-sm text-black-700">Subtotal</div>
              <div className="text-2xl font-bold text-black-700">
                ₹{Number(total || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* bottom section placeholder */}
        <div className="mt-8">
          <div className="bg-white-500 rounded-xl shadow-md p-6 flex flex-row font-semibold text-xl">

          <span className='text-maroon-900'> "Spoiler alert"</span> "These desserts are as sweet as you are!" And You know what,  "You deserve all the sweetness today and every day. Enjoy!"
            <button className='bg-maroon-900 hover:bg-maroon-800"
               text-white-500 font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300 w-fit mx-auto md:mx-0 gap-2 flex flex-row items-center justify-center'>
              Checkout   ₹{Number(total || 0).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

