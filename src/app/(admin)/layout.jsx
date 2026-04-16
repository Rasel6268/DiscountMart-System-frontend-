"use client";
import React, { useState } from "react";
import AdminNavbar from "@/components/layout/admin/Navbar";
import Sidebar from "@/components/layout/admin/sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      {/* Sidebar - Desktop collapsible, Mobile toggle */}
      <Sidebar 
        isOpen={sidebarOpen} 
        isMobileOpen={mobileSidebarOpen}
        onToggle={toggleSidebar}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-x-hidden transition-all duration-300">
        {/* Navbar with menu toggle buttons */}
        <AdminNavbar 
          onMenuClick={toggleMobileSidebar}
          onCollapseClick={toggleSidebar}
          isSidebarCollapsed={!sidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;