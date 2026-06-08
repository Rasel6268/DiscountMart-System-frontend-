import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import api from "@/config/api";
import { useAuth } from "@/AuthProvider/AuthProvider";
import {
  FaEye,
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import ProtectedRoute from "../ProtectedRoute";

const MyOrder = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch my orders
  const {
    data: ordersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myOrders", user?._id],
    queryFn: async () => {
      if (!user?._id) return { data: [] };
      const res = await api.get(`/orders/myorder/${user._id}`);
      return res.data;
    },
    enabled: !!user?._id,
  });

  // Format price in BDT (Taka)
  const formatPriceBDT = (price) => {
    if (!price) return "৳0";
    return `৳${Math.round(price).toLocaleString()}`;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "processing":
        return <FaBoxOpen className="text-blue-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBoxOpen className="text-gray-500" />;
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Pagination logic
  const allOrders = ordersData?.data || [];
  const totalOrders = allOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Get current page orders
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Statistics
  const stats = {
    total: totalOrders,
    pending: allOrders.filter((o) => o.orderStatus === "pending").length,
    delivered: allOrders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: allOrders.filter((o) => o.orderStatus === "cancelled").length,
    totalSpent: allOrders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">
          Please login to view your orders
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading your orders...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="text-lg text-red-500 mb-4">Error loading orders</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage all your orders</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Pending Orders</div>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Delivered Orders</div>
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Spent</div>
            <div className="text-2xl font-bold">
              {formatPriceBDT(stats.totalSpent)}
            </div>
          </div>
        </div>

        {/* Items Per Page Selector */}
        {totalOrders > 0 && (
          <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, totalOrders)} of {totalOrders} orders
            </div>
          </div>
        )}

        {/* Orders List */}
        {currentOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBoxOpen className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Placed on</p>
                      <p className="font-semibold">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-lg">
                        {formatPriceBDT(order.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.orderStatus)}
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment</p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment?.status)}`}
                      >
                        {order.payment?.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                      <FaEye /> View Details
                    </button>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4">
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 border rounded-lg p-2 min-w-[200px]"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-xs font-semibold">
                              {formatPriceBDT(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="flex items-center justify-center min-w-[100px] border rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600">
                            +{order.items.length - 3} more
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md flex items-center gap-1 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <FaChevronLeft className="text-sm" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === "number" && goToPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : page === "..."
                            ? "bg-transparent cursor-default"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md flex items-center gap-1 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-gray-600">
                    Order ID: {selectedOrder.orderId}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Order Status Timeline */}
                {selectedOrder.statusTimeline &&
                  selectedOrder.statusTimeline.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                        Order Timeline
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.statusTimeline.map((timeline, idx) => (
                          <div
                            key={idx}
                            className="flex gap-4 p-3 bg-gray-50 rounded"
                          >
                            <div className="w-40 shrink-0">
                              <p className="text-sm font-medium">
                                {new Date(timeline.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(timeline.status)}
                                <p className="font-semibold capitalize">
                                  {timeline.status}
                                </p>
                              </div>
                              {timeline.note && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {timeline.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">
                      {selectedOrder.shippingAddress?.name}
                    </p>
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress?.addressLine1}
                    </p>
                    {selectedOrder.shippingAddress?.addressLine2 && (
                      <p className="text-gray-600">
                        {selectedOrder.shippingAddress?.addressLine2}
                      </p>
                    )}
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.area}
                    </p>
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress?.country} -{" "}
                      {selectedOrder.shippingAddress?.postCode}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Phone: {selectedOrder.shippingAddress?.phone}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex gap-4">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              SKU: {item.sku}
                            </p>
                            {item.size && (
                              <p className="text-sm text-gray-600">
                                Size: {item.size.name}
                              </p>
                            )}
                            {item.color && (
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: item.color.hexCode,
                                  }}
                                />
                                <span className="text-sm text-gray-600">
                                  {item.color.name}
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Unit Price: {formatPriceBDT(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatPriceBDT(item.totalPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                    Order Summary
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formatPriceBDT(selectedOrder.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Cost:</span>
                        <span className="font-medium">
                          {formatPriceBDT(selectedOrder.shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">
                          {formatPriceBDT(selectedOrder.tax)}
                        </span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-{formatPriceBDT(selectedOrder.discount)}</span>
                        </div>
                      )}
                      {selectedOrder.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Coupon Discount:</span>
                          <span>
                            -{formatPriceBDT(selectedOrder.couponDiscount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t mt-2">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-lg">
                          {formatPriceBDT(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                {selectedOrder.payment && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                      Payment Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-medium uppercase">
                          {selectedOrder.payment.method}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.payment.status)}`}
                        >
                          {selectedOrder.payment.status?.toUpperCase()}
                        </span>
                      </div>
                      {selectedOrder.payment.transactionId && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">
                            Transaction ID
                          </p>
                          <p className="font-medium text-sm">
                            {selectedOrder.payment.transactionId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Print Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default MyOrder;
