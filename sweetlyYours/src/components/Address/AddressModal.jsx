import React, { useEffect, useState } from "react";

const cleanPhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
};

const validate = (f) => {
  const errors = {};
  const name = (f.recipientName ?? "").trim();
  const phone = f.phone ?? "";
  const street = (f.street ?? "").trim();
  const city = (f.city ?? "").trim();
  const state = (f.state ?? "").trim();
  const pincode = f.pincode ?? "";

  if (!name) errors.recipientName = "Recipient name is required";
  else if (name.length < 2) errors.recipientName = "Name is too short";
  else if (!/^[A-Za-z .'-]+$/.test(name))
    errors.recipientName = "Name can only have letters";

  if (!phone) errors.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(phone))
    errors.phone = "Enter a valid 10-digit mobile number";

  if (!street) errors.street = "Street address is required";
  else if (street.length < 5)
    errors.street = "Please enter a fuller address (house no., area)";

  if (!city) errors.city = "City is required";
  else if (!/^[A-Za-z .'-]+$/.test(city))
    errors.city = "City can only have letters";

  if (!state) errors.state = "State is required";
  else if (!/^[A-Za-z .'-]+$/.test(state))
    errors.state = "State can only have letters";

  if (!pincode) errors.pincode = "Pincode is required";
  else if (!/^[1-9]\d{5}$/.test(pincode))
    errors.pincode = "Enter a valid 6-digit pincode";

  return errors;
};

const AddressModal = ({
  showModal,
  setShowModal,
  handleAddAddress,
  handleUpdateAddress,
  handleChange,
  formData,
  editingAddressId,
}) => {
  const [touched, setTouched] = useState({});

  // clear old error state every time the modal opens or closes
  useEffect(() => {
    setTouched({});
  }, [showModal, editingAddressId]);

  if (!showModal) return null;

  const errors = validate(formData);

  const markTouched = (e) =>
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const showError = (name) => touched[name] && errors[name];

  const inputClass = (name, extra = "") =>
    `border p-3 rounded-lg w-full ${
      showError(name) ? "border-red-500" : ""
    } ${extra}`;

  const handlePhoneChange = (e) => {
    handleChange({
      target: { name: "phone", value: cleanPhone(e.target.value) },
    });
  };

  const handlePincodeChange = (e) => {
    handleChange({
      target: {
        name: "pincode",
        value: e.target.value.replace(/\D/g, "").slice(0, 6),
      },
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({
      recipientName: true,
      phone: true,
      street: true,
      city: true,
      state: true,
      pincode: true,
    });
    if (Object.keys(errors).length > 0) return;
    (editingAddressId ? handleUpdateAddress : handleAddAddress)(e);
  };

  const ErrorText = ({ name }) =>
    showError(name) ? (
      <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
    ) : null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-8 relative mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
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
          onSubmit={onSubmit}
          noValidate
          className="grid md:grid-cols-2 gap-4"
        >
          <div>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              placeholder="Recipient Name"
              onChange={handleChange}
              onBlur={markTouched}
              className={inputClass("recipientName")}
            />
            <ErrorText name="recipientName" />
          </div>

          <div>
            <input
              type="tel"
              inputMode="numeric"
              name="phone"
              value={formData.phone}
              placeholder="10-digit mobile number"
              onChange={handlePhoneChange}
              onBlur={markTouched}
              maxLength={10}
              className={inputClass("phone")}
            />
            <ErrorText name="phone" />
          </div>

          <div>
            <input
              type="text"
              name="label"
              value={formData.label}
              placeholder="Home / Office"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              name="street"
              value={formData.street}
              placeholder="Street Address"
              onChange={handleChange}
              onBlur={markTouched}
              className={inputClass("street")}
            />
            <ErrorText name="street" />
          </div>

          <div>
            <input
              type="text"
              name="city"
              value={formData.city}
              placeholder="City"
              onChange={handleChange}
              onBlur={markTouched}
              className={inputClass("city")}
            />
            <ErrorText name="city" />
          </div>

          <div>
            <input
              type="text"
              name="state"
              value={formData.state}
              placeholder="State"
              onChange={handleChange}
              onBlur={markTouched}
              className={inputClass("state")}
            />
            <ErrorText name="state" />
          </div>

          <div>
            <input
              type="text"
              inputMode="numeric"
              name="pincode"
              value={formData.pincode}
              placeholder="Pincode"
              onChange={handlePincodeChange}
              onBlur={markTouched}
              maxLength={6}
              className={inputClass("pincode")}
            />
            <ErrorText name="pincode" />
          </div>

          <div>
            <input
              type="text"
              name="country"
              value={formData.country}
              placeholder="Country"
              onChange={handleChange}
              className="border p-3 rounded-lg w-full"
            />
          </div>

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
