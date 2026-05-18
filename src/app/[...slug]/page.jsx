"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaGem,
  FaLeaf,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
  FaFire,
  FaGift,
} from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Countdown timer for launch date (set your launch date here)
  useEffect(() => {
    // Set your target launch date
    const launchDate = new Date("2026-06-15T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Add your newsletter subscription API call here
      console.log("Subscribed with email:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-amber-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="w-11/12 mx-auto py-6 md:py-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-linear-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FaGem className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                LeatherCraft
              </span>
            </Link>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300">
                <FaFacebookF className="text-sm" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300">
                <FaInstagram className="text-sm" />
              </button>
              <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300">
                <FaTwitter className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex-grow flex items-center justify-center py-12 md:py-20">
          <div className="w-11/12 mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-6 animate-bounce">
                <FaFire className="text-amber-600" />
                <span className="text-amber-800 text-sm font-semibold">
                  Something Exciting is Coming!
                </span>
                <FaFire className="text-amber-600" />
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 bg-clip-text text-transparent">
                We're Working On
                <br />
                Something Amazing
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
                Our team of master craftsmen is creating an exclusive collection 
                of premium leather products. Get ready to experience luxury like never before.
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-xl border border-amber-200">
                  <div className="text-4xl md:text-5xl font-bold text-amber-700">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-amber-500 font-semibold mt-1">Days</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-xl border border-amber-200">
                  <div className="text-4xl md:text-5xl font-bold text-amber-700">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-amber-500 font-semibold mt-1">Hours</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-xl border border-amber-200">
                  <div className="text-4xl md:text-5xl font-bold text-amber-700">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-amber-500 font-semibold mt-1">Minutes</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-xl border border-amber-200">
                  <div className="text-4xl md:text-5xl font-bold text-amber-700">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-amber-500 font-semibold mt-1">Seconds</div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/60 backdrop-blur rounded-xl p-5 border border-amber-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaGem className="text-amber-600 text-xl" />
                  </div>
                  <h3 className="font-bold text-amber-800 mb-2">Premium Leather</h3>
                  <p className="text-sm text-amber-600">
                    Highest quality genuine leather from finest tanneries
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-xl p-5 border border-amber-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaLeaf className="text-amber-600 text-xl" />
                  </div>
                  <h3 className="font-bold text-amber-800 mb-2">Eco-Friendly</h3>
                  <p className="text-sm text-amber-600">
                    Sustainable practices and eco-conscious materials
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-xl p-5 border border-amber-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaGift className="text-amber-600 text-xl" />
                  </div>
                  <h3 className="font-bold text-amber-800 mb-2">Exclusive Offers</h3>
                  <p className="text-sm text-amber-600">
                    Special launch discounts for early subscribers
                  </p>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8 shadow-xl border border-amber-200 max-w-lg mx-auto">
                <h3 className="text-xl font-bold text-amber-800 mb-2">
                  Get Notified When We Launch
                </h3>
                <p className="text-amber-600 text-sm mb-4">
                  Be the first to know and get exclusive 20% off on your first purchase
                </p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    Notify Me
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* Success Message */}
                {isSubscribed && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm animate-fade-in">
                    🎉 Thank you! We'll notify you when we launch.
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex justify-between text-sm text-amber-600 mb-2">
                  <span>Development Progress</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-700 h-2 rounded-full transition-all duration-1000"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-xs text-amber-500 mt-3">
                  ✨ We're working hard to bring you the best leather experience
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-11/12 mx-auto py-6 border-t border-amber-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-amber-500">
            <p>&copy; 2024 LeatherCraft. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-amber-700 transition">About Us</Link>
              <Link href="#" className="hover:text-amber-700 transition">Contact</Link>
              <Link href="#" className="hover:text-amber-700 transition">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;