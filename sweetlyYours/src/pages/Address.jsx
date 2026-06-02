import React, { useEffect, useState } from "react";
import homeImage from "../assets/Images/home.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { apiConnector } from "../services/apiconnector";
import { addressEndpoints } from "../services/apis";
import AddressModal from "../components/Address/AddressModal";

const Address = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

const { cart, total, totalItems } = useSelector(
  (state) => state.cart
);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
const [formData, setFormData] = useState({
  label: "Home",
  recipientName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: true,
});

  const shipping = 50;
  const tax = 20;
  const finalTotal = total + shipping + tax;

  // =====================
  // FETCH ADDRESSES
  // =====================
  const fetchAddresses = async () => {
    try {
      const response = await apiConnector(
        "GET",
        addressEndpoints.GET_ADDRESSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

     if (response.data.success) {
  setAddresses(response.data.addresses);

  if (response.data.addresses.length > 0) {
    setSelectedAddress(response.data.addresses[0]._id);
  }
}
    } catch (error) {
      console.error("Fetch Address Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

// Add address api call
const handleAddAddress = async (e) => {
  e.preventDefault();

  try {
    const response = await apiConnector(
      "POST",
      addressEndpoints.ADD_ADDRESS_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      setShowModal(false);
      fetchAddresses();

      setFormData({
        label: "Home",
        recipientName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: true,
      });
    }
  } catch (error) {
    console.error("Add Address Error:", error);
  }
};

// update address api call
const handleUpdateAddress = async (e) => {
  e.preventDefault();

  try {
    const response = await apiConnector(
      "PUT",
      addressEndpoints.UPDATE_ADDRESS_API.replace(
        ":addressId",
        editingAddressId
      ),
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      setShowModal(false);
      setEditingAddressId(null);

      fetchAddresses();
    }
  } catch (error) {
    console.error("Update Address Error:", error);
  }
};

// delete address api call
const handleDeleteAddress = async (addressId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      addressEndpoints.DELETE_ADDRESS_API.replace(
        ":addressId",
        addressId
      ),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      fetchAddresses();
    }
  } catch (error) {
    console.error("Delete Address Error:", error);
  }
};

const handleEditClick = (address) => {
  setEditingAddressId(address._id);

  setFormData({
    label: address.label || "",
    recipientName: address.recipientName || "",
    phone: address.phone || "",
    street: address.street || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    country: address.country || "India",
    isDefault: address.isDefault || false,
  });

  setShowModal(true);
};

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-12">
          <img src={homeImage} className="w-auto mx-auto" />
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Which Address Do You Want To Receive Your Order?
          </h1>
          <p className="text-gray-500 mt-3">
            Choose your delivery location
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2">

            {/* ONLY SHOW TITLE IF ADDRESSES EXIST */}
            {addresses.length > 0 && (
              <h2 className="text-xl font-bold mb-5">
                Saved Addresses
              </h2>
            )}

            {/* EMPTY STATE */}
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow">
                <FaHome className="text-4xl mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  No saved addresses found
                </p>

                <button
                  onClick={() => {
                       setEditingAddressId(null);

    setFormData({
      label: "Home",
      recipientName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: true,
    });

    setShowModal(true);
                  }}
                  className="flex items-center gap-2 mx-auto bg-maroon-900 text-white px-5 py-3 rounded-xl"
                >
                  <FaPlus />
                  Add Address
                </button>
              </div>
            ) : (
              <>
                {/* ADDRESS LIST */}
                <div className="space-y-5">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between">

                        <div>
                          <div className="flex items-center gap-3">

    <input
      type="radio"
      name="selectedAddress"
      checked={selectedAddress === address._id}
      onChange={() => setSelectedAddress(address._id)}
      className="w-4 h-4 cursor-pointer"
    />

    <div className="flex items-center gap-2 font-bold">
      <FaHome className="text-maroon-900" />
      {address.label}
    </div>
    </div>

                          <p className="mt-3 font-semibold">
                            {address.recipientName}
                          </p>

                          <p className="text-gray-600">{address.phone}</p>

                          <p className="mt-2 text-gray-700">
                            {address.street}
                          </p>

                          <p className="text-gray-700">
                            {address.city}, {address.state}
                          </p>

                          <p className="text-gray-700">
                            {address.pincode}, {address.country}
                          </p>
                        </div>

                        <div className="flex gap-3">
                         <button
  onClick={() => handleEditClick(address)}
  className="text-blue-600 hover:scale-110 transition"
>
  <FaEdit />
</button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* ADD ADDRESS TEXT LINK */}
<div
  onClick={() => {
   setEditingAddressId(null);

    setFormData({
      label: "Home",
      recipientName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: true,
    });

    setShowModal(true);
}}
  className="mt-6 flex items-center gap-2 text-maroon-900 font-medium cursor-pointer hover:underline w-fit"
>
  <FaPlus />
  Add Address
</div>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">

              <h2 className="text-2xl font-bold mb-6">
                Billing Summary
              </h2>

              <p className="text-gray-500 mb-4">
                {totalItems} item(s) in cart
              </p>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                 <span>₹{total}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
               
                onClick={() => {
                    const selectedAddressData = addresses.find(
                        (addr) => addr._id === selectedAddress
                    );

                    navigate("/payment", {
                        state: {
                            address: selectedAddressData,
                        },
                    });
                }}
                className="w-full mt-6 bg-maroon-900 text-white py-3 rounded-xl"
              >
                Continue To Pay
              </button>

            </div>
          </div>

        </div>


        <AddressModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleAddAddress={handleAddAddress}
            handleUpdateAddress={handleUpdateAddress}
          handleChange={handleChange}
            formData={formData}
            editingAddressId={editingAddressId}
        />
      </div>
    </div>
  );
};

export default Address;
