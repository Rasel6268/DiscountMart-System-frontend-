"use client";
import React from "react";
import {
  FaStar,
  FaRegHeart,
  FaAngleRight,
  FaGem,
  FaLeaf,
  FaTrophy,
  FaClock,
  FaGift,
  FaFire,
  FaShoppingCart 
} from "react-icons/fa";
import Link from "next/link";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

import Image from "next/image";
import BannerSlider from "../BannerSwiper";
import { useAuth } from "@/AuthProvider/AuthProvider";

const Home = () => {
  const {user,loading} = useAuth()
   return (
    <section>
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0  to-transparent z-10"></div>
        <div className="w-11/12 mx-auto py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Categories Sidebar - Premium Leather Edition */}
            <div className="lg:col-span-2 lg:block hidden">
              <div className="bg-linear-to-br from-amber-900 to-amber-800 rounded-2xl shadow-2xl p-6 h-full lg:sticky lg:top-6 border border-amber-700/50">
                <h2 className="text-2xl font-bold text-amber-100 mb-8 text-center border-b border-amber-700 pb-4 flex items-center justify-center gap-2">
                  <FaGem className="text-amber-400" />
                  Leather Collections
                  <FaGem className="text-amber-400" />
                </h2>

                <ul className="space-y-3">
                  {[
                    { name: "Premium Leather Bags", count: 24, active: true },
                    { name: "Fusion Handbags", count: 18, active: false },
                    { name: "Men's Wallets", count: 12, active: false },
                    { name: "Women's Belts", count: 8, active: false },
                    { name: "Leather Jackets", count: 15, active: false },
                    { name: "Shoe Collection", count: 20, active: false },
                    { name: "Accessories", count: 30, active: false },
                  ].map((category, index) => (
                    <li
                      key={index}
                      className={`flex justify-between items-center rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer ${
                        category.active
                          ? "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                          : "bg-amber-800/50 text-amber-100 shadow-md hover:bg-amber-700/70 hover:shadow-lg"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span
                        className={`text-sm font-semibold rounded-full px-2.5 py-1 min-w-8 text-center ${
                          category.active
                            ? "bg-amber-100 text-amber-800"
                            : "bg-amber-600 text-amber-100"
                        }`}
                      >
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 bg-linear-to-br from-amber-600 to-amber-700 rounded-2xl p-5 text-white text-center shadow-xl border border-amber-500">
                  <FaGift className="text-3xl mx-auto mb-2 text-amber-300" />
                  <h3 className="font-bold text-lg">Eid Special Offer! 🎉</h3>
                  <p className="text-sm mt-1 text-amber-100">
                    Up to 40% off on premium leather
                  </p>
                  <button className="mt-3 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Premium Banner */}
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <BannerSlider />
              </div>

              {/* Trusted Brands & Event Offers */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 py-5">
                {/* Premium Brands */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200">
                  <h1 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                    <FaGem className="text-amber-600" />
                    Luxury Leather Brands
                  </h1>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      "/download.png",
                      "/chanel-removebg-preview.png",
                      "/dior-removebg-preview.png",
                      "/images-removebg-preview.png",
                      "/puma-removebg-preview.png",
                      "/lg-removebg-preview.png",
                      "/images__1_-removebg-preview.png",
                      "/puma-removebg-preview.png",
                    ].map((brand, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 p-3 rounded-xl hover:bg-amber-100 transition-colors duration-300 flex items-center justify-center border border-amber-200"
                      >
                        <Image
                          src={brand}
                          width={32}
                          height={32}
                          className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                          alt="Brand"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Event Offer Banner */}
                <div className="bg-linear-to-r from-amber-600 to-amber-700 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <FaGift className="text-8xl" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <FaFire className="text-amber-300 text-xl" />
                      <span className="text-sm font-semibold bg-amber-500 px-3 py-1 rounded-full">
                        LIMITED TIME OFFER
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Eid-ul-Fitr Mega Sale</h2>
                    <p className="text-amber-100 mb-4">
                      Get up to 50% off on fusion leather collection + Free Gift
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <div className="bg-white/20 rounded-lg px-3 py-2">
                          <span className="text-2xl font-bold">12</span>
                          <span className="text-sm"> Days</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white/20 rounded-lg px-3 py-2">
                          <span className="text-2xl font-bold">08</span>
                          <span className="text-sm"> Hours</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-white/20 rounded-lg px-3 py-2">
                          <span className="text-2xl font-bold">45</span>
                          <span className="text-sm"> Mins</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-white text-amber-700 px-6 py-2 rounded-full font-semibold hover:bg-amber-100 transition">
                      Claim Offer →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Fusion Collection Section */}
      <div className="py-12 md:py-16 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
              <FaLeaf className="text-amber-700" />
              <span className="text-amber-800 text-sm font-semibold">
                Premium Quality
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              🔥 Fusion Leather Collection
            </h2>
            <p className="text-amber-600 max-w-2xl mx-auto">
              Handcrafted with premium leather • Modern fusion designs • Limited edition
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-amber-100 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="aspect-4/3 w-full">
                    <Image
                      src="/placeholder-product.jpg"
                      alt="Fusion Leather Product"
                      width={600}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FaFire className="text-[8px]" /> PREMIUM
                    </span>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      -25%
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3">
                    <span className="text-white text-xs flex items-center gap-1">
                      <FaClock /> Limited Stock
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col grow">
                  <h3 className="font-semibold text-amber-900 text-base md:text-lg line-clamp-1 mb-1">
                    Premium Leather Tote Bag
                  </h3>
                  <p className="text-amber-600 text-xs md:text-sm line-clamp-2 mb-3">
                    Handcrafted genuine leather with fusion design
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-amber-400 text-xs" />
                      ))}
                    </div>
                    <span className="text-xs text-amber-500">(128 reviews)</span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-amber-700 font-bold text-lg flex items-center gap-1">
                      <FaBangladeshiTakaSign size={14} />
                      4,500
                    </div>
                    <span className="text-xs line-through text-amber-400">
                      6,000
                    </span>
                  </div>

                  <button className="mt-auto w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Explore Full Collection
              <FaAngleRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Special Occasion Discount Banner */}
      <div className="py-12 bg-linear-to-r from-amber-800 to-amber-900">
        <div className="w-11/12 mx-auto">
          <div className="text-center text-white mb-8">
            <FaGift className="text-5xl mx-auto mb-4 text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Special Occasion Offers
            </h2>
            <p className="text-amber-200">
              Admin curated discounts for Eid, Puja, Christmas & More
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Eid Offer */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-amber-600 hover:bg-white/20 transition">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Eid Special</h3>
              <p className="text-amber-200 text-sm mb-3">Up to 40% off on fusion collection</p>
              <div className="text-3xl font-bold text-amber-400 mb-3">40% OFF</div>
              <button className="border border-amber-400 text-amber-400 px-4 py-2 rounded-full text-sm hover:bg-amber-400 hover:text-white transition">
                Shop Now
              </button>
            </div>

            {/* Durga Puja Offer */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-amber-600 hover:bg-white/20 transition">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGem className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Durga Puja Special</h3>
              <p className="text-amber-200 text-sm mb-3">Premium leather gifts collection</p>
              <div className="text-3xl font-bold text-amber-400 mb-3">35% OFF</div>
              <button className="border border-amber-400 text-amber-400 px-4 py-2 rounded-full text-sm hover:bg-amber-400 hover:text-white transition">
                Shop Now
              </button>
            </div>

            {/* Christmas Offer */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-amber-600 hover:bg-white/20 transition">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGift className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Christmas Mega Sale</h3>
              <p className="text-amber-200 text-sm mb-3">Fusion leather + Free gift wrap</p>
              <div className="text-3xl font-bold text-amber-400 mb-3">50% OFF</div>
              <button className="border border-amber-400 text-amber-400 px-4 py-2 rounded-full text-sm hover:bg-amber-400 hover:text-white transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Leather Products */}
      <div className="py-12 md:py-16 bg-amber-50/50">
        <div className="w-11/12 mx-auto px-4">
          <div className="text-center mb-12">
            <FaTrophy className="text-4xl mx-auto mb-3 text-amber-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Best Selling Leather Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((product) => (
              <div
                key={product}
                className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl border border-amber-100 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <div className="aspect-4/3 w-full">
                    <Image
                      src="/placeholder-product.jpg"
                      alt="Leather Product"
                      width={600}
                      height={450}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                      BESTSELLER
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-5 flex flex-col grow">
                  <h3 className="font-semibold text-amber-900 text-sm md:text-base line-clamp-1 mb-1">
                    Genuine Leather Wallet
                  </h3>
                  <p className="text-amber-600 text-xs md:text-sm line-clamp-2 mb-3">
                    Premium quality leather wallet
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-amber-700 font-bold text-sm md:text-base flex items-center gap-1">
                      <FaBangladeshiTakaSign size={14} />
                      2,500
                    </div>
                    <span className="text-xs line-through text-amber-400">3,500</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800">
                      Add to Cart
                    </button>
                    <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                      <FaRegHeart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-6 py-3 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              View All Best Sellers
              <FaAngleRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Discount Products Section - Admin Special Offers */}
      <div className="py-12 md:py-16 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-amber-900">
                <span className="w-3 h-8 bg-linear-to-b from-amber-500 to-amber-600 rounded-full"></span>
                Special Discount Offers
              </h2>
              <p className="text-amber-600 mt-2">
                Admin curated discounts for special occasions & events
              </p>
            </div>
            <Link
              href="/shop"
              className="flex items-center text-amber-600 gap-2 font-semibold hover:text-amber-700 transition-colors group"
            >
              View All
              <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((product) => (
              <div
                key={product}
                className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-amber-100 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative">
                  <div className="aspect-square w-full">
                    <img
                      src="/placeholder-product.png"
                      alt="Discount Product"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.floor(Math.random() * 40) + 10}%
                    </span>
                    <span className="bg-amber-600 text-white text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      EID OFFER
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                    <span className="text-white text-[10px] flex items-center gap-1">
                      <FaClock /> Limited Time
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-4 flex flex-col grow">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm md:text-base font-bold text-amber-900 line-clamp-1">
                      Fusion Leather Bag
                    </h2>
                    <button className="text-amber-400 hover:text-red-500 transition-colors">
                      <FaRegHeart className="text-sm" />
                    </button>
                  </div>

                  <p className="text-amber-600 text-xs md:text-sm mb-2 line-clamp-2">
                    Premium fusion design leather bag
                  </p>

                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className="text-amber-400 text-[10px] md:text-xs"
                      />
                    ))}
                    <span className="text-[10px] text-amber-500 ml-1">(45)</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-sm md:text-base font-bold text-amber-700 flex items-center gap-1">
                        <FaBangladeshiTakaSign size={12} />
                        3,200
                      </span>
                      <span className="text-[10px] line-through text-amber-400">
                        5,500
                      </span>
                    </div>
                    <button className="bg-linear-to-r from-amber-600 to-amber-700 text-white p-1.5 rounded-lg hover:from-amber-700 hover:to-amber-800 transition">
                      <FaShoppingCart className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter & Premium Membership */}
      <div className="py-16 bg-linear-to-r from-amber-900 to-amber-800">
        <div className="w-11/12 mx-auto text-center">
          <FaGem className="text-5xl mx-auto mb-4 text-amber-400" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Join Premium Leather Club
          </h2>
          <p className="text-amber-200 mb-6 max-w-2xl mx-auto">
            Get exclusive access to limited edition fusion collections & special occasion discounts
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-amber-500 text-white placeholder-amber-300 focus:outline-none focus:bg-white/20"
            />
            <button className="bg-amber-500 text-amber-900 px-6 py-3 rounded-full font-semibold hover:bg-amber-400 transition">
              Subscribe
            </button>
          </div>
          <p className="text-amber-300 text-xs mt-4">
            Get 15% off on first purchase + Free shipping
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;