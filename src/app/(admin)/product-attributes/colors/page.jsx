"use client";
import api from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ColorPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newColor, setNewColor] = useState({
    name: "",
    hexCode: "#000000",
    isActive: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {data: colors,isLoading} = useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      try {
        const res = await api.get("/colors/all");
        return res.data.data;
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch colors");
      }
    },
  });
  if(isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">  
          <svg className="animate-spin h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>    
            </svg>
        </div>
    )      
    }
  

  // Filter colors based on search and status
  const filteredColors = colors.filter((color) => {
    const matchesSearch = color.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && color.isActive) ||
      (filterStatus === "inactive" && !color.isActive);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentColors = filteredColors.slice(startIndex, endIndex);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewColor((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddColor = async () => {
    try {
      if (!newColor.name.trim()) {
        toast.error("Please enter a color name");
        return;
      }

      const colorToAdd = {
        ...newColor,
      };
      const res = await api.post("/colors/create", colorToAdd);
      if (res.data) {
        toast.success("Color added successfully");
        setShowAddModal(false);
        setNewColor({ name: "", hexCode: "#000000", isActive: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add color");
    }
  };

  const handleDeleteColor = (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      setColors(colors.filter((color) => color._id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setColors(
      colors.map((color) =>
        color._id === id ? { ...color, isActive: !color.isActive } : color,
      ),
    );
  };
  const shoeColors = [
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Gray", code: "#808080" },
    { name: "Light Gray", code: "#D3D3D3" },
    { name: "Charcoal", code: "#36454F" },
    { name: "Silver", code: "#C0C0C0" },
    { name: "Beige", code: "#F5F5DC" },
    { name: "Cream", code: "#FFFDD0" },

    { name: "Red", code: "#FF0000" },
    { name: "Dark Red", code: "#8B0000" },
    { name: "Burgundy", code: "#800020" },

    { name: "Blue", code: "#0000FF" },
    { name: "Navy Blue", code: "#000080" },
    { name: "Sky Blue", code: "#87CEEB" },
    { name: "Royal Blue", code: "#4169E1" },

    { name: "Green", code: "#008000" },
    { name: "Olive", code: "#808000" },
    { name: "Mint", code: "#98FF98" },
    { name: "Neon Green", code: "#39FF14" },

    { name: "Yellow", code: "#FFFF00" },
    { name: "Mustard", code: "#FFDB58" },

    { name: "Orange", code: "#FFA500" },
    { name: "Coral", code: "#FF7F50" },

    { name: "Pink", code: "#FFC0CB" },
    { name: "Hot Pink", code: "#FF69B4" },

    { name: "Purple", code: "#800080" },
    { name: "Lavender", code: "#E6E6FA" },

    { name: "Brown", code: "#8B4513" },
    { name: "Dark Brown", code: "#654321" },
    { name: "Chocolate", code: "#7B3F00" },
    { name: "Tan", code: "#D2B48C" },
    { name: "Camel", code: "#C19A6B" },
    { name: "Khaki", code: "#C3B091" },
    { name: "Sand", code: "#F4A460" },
    { name: "Coffee", code: "#6F4E37" },

    { name: "Gold", code: "#FFD700" },
    { name: "Rose Gold", code: "#B76E79" },
    { name: "Metallic Silver", code: "#BCC6CC" },
    { name: "Platinum", code: "#E5E4E2" },
    { name: "Bronze", code: "#CD7F32" },

    { name: "Teal", code: "#008080" },
    { name: "Cyan", code: "#00FFFF" },
    { name: "Turquoise", code: "#40E0D0" },
    { name: "Lime", code: "#32CD32" },
    { name: "Peach", code: "#FFE5B4" },
    { name: "Violet", code: "#8F00FF" },
    { name: "Neon Pink", code: "#FF10F0" },
    { name: "Ice Blue", code: "#99FFFF" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Color Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your color collection</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Color
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search colors..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Colors</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-semibold text-gray-900">
                {filteredColors.length}
              </span>{" "}
              colors
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hex Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RGB Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentColors.length > 0 ? (
                  currentColors.map((color, index) => (
                    <tr
                      key={color._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="w-8 h-8 rounded-full shadow-sm border border-gray-200"
                          style={{ backgroundColor: color.hexCode }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {color.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {color.hexCode}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {hexToRgb(color.hexCode)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(color._id)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            color.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {color.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {color.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors">
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteColor(color._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">No colors found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredColors.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredColors.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredColors.length}</span>{" "}
                  results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Color Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity"
            onClick={() => setShowAddModal(false)}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Add New Color
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Create a new color for your collection
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex justify-center">
                    <div
                      className="w-24 h-24 rounded-full shadow-lg border-4 border-white transition-all duration-300"
                      style={{ backgroundColor: newColor.hexCode }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newColor.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Crimson Red"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hex Code
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        name="hexCode"
                        value={newColor.hexCode}
                        onChange={handleInputChange}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        name="hexCode"
                        value={newColor.hexCode}
                        onChange={handleInputChange}
                        placeholder="#000000"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="font-medium text-gray-700">
                        Active Status
                      </label>
                      <p className="text-sm text-gray-500">
                        Enable to make this color available
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={newColor.isActive}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Color Suggestions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {shoeColors.map((color) => (
                        <button
                          key={color.code}
                          onClick={() =>
                            setNewColor((prev) => ({
                              ...prev,
                              hexCode: color.code,
                              name: color.name,
                            }))
                          }
                          className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddColor}
                    className="flex-1 px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                  >
                    Add Color
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  if (!hex) return "N/A";
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "N/A";
}

export default ColorPage;
