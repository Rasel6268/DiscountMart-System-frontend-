"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosMenu } from "react-icons/io";
import { FaSearch, FaBell, FaEnvelope, FaBars } from "react-icons/fa";
import Link from "next/link";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

const AdminNavbar = ({ onMenuClick, onCollapseClick, isSidebarCollapsed }) => {
  const [openUserModel, setOpenUserModel] = useState(false);
  const userModelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userModelRef.current && !userModelRef.current.contains(event.target)) {
        setOpenUserModel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-linear-to-r from-gray-900 to-gray-800 shadow-2xl">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 lg:hidden cursor-pointer"
          >
            <IoIosMenu className="text-2xl text-white" />
          </button>

          {/* Desktop Collapse Button */}
          <button
            onClick={onCollapseClick}
            className="hidden lg:flex p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <FaBars className="text-white" />
          </button>
          
         
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 px-4 py-2 pl-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-300 hover:text-amber-400 transition">
            <FaBell className="text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Messages */}
          <button className="relative p-2 text-gray-300 hover:text-amber-400 transition">
            <FaEnvelope className="text-lg" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div ref={userModelRef} className="relative">
            <button
              onClick={() => setOpenUserModel(!openUserModel)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-700 transition"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500">
                <img src="/admin-avatar.jpg" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <ChevronDown className="hidden lg:block w-4 h-4 text-gray-400" />
            </button>

            {openUserModel && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 shadow-2xl rounded-xl border border-gray-700 overflow-hidden z-50">
                <div className="bg-linear-to-r from-amber-900/50 to-gray-800 p-4 border-b border-gray-700 flex items-center gap-3">
                  <img src="/admin-avatar.jpg" alt="Admin" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500" />
                  <div>
                    <h2 className="font-semibold text-white">Admin User</h2>
                    <p className="text-sm text-gray-400">admin@aisdiscountmart.com</p>
                  </div>
                </div>
                <div className="py-2">
                  <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition">
                    <User className="w-5 h-5" /> Profile
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 transition">
                    <Settings className="w-5 h-5" /> Settings
                  </Link>
                  <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 w-full transition">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;