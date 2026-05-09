// app/cart/page.js or pages/cart.js
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTrash,
  FaShoppingCart,
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaLock,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
} from "react-icons/fa";
import { GiHandBag } from "react-icons/gi"
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CartPage = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [savedForLater, setSavedForLater] = useState([]);


  useEffect(() => {
    setCartItems(items);
    calculateTotals();
  }, [items]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotalAmount = getTotalPrice();
    setSubtotal(subtotalAmount);
    
    const shipping = shippingCost;
    const discountAmount = discount;
    const totalAmount = subtotalAmount + shipping - discountAmount;
    setTotal(totalAmount > 0 ? totalAmount : 0);
  };

  useEffect(() => {
    calculateTotals();
  }, [subtotal, shippingCost, discount]);

  // Handle quantity update
  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    updateQuantity(productId, newQuantity);
    toast.success("Cart updated");
  };

  // Handle remove item
  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  // Handle save for later
  const handleSaveForLater = (item) => {
    removeFromCart(item.productId);
    setSavedForLater([...savedForLater, item]);
    toast.success(`${item.name} saved for later`);
  };

  // Handle move to cart from saved
  const handleMoveToCart = (item) => {
    setSavedForLater(savedForLater.filter(i => i.productId !== item.productId));
    updateQuantity(item.productId, item.quantity);
    toast.success(`${item.name} moved to cart`);
  };

  // Handle apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    try {
      // Simulate API call for coupon validation
      // Replace with actual API call
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDiscount(data.discount);
        toast.success(`Coupon applied! You saved $${data.discount}`);
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate checkout process
      // Replace with actual checkout API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
     
      router.push("/checkout");
    } catch (error) {
      toast.error("Failed to process checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Empty cart component
  const EmptyCart = () => (
    <div className="text-center py-16 md:py-24">
      <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <GiHandBag className="text-5xl text-amber-600" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-8">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-all duration-300 shadow-md"
      >
        <FaArrowLeft className="text-sm" />
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-amber-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length > 0 
              ? `You have ${getTotalItems()} item(s) in your cart`
              : "Your cart is waiting for you"}
          </p>
        </div>

        {cartItems.length === 0 && savedForLater.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-amber-50 border-b border-amber-200">
                      <tr className="text-left">
                        <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                          Product
                        </th>
                        <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                          Total
                        </th>
                        <th className="px-4 py-4 text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr
                          key={item.productId}
                          className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors"
                        >
                          {/* Product Info */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-amber-100 rounded-lg overflow-hidden shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <GiHandBag className="text-2xl text-amber-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <Link
                                  href={`/product/${item.productId}`}
                                  className="font-semibold text-gray-800 hover:text-amber-600 transition line-clamp-2"
                                >
                                  {item.name}
                                </Link>
                                {item.variant && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Variant: {item.variant}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-4 py-4">
                            <span className="text-gray-700 font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </td>

                          {/* Quantity */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition"
                              >
                                <FaMinus className="text-xs text-gray-600" />
                              </button>
                              <span className="w-12 text-center font-medium text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                className="w-8 h-8 rounded-lg border border-amber-200 flex items-center justify-center hover:bg-amber-50 transition"
                              >
                                <FaPlus className="text-xs text-gray-600" />
                              </button>
                            </div>
                          </td>

                          {/* Total */}
                          <td className="px-4 py-4">
                            <span className="font-bold text-amber-600">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleSaveForLater(item)
                                }
                                className="p-2 text-gray-500 hover:text-amber-600 transition"
                                title="Save for later"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveItem(item.productId, item.name)
                                }
                                className="p-2 text-red-500 hover:text-red-700 transition"
                                title="Remove"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cart Actions */}
                <div className="p-4 bg-amber-50/50 border-t border-amber-100 flex justify-between items-center flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition"
                  >
                    <FaArrowLeft className="text-sm" />
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your cart?")) {
                        clearCart();
                        toast.success("Cart cleared");
                      }
                    }}
                    className="text-red-600 hover:text-red-700 font-medium transition"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Saved for Later */}
              {savedForLater.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                  <div className="p-4 bg-amber-50 border-b border-amber-200">
                    <h3 className="font-semibold text-gray-800">
                      Saved for Later ({savedForLater.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {savedForLater.map((item) => (
                      <div
                        key={item.productId}
                        className="p-4 flex items-center justify-between hover:bg-amber-50/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amber-100 rounded-lg overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <GiHandBag className="text-xl text-amber-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-amber-600">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
                        >
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 sticky top-24">
                <div className="p-6 border-b border-amber-100">
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <div>
                      <select
                        value={shippingCost}
                        onChange={(e) => setShippingCost(Number(e.target.value))}
                        className="text-sm border border-amber-200 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
                      >
                        <option value="0">Free Shipping ($0)</option>
                        <option value="5.99">Standard ($5.99)</option>
                        <option value="12.99">Express ($12.99)</option>
                        <option value="24.99">Overnight ($24.99)</option>
                      </select>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="pt-2">
                    <label className="block text-sm text-gray-600 mb-2">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                      >
                        Apply
                      </button>
                    </div>
                    {discount > 0 && (
                      <p className="text-green-600 text-sm mt-2">
                        Coupon applied! You saved {formatPrice(discount)}
                      </p>
                    )}
                  </div>

                  {/* Discount */}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="border-t border-amber-100 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-amber-600">{formatPrice(total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      *Taxes calculated at checkout
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || cartItems.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="text-sm" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>

                  {/* Payment Methods */}
                  <div className="pt-4">
                    <p className="text-xs text-gray-500 text-center mb-3">
                      Secure payment methods
                    </p>
                    <div className="flex justify-center gap-3">
                      <FaCcVisa className="text-3xl text-gray-400" />
                      <FaCcMastercard className="text-3xl text-gray-400" />
                      <FaCcPaypal className="text-3xl text-gray-400" />
                      <FaCcAmex className="text-3xl text-gray-400" />
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 text-center">
                    <div className="flex justify-center gap-4 text-xs text-gray-500">
                      <span>🔒 Secure Checkout</span>
                      <span>🚚 Free Returns</span>
                      <span>💯 100% Authentic</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Products Section */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  You Might Also Like
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      name: "Premium Leather Bag",
                      price: 89.99,
                      image: null,
                    },
                    {
                      id: 2,
                      name: "Designer Sunglasses",
                      price: 129.99,
                      image: null,
                    },
                  ].map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <GiHandBag className="text-2xl text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-amber-600">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Added to cart");
                        }}
                        className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                      >
                        <FaShoppingCart className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;