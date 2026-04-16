"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart, FaSearch } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import Link from "next/link";
import {
  UserRoundPlus,
  LogIn,
  House,
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  const [openCategoriesDropdown, setOpenCategoriesDropdown] = useState(false);
  const userModelRef = useRef(null);
  const categoriesDropdownRef = useRef(null);
  const isAuthenticated = false; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userModelRef.current && !userModelRef.current.contains(event.target)) {
        setOpenUserModel(false);
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target)) {
        setOpenCategoriesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserModel = () => setOpenUserModel(!openUserModel);
  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);

  const categories = [
    { name: "Leather Bags", href: "/shop?category=leather-bags", count: 24 },
    { name: "Fusion Handbags", href: "/shop?category=fusion-handbags", count: 18 },
    { name: "Men's Wallets", href: "/shop?category=mens-wallets", count: 12 },
    { name: "Leather Jackets", href: "/shop?category=leather-jackets", count: 15 },
    { name: "Belts & Accessories", href: "/shop?category=belts", count: 20 },
    { name: "Shoe Collection", href: "/shop?category=shoes", count: 10 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-gray-900 to-gray-800 shadow-2xl">
      {/* Announcement Bar */}
      <div className="bg-linear-to-r from-amber-600 to-amber-700 text-white py-2.5 px-4 text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            🎉 Eid Special Offer
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            🚀 Free Shipping on Orders Over $50
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            🔥 Up to 40% OFF on Fusion Collection
          </span>
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          
          <div>
            <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              DiscountMart
            </span>
            <p className="text-[10px] text-amber-500 hidden sm:block">Premium Leather & Fusion</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 font-medium">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-300 hover:text-amber-400 transition-colors duration-300"
          >
            <House className="w-4 h-4" /> Home
          </Link>
          
          {/* Categories Dropdown */}
          <div ref={categoriesDropdownRef} className="relative">
            <button
              onClick={() => setOpenCategoriesDropdown(!openCategoriesDropdown)}
              className="flex items-center gap-1 text-gray-300 hover:text-amber-400 transition-colors duration-300"
            >
              <ShoppingBag className="w-4 h-4" /> Categories
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${openCategoriesDropdown ? "rotate-180" : ""}`} />
            </button>
            
            {openCategoriesDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                <div className="p-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex justify-between items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition-colors duration-300"
                      onClick={() => setOpenCategoriesDropdown(false)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 p-2 bg-gray-800/50">
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2 text-amber-400 text-sm font-semibold hover:text-amber-300 transition"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <Link
            href="/about"
            className="flex items-center gap-1 text-gray-300 hover:text-amber-400 transition-colors duration-300"
          >
            <FcAbout className="w-4 h-4" /> About
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Icon */}
          <button className="hidden md:flex p-2 text-gray-300 hover:text-amber-400 transition-colors duration-300">
            <FaSearch className="text-lg" />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative group">
            <FaRegHeart className="text-xl text-gray-300 group-hover:text-red-500 transition-colors duration-300" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
              3
            </span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <AiOutlineShoppingCart className="text-xl text-gray-300 group-hover:text-amber-400 transition-colors duration-300" />
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
              0
            </span>
          </Link>

          {/* User Auth Desktop */}
          {isAuthenticated ? (
            <div ref={userModelRef} className="relative hidden lg:block">
              <button
                onClick={toggleUserModel}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 hover:border-amber-400 transition-all duration-300 hover:scale-105"
              >
                <img
                  src="/user-avatar.jpg"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {openUserModel && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-800 shadow-2xl rounded-xl border border-gray-700 overflow-hidden z-50">
                  <div className="bg-linear-to-r from-amber-900/50 to-gray-800 p-4 border-b border-gray-700 flex items-center gap-3">
                    <img
                      src="/user-avatar.jpg"
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                    />
                    <div className="truncate">
                      <h2 className="font-semibold text-white truncate">
                        John Doe
                      </h2>
                      <p className="text-sm text-gray-400 truncate">
                        john.doe@example.com
                      </p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition"
                      onClick={() => setOpenUserModel(false)}
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition"
                      onClick={() => setOpenUserModel(false)}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setOpenUserModel(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full transition"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg"
              >
                <UserRoundPlus className="w-4 h-4" /> Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300"
          >
            {isMenuOpen ? (
              <IoIosClose className="text-2xl text-white" />
            ) : (
              <IoIosMenu className="text-2xl text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800 shadow-2xl border-t border-gray-700 absolute w-full z-40 left-0 top-full">
          <div className="flex flex-col gap-2 p-4 max-h-[80vh] overflow-y-auto">
            {/* Search Bar */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
              onClick={toggleMobileMenu}
            >
              <House className="w-4 h-4" /> Home
            </Link>
            
            {/* Categories Section */}
            <div className="px-4 py-2">
              <h3 className="text-amber-400 text-sm font-semibold mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex justify-between items-center px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition text-sm"
                    onClick={toggleMobileMenu}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-amber-500">{category.count}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            <Link
              href="/shop"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
              onClick={toggleMobileMenu}
            >
              <ShoppingBag className="w-4 h-4" /> All Products
            </Link>
            
            <Link
              href="/about"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
              onClick={toggleMobileMenu}
            >
              <FcAbout className="w-4 h-4" /> About
            </Link>

            {isAuthenticated ? (
              <div className="mt-2 border-t border-gray-700 pt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-xl">
                  <img
                    src="/user-avatar.jpg"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <h3 className="font-semibold text-white">John Doe</h3>
                    <p className="text-sm text-gray-400">john.doe@example.com</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
                  onClick={toggleMobileMenu}
                >
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
                  onClick={toggleMobileMenu}
                >
                  <ShoppingBag className="w-4 h-4" /> My Orders
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-red-500/20 text-red-400 transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 border-t border-gray-700 pt-2 flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
                  onClick={toggleMobileMenu}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition text-center justify-center"
                  onClick={toggleMobileMenu}
                >
                  <UserRoundPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;