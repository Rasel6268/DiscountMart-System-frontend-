"use client";
import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-4 w-64 bg-gray-200 rounded-lg mt-2"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-28 bg-gray-200 rounded mt-2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-36 bg-gray-200 rounded mt-2"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded mt-1"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Category & Top Products Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table Skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              <div className="h-3 w-48 bg-gray-200 rounded mt-1"></div>
            </div>
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-xl shadow-lg p-6 h-28"></div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;