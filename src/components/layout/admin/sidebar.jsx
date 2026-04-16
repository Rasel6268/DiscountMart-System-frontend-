"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosClose, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaProductHunt, FaUser, FaCog } from "react-icons/fa";
import {
  MdBorderAll,
  MdBrandingWatermark,
  MdCategory,
  MdDeliveryDining,
  MdPayment,
  MdDashboard,
  MdDiscount,
} from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { GiLeatherBoot, GiHandbag } from "react-icons/gi";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard className="text-lg" />,
    color: "text-amber-400",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: <MdCategory className="text-lg" />,
    color: "text-emerald-400",
  },
  {
    name: "Brands",
    href: "/brands",
    icon: <MdBrandingWatermark className="text-lg" />,
    color: "text-blue-400",
  },
  {
    name: "Products",
    href: "/products",
    icon: <FaProductHunt className="text-lg" />,
    color: "text-purple-400",
  },
  {
    name: "Discount Offers",
    href: "/discounts",
    icon: <MdDiscount className="text-lg" />,
    color: "text-red-400",
  },
  {
    name: "Users",
    href: "/users",
    icon: <FaUser className="text-lg" />,
    color: "text-cyan-400",
  },
  {
    name: "Delivery",
    href: "/delivery_cost",
    icon: <MdDeliveryDining className="text-lg" />,
    color: "text-orange-400",
  },
  {
    name: "Orders",
    href: "/orders",
    icon: <MdBorderAll className="text-lg" />,
    color: "text-indigo-400",
  },
  {
    name: "Transaction",
    href: "/transaction",
    icon: <MdPayment className="text-lg" />,
    color: "text-green-400",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <FaCog className="text-lg" />,
    color: "text-gray-400",
  },
];

export default function Sidebar({
  isOpen,
  isMobileOpen,
  onToggle,
  onMobileClose,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transition-all duration-300 ease-in-out
          ${isOpen ? "w-72" : "lg:w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center justify-between h-16 px-5 bg-gradient-to-r from-amber-800 to-amber-900 transition-all duration-300 ${!isOpen && "lg:justify-center lg:px-3"}`}
        >
          {isOpen ? (
            <div className="flex items-center gap-2">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-base font-bold text-white">Admin Panel</h1>
                <p className="text-[10px] text-amber-300">AIS DiscountMart</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <img
                src="/icon.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 rounded-md hover:bg-amber-700 transition-colors text-white"
          >
            {/* <IoIosClose className="text-2xl" /> */}
          </button>
        </div>

        {/* Admin Profile Summary - Collapsible */}
        {isOpen ? (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">
                  admin@aisdiscountmart.com
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border-b border-gray-700 flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AD</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={`mt-6 px-3 overflow-y-auto h-[calc(100vh-280px)] transition-all duration-300 ${!isOpen && "lg:px-2"}`}
        >
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center rounded-lg transition-all duration-300 group
                    ${isOpen ? "px-3 py-2.5 gap-3" : "lg:px-2 lg:py-3 lg:justify-center"}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border-r-2 border-amber-500"
                        : "text-gray-400 hover:bg-gray-800 hover:text-amber-400"
                    }
                  `}
                  onClick={() => onMobileClose?.()}
                  title={!isOpen ? item.name : ""}
                >
                  <span
                    className={`${item.color} group-hover:text-amber-400 transition ${!isOpen && "lg:text-xl"}`}
                  >
                    {item.icon}
                  </span>
                  {isOpen && (
                    <>
                      <span className="text-sm font-medium flex-1">
                        {item.name}
                      </span>
                      {item.name === "Discount Offers" && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          HOT
                        </span>
                      )}
                      {item.name === "Fusion Collection" && (
                        <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - Collapsible */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900/50">
          <button
            className={`
              flex items-center rounded-lg transition-all duration-300 w-full
              ${isOpen ? "gap-3 px-4 py-2.5" : "lg:justify-center lg:px-2 lg:py-3"}
              text-gray-400 hover:bg-red-500/20 hover:text-red-400
            `}
            title={!isOpen ? "Logout" : ""}
          >
            <HiOutlineLogout className="text-lg" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
          {isOpen && (
            <p className="text-center text-[10px] text-gray-600 mt-2">
              © 2024 AIS DiscountMart
            </p>
          )}
        </div>

        {/* Collapse Toggle Button - Desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-amber-600 rounded-full items-center justify-center shadow-lg hover:bg-amber-500 transition-all duration-300 z-50"
        >
          {isOpen ? (
            <IoIosArrowBack className="text-white text-sm" />
          ) : (
            <IoIosArrowForward className="text-white text-sm" />
          )}
        </button>
      </div>
    </>
  );
}
