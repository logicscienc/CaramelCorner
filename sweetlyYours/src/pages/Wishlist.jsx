import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { apiConnector } from "../services/apiconnector";
import { wishlistEndpoint } from "../services/apis"; 
import {
  setWishlistFromBackend,
  resetWishlist,
} from "../slices/wishlistSlice";
import { addToCart } from "../slices/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist } = useSelector((s) => s.wishlist);
  const { token } = useSelector((s) => s.auth);

  const [loading, setLoading] = useState(false);

  // Correct keys from your wishlistEndpoint
  const GET_WISHLIST = wishlistEndpoint.GET_WISHLIST_API;
  const REMOVE_WISHLIST = wishlistEndpoint.REMOVE_FROM_WISHLIST;

  // Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await apiConnector("GET", GET_WISHLIST, null, {
          Authorization: `Bearer ${token}`,
        });

        if (response.data?.success) {
          const backendWishlist = response.data.wishlist || [];

          // Map the populated productId into a simpler product structure
          const mapped = backendWishlist.map((w) => ({
            ...w.productId,
            _wishlistId: w._id,
          }));

          dispatch(setWishlistFromBackend({ wishlist: mapped }));
        } else {
          console.warn("Get wishlist returned success=false:", response.data);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [dispatch, token]);

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (!token) return toast.error("Please log in to modify wishlist");

    try {
      const response = await apiConnector(
        "DELETE",
        `${REMOVE_WISHLIST}/${productId}`, //  append productId in URL
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data?.success) {
        toast.success("Removed from wishlist");

        // Update Redux state locally
        const newList = wishlist.filter((p) => p._id !== productId);
        dispatch(setWishlistFromBackend({ wishlist: newList }));
      } else {
        toast.error(response.data?.message || "Could not remove item");
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err.response?.data || err.message);
      toast.error("Error removing item");
    }
  };

  // Add product to cart
  const handleAddToBag = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Added to bag");
  };

  // Add all wishlist items to cart
  const handleAddAllToBag = () => {
    if (!wishlist || wishlist.length === 0) return toast("No items to add");

    wishlist.forEach((product) => {
      dispatch(addToCart({ ...product, qty: 1 }));
    });
    toast.success("All items added to bag");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white-500 p-8 rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">Wishlist</h1>

        <hr className="border-t border-[#E5E7EB] mb-6" />

        {loading ? (
          <div className="py-20 text-center text-[#6B7280]">Loading wishlist...</div>
        ) : !wishlist || wishlist.length === 0 ? (
          <div className="py-20 text-center text-[#4B5563]">
            Your wishlist is empty.
            <div className="mt-6">
              <button
                onClick={() => navigate("/products")}
                className="inline-block border px-5 py-2 rounded hover:bg-[#F3F4F6]"
              >
                Browse products
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {wishlist.map((product) => {
                const price = Number(product.price || 0);
                return (
                  <div
                    key={product._id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b"
                  >
                    {/* Left - Details */}
                    <div className="md:col-span-8">
                      <div className="font-medium text-[#1F2937]">{product.name}</div>
                      <div className="mt-2 text-[#374151]">
                        <div className="text-sm">₹{price.toFixed(2)}</div>
                        <div className="text-sm text-[#4B5563] mt-1">Size: One size</div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => handleAddToBag(product)}
                          className="border border-[#111827] px-4 py-2 rounded-sm text-sm hover:bg-[#F3F4F6]"
                        >
                          Add to bag
                        </button>
                      </div>

                      <div className="flex gap-6 text-xs mt-3 text-[#4B5563]">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          className="hover:underline"
                        >
                          Remove item
                        </button>
                        <button className="hover:underline">Add comment</button>
                      </div>
                    </div>

                    {/* Right - Image */}
                    <div className="md:col-span-4 flex justify-end">
                      <img
                        src={product.images?.[0] || "https://picsum.photos/180"}
                        alt={product.name}
                        className="w-32 h-28 object-cover rounded"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex gap-6 items-center">
                <button className="text-sm text-[#374151] hover:underline">Update wishlist</button>
                <button className="text-sm text-[#374151] hover:underline">Share wishlist</button>
              </div>

              <div>
                <button
                  onClick={handleAddAllToBag}
                  className="bg-black-500 text-white-500 px-6 py-3 rounded shadow-sm"
                >
                  Add all to bag
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

