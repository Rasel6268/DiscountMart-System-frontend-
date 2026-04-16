"use client";
import React, { useState } from "react";
import AdminNavbar from "@/components/layout/admin/Navbar";
import Sidebar from "@/components/layout/admin/sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar - Sticky on desktop */}
      <div className="hidden lg:block">
        <div className={`sticky top-0 h-screen transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"}`}>
          <Sidebar 
            isOpen={sidebarOpen} 
            isMobileOpen={mobileSidebarOpen}
            onToggle={toggleSidebar}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          isMobileOpen={mobileSidebarOpen}
          onToggle={toggleSidebar}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main content area - This needs to be a column flex container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar - Sticky */}
        <div className="sticky top-0 z-40">
          <AdminNavbar 
            onMenuClick={toggleMobileSidebar}
            onCollapseClick={toggleSidebar}
            isSidebarCollapsed={!sidebarOpen}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;