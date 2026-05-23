"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import {
  FaInfoCircle,
  FaRegHeart,
  FaSearch,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
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
import { useAuth } from "@/AuthProvider/AuthProvider";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Marquee from "react-fast-marquee";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  const [openCategoriesDropdown, setOpenCategoriesDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userModelRef = useRef(null);
  const categoriesDropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { getTotalItems, items: cartItems } = useCart();
  const { getWishlistCount, wishlistItems } = useWishlist();
  const router = useRouter();

  // Handle mounting to avoid hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userModelRef.current &&
        !userModelRef.current.contains(event.target)
      ) {
        setOpenUserModel(false);
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setOpenCategoriesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserModel = () => setOpenUserModel(!openUserModel);
  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);

  // Get cart count (total items including quantities)
  const cartCount = mounted ? getTotalItems() : 0;
  
  // Get wishlist count
  const wishlistCount = mounted ? getWishlistCount() : 0;

  // Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.status === 200) {
        setIsLoggingOut(false);
        toast.success("Logged out successfully");
        router.push("/auth/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Categories data
  const categories = [
    { name: "Men's Shoes", href: "/category/men-shoes", count: 45 },
    { name: "Women's Shoes", href: "/category/women-shoes", count: 52 },
    { name: "Men's Bags", href: "/category/men-bags", count: 28 },
    { name: "Women's Bags", href: "/category/women-bags", count: 36 },
    { name: "Accessories", href: "/category/accessories", count: 19 },
    { name: "Sale", href: "/category/sale", count: 12 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-gray-900 to-gray-800 shadow-2xl">
      {/* Announcement Bar */}
      <Marquee
        pauseOnHover={true}
        className="bg-linear-to-r from-amber-600 to-amber-700 text-white py-2.5 px-4 text-center text-sm font-medium"
      >
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1 font-bold text-[16px]">
            Eid Special Offer
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 14 10 18 10 15 13 16 17 12 15 8 17 9 13 6 10 10 10 12 6" />
          </svg>
          <span className="flex items-center gap-1 font-bold text-[16px]">
            Free shipping for all orders from $60.00
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 14 10 18 10 15 13 16 17 12 15 8 17 9 13 6 10 10 10 12 6" />
          </svg>
          <span className="flex items-center gap-1 font-bold text-[16px]">
            Summer sale discount 50% off
          </span>
          <span className="flex items-center gap-1 font-bold text-[16px]">
            Free shipping for all orders from $60.00
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 14 10 18 10 15 13 16 17 12 15 8 17 9 13 6 10 10 10 12 6" />
          </svg>
          <span className="flex items-center gap-1 font-bold text-[16px]">
            Instant discount code 50% off M06LY6
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 14 10 18 10 15 13 16 17 12 15 8 17 9 13 6 10 10 10 12 6" />
          </svg>
          <span className="flex items-center gap-1 font-bold text-[16px]">
            Free shipping for all orders from $60.00
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 14 10 18 10 15 13 16 17 12 15 8 17 9 13 6 10 10 10 12 6" />
          </svg>
        </div>
      </Marquee>

      <div className="w-11/12 mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div>
            <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              DiscountStore
            </span>
            <p className="text-[10px] text-amber-500 hidden sm:block">
              Premium Leather & Fusion
            </p>
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

          <Link
            href="/shop"
            className="flex items-center gap-1 text-gray-300 hover:text-amber-400 transition-colors duration-300"
          >
            <FaShoppingCart className="w-4 h-4" /> Shop
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
            {mounted && wishlistCount > 0 ? (
              <FaHeart className="text-xl text-red-500 group-hover:text-red-600 transition-colors duration-300" />
            ) : (
              <FaRegHeart className="text-xl text-gray-300 group-hover:text-red-500 transition-colors duration-300" />
            )}
            {mounted && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <AiOutlineShoppingCart className="text-xl text-gray-300 group-hover:text-amber-400 transition-colors duration-300" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
            {mounted && cartCount === 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                0
              </span>
            )}
          </Link>

          {/* User Auth Desktop */}
          {user ? (
            <div ref={userModelRef} className="relative hidden lg:block">
              <button
                onClick={toggleUserModel}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-500 hover:border-amber-400 transition-all duration-300 hover:scale-105"
              >
                <img
                  src={user.avatar || "/user-avatar.jpg"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {openUserModel && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-800 shadow-2xl rounded-xl border border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-linear-to-r from-amber-900/50 to-gray-800 p-4 border-b border-gray-700 flex items-center gap-3">
                    <img
                      src={user.avatar || "/user-avatar.jpg"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                    />
                    <div className="truncate">
                      <h2 className="font-semibold text-white truncate">
                        {user.name || user.fullName || "John Doe"}
                      </h2>
                      <p className="text-sm text-gray-400 truncate">
                        {user.email || "john.doe@example.com"}
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
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition"
                      onClick={() => setOpenUserModel(false)}
                    >
                      <FaRegHeart className="w-5 h-5" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-5 h-5" /> Logout
                        </>
                      )}
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
        <div className="lg:hidden bg-gray-800 shadow-2xl border-t border-gray-700 absolute w-full z-40 left-0 top-full animate-in slide-in-from-top-2 duration-200">
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
              <h3 className="text-amber-400 text-sm font-semibold mb-2">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex justify-between items-center px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition text-sm"
                    onClick={toggleMobileMenu}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-amber-500">
                      {category.count}
                    </span>
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

            {/* Cart in Mobile Menu */}
            <Link
              href="/cart"
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
              onClick={toggleMobileMenu}
            >
              <div className="flex items-center gap-3">
                <AiOutlineShoppingCart className="w-4 h-4" />
                Cart
              </div>
              {mounted && cartCount > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              )}
            </Link>

            {/* Wishlist in Mobile Menu */}
            <Link
              href="/wishlist"
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 transition"
              onClick={toggleMobileMenu}
            >
              <div className="flex items-center gap-3">
                {mounted && wishlistCount > 0 ? (
                  <FaHeart className="w-4 h-4 text-red-500" />
                ) : (
                  <FaRegHeart className="w-4 h-4" />
                )}
                Wishlist
              </div>
              {mounted && wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="mt-2 border-t border-gray-700 pt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-xl">
                  <img
                    src={user.avatar || "/user-avatar.jpg"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <h3 className="font-semibold text-white">
                      {user.name || user.fullName || "John Doe"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {user.email || "john.doe@example.com"}
                    </p>
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
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-red-500/20 text-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" /> Logout
                    </>
                  )}
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