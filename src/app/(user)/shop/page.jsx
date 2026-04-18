"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegHeart, FaShoppingCart, FaFilter, FaTimes } from "react-icons/fa";
import { GiLeatherBoot, GiHandbag } from "react-icons/gi";

const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    priceRanges: [],
    ratings: []
  });

  const categories = [
    { name: "Leather Bags", count: 24 },
    { name: "Fusion Handbags", count: 18 },
    { name: "Men's Wallets", count: 12 },
    { name: "Leather Jackets", count: 15 },
    { name: "Belts & Accessories", count: 20 },
    { name: "Shoe Collection", count: 10 },
  ];

  const brands = [
    { name: "Premium Leather Co.", count: 32 },
    { name: "Fusion Designs", count: 25 },
    { name: "Luxury Wear", count: 18 },
    { name: "Artisan Craft", count: 12 },
  ];

  const priceRanges = [
    { id: 1, range: "৳0 - ৳1,000", min: 0, max: 1000, count: 15 },
    { id: 2, range: "৳1,000 - ৳3,000", min: 1000, max: 3000, count: 23 },
    { id: 3, range: "৳3,000 - ৳5,000", min: 3000, max: 5000, count: 31 },
    { id: 4, range: "৳5,000+", min: 5000, max: 100000, count: 12 },
  ];

  const products = [
    {
      id: 1,
      name: "Premium Leather Tote Bag",
      price: 4500,
      originalPrice: 6500,
      rating: 4.5,
      reviews: 128,
      image: "/product-1.jpg",
      brand: "Premium Leather Co.",
      category: "Leather Bags",
      isNew: true,
      discount: 30,
      isFeatured: true,
    },
    {
      id: 2,
      name: "Fusion Handbag with Embroidery",
      price: 3800,
      originalPrice: 5200,
      rating: 4.8,
      reviews: 95,
      image: "/product-2.jpg",
      brand: "Fusion Designs",
      category: "Fusion Handbags",
      isNew: true,
      discount: 27,
    },
    {
      id: 3,
      name: "Men's Leather Wallet",
      price: 1200,
      originalPrice: 1800,
      rating: 4.3,
      reviews: 234,
      image: "/product-3.jpg",
      brand: "Luxury Wear",
      category: "Men's Wallets",
      discount: 33,
      bestseller: true,
    },
    {
      id: 4,
      name: "Classic Leather Jacket",
      price: 8500,
      originalPrice: 12000,
      rating: 4.9,
      reviews: 67,
      image: "/product-4.jpg",
      brand: "Artisan Craft",
      category: "Leather Jackets",
      isFeatured: true,
      discount: 29,
    },
    {
      id: 5,
      name: "Designer Leather Belt",
      price: 1800,
      originalPrice: 2500,
      rating: 4.2,
      reviews: 156,
      image: "/product-5.jpg",
      brand: "Premium Leather Co.",
      category: "Belts & Accessories",
      discount: 28,
    },
    {
      id: 6,
      name: "Fusion Clutch Bag",
      price: 3200,
      originalPrice: 4500,
      rating: 4.7,
      reviews: 89,
      image: "/product-6.jpg",
      brand: "Fusion Designs",
      category: "Fusion Handbags",
      isNew: true,
    },
    {
      id: 7,
      name: "Leather Oxford Shoes",
      price: 5500,
      originalPrice: 7800,
      rating: 4.6,
      reviews: 112,
      image: "/product-7.jpg",
      brand: "Luxury Wear",
      category: "Shoe Collection",
      discount: 29,
    },
    {
      id: 8,
      name: "Handcrafted Leather Bag",
      price: 6200,
      originalPrice: 8900,
      rating: 4.9,
      reviews: 45,
      image: "/product-8.jpg",
      brand: "Artisan Craft",
      category: "Leather Bags",
      isFeatured: true,
    },
  ];

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-amber-50">
      {/* Hero Banner */}
      <div className="relative bg-linear-to-r from-amber-800 to-amber-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-4 border-amber-400 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-amber-400 rounded-full"></div>
        </div>
        <div className="w-11/12 mx-auto px-4 text-center relative z-10">
          {/* <GiLeatherBoot className="text-5xl mx-auto mb-4 text-amber-400" /> */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Collection</h1>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto">
            Discover our premium leather and fusion collection. Handcrafted with excellence.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-lg border-b border-amber-100">
        <div className="w-11/12 mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="w-full md:w-96 relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-amber-50/50"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-md"
              >
                <FaFilter className="text-sm" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-white text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {/* Sort Select */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                <select className="bg-transparent border-none focus:ring-0 text-sm text-gray-800">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-amber-100 sticky top-24">
              {/* Header */}
              <div className="p-5 border-b border-amber-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden p-2 hover:bg-amber-50 rounded-lg"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Categories */}
                <div className="p-5 border-b border-amber-100">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    {/* <GiHandbag className="text-amber-500" /> */}
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <label key={index} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-gray-700 group-hover:text-amber-600 transition">
                            {category.name}
                          </span>
                        </div>
                        <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="p-5 border-b border-amber-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Brands</h3>
                  <div className="space-y-3">
                    {brands.map((brand, index) => (
                      <label key={index} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-gray-700 group-hover:text-amber-600 transition">
                            {brand.name}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">({brand.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="p-5 border-b border-amber-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Price Range</h3>
                  <div className="space-y-3">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-gray-700 group-hover:text-amber-600 transition">
                            {range.range}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">({range.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div className="p-5 border-b border-amber-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Ratings</h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <label key={stars} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${i < stars ? "text-amber-400" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="text-gray-600 text-sm ml-1">{stars} Stars</span>
                          </div>
                        </div>
                        <span className="text-gray-500 text-xs">({Math.floor(Math.random() * 50) + 10})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="p-5 border-t border-amber-100">
                <button className="w-full py-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all duration-300 font-semibold">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-4">
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
                <p className="text-gray-500 text-sm mt-1">Showing {products.length} of {products.length} products</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">View:</span>
                <button className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-amber-50 rounded-lg text-gray-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 overflow-hidden"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                    <div className="aspect-square w-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full font-medium shadow-md">
                          NEW
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-medium shadow-md">
                          -{product.discount}%
                        </span>
                      )}
                      {product.bestseller && (
                        <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-medium shadow-md">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 group">
                      <FaRegHeart className="text-gray-600 group-hover:text-red-500 text-sm" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4">
                    {/* Brand */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {product.brand}
                      </span>
                      <span className="text-[10px] text-gray-500 capitalize">{product.category}</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 group-hover:text-amber-600 transition">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-[10px] md:text-xs ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-500">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-base md:text-lg font-bold text-amber-600">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="block text-[10px] text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md">
                      <FaShoppingCart className="text-xs" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-4 py-2 border border-amber-200 rounded-lg text-gray-600 hover:bg-amber-50 hover:border-amber-300 transition">
                  Previous
                </button>
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg shadow-md">1</button>
                <button className="px-4 py-2 border border-amber-200 rounded-lg text-gray-600 hover:bg-amber-50 transition">
                  2
                </button>
                <button className="px-4 py-2 border border-amber-200 rounded-lg text-gray-600 hover:bg-amber-50 transition">
                  3
                </button>
                <button className="px-4 py-2 border border-amber-200 rounded-lg text-gray-600 hover:bg-amber-50 transition">
                  4
                </button>
                <button className="px-4 py-2 border border-amber-200 rounded-lg text-gray-600 hover:bg-amber-50 transition">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default Shop;