// app/checkout/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaLock,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaPlus,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import { GiHandBag } from "react-icons/gi";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const router = useRouter();
  // Mock user data
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+880 1234567890",
    avatar: "/user-avatar.jpg",
    isLoggedIn: true,
  });
  
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      productId: "prod_001",
      name: "Premium Leather Backpack",
      price: 2899.99, // BDT
      quantity: 1,
      image: null,
      brand: "UrbanLife",
    },
    {
      id: "2",
      productId: "prod_002",
      name: "Designer Sunglasses",
      price: 1299.99,
      quantity: 2,
      image: null,
      brand: "LuxeEye",
    },
    {
      id: "3",
      productId: "prod_003",
      name: "Minimalist Wrist Watch",
      price: 3599.99,
      quantity: 1,
      image: null,
      brand: "TimeCraft",
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Address
    addressLine1: "",
    addressLine2: "",
    city: "",
    area: "",
    postCode: "",
    country: "Bangladesh",
    
    // Shipping Method
    shippingArea: "dhaka", // 'dhaka' or 'outside_dhaka'
    
    // Payment Method
    paymentMethod: "card",
    
    // Card Details (for card payment)
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    
    // Billing Address
    sameAsShipping: true,
    billingAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      area: "",
      postCode: "",
      country: "Bangladesh",
    },
    
    // Additional Info
    notes: "",
    saveAddress: false,
    addressName: "",
  });
  
  const [errors, setErrors] = useState({});
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // Shipping methods for Bangladesh
  const shippingMethods = {
    dhaka: {
      id: "dhaka",
      name: "Inside Dhaka",
      price: 60, // 60 TK
      days: "1-2 business days",
      description: "Delivery within Dhaka city",
      icon: FaLocationDot ,
    },
    outside_dhaka: {
      id: "outside_dhaka",
      name: "Outside Dhaka",
      price: 130, // 130 TK
      days: "3-5 business days",
      description: "Delivery anywhere outside Dhaka",
      icon: FaTruck,
    },
  };
  
  // Mock saved addresses
  useEffect(() => {
    const mockAddresses = [
      {
        _id: "addr_001",
        name: "Home",
        addressLine1: "House 12, Road 5",
        addressLine2: "Banani",
        city: "Dhaka",
        area: "Banani",
        postCode: "1213",
        country: "Bangladesh",
        shippingArea: "dhaka",
        isDefault: true,
      },
      {
        _id: "addr_002",
        name: "Office",
        addressLine1: "Plot 22, Sector 3",
        addressLine2: "Uttara",
        city: "Dhaka",
        area: "Uttara",
        postCode: "1230",
        country: "Bangladesh",
        shippingArea: "dhaka",
        isDefault: false,
      },
      {
        _id: "addr_003",
        name: "Factory",
        addressLine1: "Industrial Area",
        addressLine2: "Gazipur",
        city: "Gazipur",
        area: "Tongi",
        postCode: "1704",
        country: "Bangladesh",
        shippingArea: "outside_dhaka",
        isDefault: false,
      },
    ];
    setSavedAddresses(mockAddresses);
    
    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }));
  }, []);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = formData.shippingArea === 'dhaka' ? 60 : 130;
  const tax = subtotal * 0.05; // 5% VAT in Bangladesh
  const total = subtotal + shippingCost + tax;
  
  // Determine shipping area based on city/area
  const determineShippingArea = (city, area) => {
    const dhakaAreas = [
      'dhaka', 'dhanmondi', 'gulshan', 'banani', 'uttara', 'mirpur', 
      'mohammadpur', 'motijheel', 'paltan', 'ramna', 'shahbag', 
      'tejgaon', 'badda', 'khilgaon', 'shyamoli', 'farmgate'
    ];
    
    const cityLower = city?.toLowerCase() || '';
    const areaLower = area?.toLowerCase() || '';
    
    if (cityLower === 'dhaka' || dhakaAreas.some(dhakaArea => areaLower.includes(dhakaArea))) {
      return 'dhaka';
    }
    return 'outside_dhaka';
  };
  
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address._id);
    const shippingArea = determineShippingArea(address.city, address.area);
    
    setFormData(prev => ({
      ...prev,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      area: address.area,
      postCode: address.postCode,
      country: address.country,
      shippingArea: address.shippingArea || shippingArea,
    }));
  };
  
  const handleCityChange = (city, area) => {
    const shippingArea = determineShippingArea(city, area);
    setFormData(prev => ({
      ...prev,
      shippingArea,
    }));
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'city' || name === 'area') {
      const newFormData = { ...formData, [name]: value };
      handleCityChange(
        name === 'city' ? value : formData.city,
        name === 'area' ? value : formData.area
      );
      setFormData(newFormData);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [name]: value,
      },
    }));
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.addressLine1) newErrors.addressLine1 = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.area) newErrors.area = "Area/Thana is required";
    if (!formData.postCode) newErrors.postCode = "Post code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    if (!formData.shippingArea) {
      toast.error("Please select a shipping area");
      return false;
    }
    return true;
  };
  
  const validateStep3 = () => {
    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }
    
    if (formData.paymentMethod === "card") {
      const newErrors = {};
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) 
        newErrors.cardNumber = "Invalid card number";
      
      if (!formData.cardName) newErrors.cardName = "Cardholder name is required";
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) 
        newErrors.expiryDate = "Invalid expiry date (MM/YY)";
      
      if (!formData.cvv) newErrors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(formData.cvv)) 
        newErrors.cvv = "Invalid CVV";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    
    return true;
  };
  
  const addNewAddress = (addressData) => {
    const shippingArea = determineShippingArea(addressData.city, addressData.area);
    const newAddress = {
      _id: `addr_${Date.now()}`,
      ...addressData,
      shippingArea,
      isDefault: savedAddresses.length === 0,
    };
    setSavedAddresses([...savedAddresses, newAddress]);
    setShowAddAddressModal(false);
    toast.success("Address saved successfully");
  };
  
  const deleteAddress = (addressId) => {
    setSavedAddresses(savedAddresses.filter(addr => addr._id !== addressId));
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
      setFormData(prev => ({
        ...prev,
        addressLine1: "",
        addressLine2: "",
        city: "",
        area: "",
        postCode: "",
      }));
    }
    toast.success("Address deleted");
  };
  
  

  const AddressModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Address</h3>
          <button onClick={() => setShowAddAddressModal(false)}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          addNewAddress({
            name: form.addressName.value,
            addressLine1: form.addressLine1.value,
            addressLine2: form.addressLine2.value,
            city: form.city.value,
            area: form.area.value,
            postCode: form.postCode.value,
            country: form.country.value,
          });
        }}>
          <div className="space-y-3">
            <input
              name="addressName"
              placeholder="Address Name (e.g., Home, Office)"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              name="addressLine1"
              placeholder="Address Line 1"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              name="addressLine2"
              placeholder="Address Line 2 (Optional)"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="city"
                placeholder="City"
                className="px-3 py-2 border rounded-lg"
                required
              />
              <input
                name="area"
                placeholder="Area/Thana"
                className="px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="postCode"
                placeholder="Post Code"
                className="px-3 py-2 border rounded-lg"
                required
              />
              <select
                name="country"
                className="px-3 py-2 border rounded-lg"
                required
              >
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddAddressModal(false)}
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {[
              { step: 1, name: "Shipping Info", icon: FaMapMarkerAlt },
              { step: 2, name: "Shipping Method", icon: FaTruck },
              { step: 3, name: "Payment", icon: FaCreditCard },
            ].map((s) => (
              <div key={s.step} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                      step >= s.step
                        ? "bg-amber-500 text-white shadow-lg"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {step > s.step ? <FaCheckCircle /> : s.step}
                  </div>
                  <p className="text-sm mt-2 font-medium hidden md:block">
                    {s.name}
                  </p>
                </div>
                {s.step < 3 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      step > s.step ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Shipping Information</h2>
                  
                  {/* User Info Alert */}
                  {user.isLoggedIn && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        Welcome back, {user.firstName}! Your information has been pre-filled.
                      </p>
                    </div>
                  )}
                  
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Saved Addresses</h3>
                      <div className="space-y-2">
                        {savedAddresses.map((address) => (
                          <div
                            key={address._id}
                            className={`flex items-start gap-3 p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition ${
                              selectedAddressId === address._id ? "ring-2 ring-amber-500" : ""
                            }`}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <input
                              type="radio"
                              checked={selectedAddressId === address._id}
                              onChange={() => {}}
                              className="mt-1 text-amber-500"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-gray-600">
                                {address.addressLine1}, {address.area}, {address.city} - {address.postCode}
                              </p>
                              <p className="text-xs text-amber-600 mt-1">
                                {address.shippingArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                              </p>
                              {address.isDefault && (
                                <span className="text-xs text-amber-600 ml-2">Default</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAddress(address._id);
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddAddressModal(true)}
                        className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                      >
                        <FaPlus /> Add New Address
                      </button>
                    </div>
                  )}
                  
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                          errors.firstName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+880 XXXXXXXXXX"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt /> Shipping Address
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="addressLine1"
                          value={formData.addressLine1}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                            errors.addressLine1 ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="House/Building number, Street name"
                        />
                        {errors.addressLine1 && (
                          <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                          placeholder="Apartment, floor, landmark"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                              errors.city ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., Dhaka, Chittagong"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area/Thana *
                          </label>
                          <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                              errors.area ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., Gulshan, Banani, Uttara"
                          />
                          {errors.area && (
                            <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Post Code *
                          </label>
                          <input
                            type="text"
                            name="postCode"
                            value={formData.postCode}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                              errors.postCode ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="e.g., 1213"
                          />
                          {errors.postCode && (
                            <p className="text-red-500 text-xs mt-1">{errors.postCode}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                          >
                            <option value="Bangladesh">Bangladesh</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Save Address Option */}
                  {user.isLoggedIn && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        name="saveAddress"
                        checked={formData.saveAddress}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-amber-500 rounded"
                      />
                      <div className="flex-1">
                        <label className="font-medium text-gray-700">
                          Save this address for future purchases
                        </label>
                        {formData.saveAddress && (
                          <input
                            type="text"
                            name="addressName"
                            placeholder="Address name (e.g., Home, Office)"
                            value={formData.addressName}
                            onChange={handleInputChange}
                            className="mt-2 w-full px-3 py-1 border rounded-md text-sm"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (validateStep1()) {
                          setStep(2);
                        }
                      }}
                      className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold"
                    >
                      Continue to Shipping →
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Shipping Method */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Select Shipping Area</h2>
                  
                  {/* Shipping Info Badge */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      Based on your address: <strong>{formData.city}, {formData.area}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Shipping cost is calculated based on delivery location
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.values(shippingMethods).map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                          formData.shippingArea === method.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingArea"
                            value={method.id}
                            checked={formData.shippingArea === method.id}
                            onChange={handleInputChange}
                            className="text-amber-500"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <method.icon className="text-amber-500" />
                              <p className="font-semibold text-gray-800">{method.name}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{method.days}</p>
                            <p className="text-xs text-gray-400">{method.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-600">
                            ৳{method.price}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {/* Delivery Time Note */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700">
                      📦 Estimated delivery time: {
                        formData.shippingArea === 'dhaka' 
                          ? '1-2 business days' 
                          : '3-5 business days'
                      }
                    </p>
                  </div>
                  
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => {
                        if (validateStep2()) {
                          setStep(3);
                        }
                      }}
                      className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: "card", name: "Credit/Debit Card", icon: FaCreditCard },
                      { id: "bkash", name: "bKash", icon: FaMoneyBillWave },
                      { id: "nagad", name: "Nagad", icon: FaMoneyBillWave },
                      { id: "cod", name: "Cash on Delivery", icon: FaMoneyBillWave },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                          formData.paymentMethod === method.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-amber-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="text-amber-500"
                        />
                        <method.icon className="text-2xl" />
                        <span className="font-medium">{method.name}</span>
                      </label>
                    ))}
                  </div>
                  
                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800">Card Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                            errors.cardNumber ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="Name on card"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                            errors.cardName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.cardName && (
                          <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                              errors.expiryDate ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV *
                          </label>
                          <input
                            type="password"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            maxLength="4"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500 ${
                              errors.cvv ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.cvv && (
                            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === "bkash" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800">bKash Payment</h3>
                      <p className="text-sm text-gray-600">
                        You will be redirected to bKash to complete your payment.
                      </p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-xs text-blue-700">
                          After completing payment, your order will be confirmed automatically.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === "nagad" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800">Nagad Payment</h3>
                      <p className="text-sm text-gray-600">
                        You will be redirected to Nagad to complete your payment.
                      </p>
                    </div>
                  )}
                  
                  {formData.paymentMethod === "cod" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-800">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600">
                        Pay in cash when your order is delivered.
                      </p>
                      <div className="bg-yellow-50 p-3 rounded">
                        <p className="text-xs text-yellow-700">
                          Additional ৳20 will be charged for COD service.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        name="sameAsShipping"
                        checked={formData.sameAsShipping}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-amber-500 rounded"
                      />
                      <label className="font-medium text-gray-700">
                        Billing address same as shipping address
                      </label>
                    </div>
                    
                    {!formData.sameAsShipping && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800">Billing Address</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={formData.billingAddress.addressLine1}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.billingAddress.city}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            name="area"
                            placeholder="Area/Thana"
                            value={formData.billingAddress.area}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            name="postCode"
                            placeholder="Post Code"
                            value={formData.billingAddress.postCode}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      placeholder="Special instructions for delivery..."
                    />
                  </div>
                  
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={""}
                      disabled={loading}
                      className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition font-semibold disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock /> Place Order (৳{total.toFixed(2)})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-amber-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <GiHandBag className="text-3xl text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-amber-600">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping ({formData.shippingArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span>৳{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (5%)</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-amber-600">৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Shipping Info Note */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FaTruck className="text-amber-500" />
                  Shipping to: {formData.shippingArea === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated delivery: {
                    formData.shippingArea === 'dhaka' 
                      ? '1-2 business days' 
                      : '3-5 business days'
                  }
                </p>
              </div>
              
              {/* Payment Methods Accepted */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">We Accept</p>
                <div className="flex justify-center gap-3">
                  <FaCcVisa className="text-3xl text-gray-400" />
                  <FaCcMastercard className="text-3xl text-gray-400" />
                  <FaCcPaypal className="text-3xl text-gray-400" />
                  <FaCcAmex className="text-3xl text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Address Modal */}
      {showAddAddressModal && <AddressModal />}
    </div>
  );
};

export default CheckoutPage;