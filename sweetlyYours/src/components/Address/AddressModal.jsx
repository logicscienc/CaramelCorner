import React from "react";

const AddressModal = ({
  showModal,
  setShowModal,
  handleAddAddress,
   handleUpdateAddress,
  handleChange,
  formData,
   editingAddressId,
}) => {
  if (!showModal) return null;

  return (
   <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
  <div className="bg-white w-full max-w-2xl rounded-3xl p-8 relative mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">


        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
  {editingAddressId ? "Edit Address" : "Add New Address"}
</h2>

        <form
           onSubmit={
    editingAddressId
      ? handleUpdateAddress
      : handleAddAddress
  }
          className="grid md:grid-cols-2 gap-4"
        >
         <input
  type="text"
  name="recipientName"
  value={formData.recipientName}
  placeholder="Recipient Name"
  onChange={handleChange}
  className="border p-3 rounded-lg"
  required
/>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            placeholder="Phone Number"
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="label"
            value={formData.label}
            placeholder="Home / Office"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            name="street"
            value={formData.street}
            placeholder="Street Address"
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
            required
          />

          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="state"
            value={formData.state}
            placeholder="State"
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            placeholder="Pincode"
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="country"
            value={formData.country}
            placeholder="Country"
            // defaultValue="India"
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-maroon-900 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {editingAddressId ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;