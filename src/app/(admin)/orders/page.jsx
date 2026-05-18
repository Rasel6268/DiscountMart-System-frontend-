'use client';
import api from '@/config/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

const AdminOrderPage = () => {
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');

    // Fetch orders
    const { data: orders, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin-orders', filterStatus],
        queryFn: async () => {
            const url = filterStatus === 'all' 
                ? '/orders/allorder' 
                : `/orders/allorder?status=${filterStatus}`;
            const res = await api.get(url);
            return res.data;
        }
    });

    // Update order status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status, note }) => {
            const res = await api.put(`/orders/${orderId}/status`, { status, note });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
            setShowStatusModal(false);
            setSelectedOrder(null);
            setNewStatus('');
            setStatusNote('');
        },
    });

    // Delete order mutation
    const deleteOrderMutation = useMutation({
        mutationFn: async (orderId) => {
            const res = await api.delete(`/orders/${orderId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
        },
    });

    const handleStatusUpdate = () => {
        if (selectedOrder && newStatus) {
            updateStatusMutation.mutate({
                orderId: selectedOrder._id,
                status: newStatus,
                note: statusNote
            });
        }
    };

    const handleDeleteOrder = (orderId) => {
        if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            deleteOrderMutation.mutate(orderId);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
        return status === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading orders...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-500">Error loading orders</div>
                <button onClick={() => refetch()} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Retry
                </button>
            </div>
        );
    }

    const orderList = orders?.data || [];

    // Statistics
    const stats = {
        total: orderList.length,
        pending: orderList.filter(o => o.orderStatus === 'pending').length,
        processing: orderList.filter(o => o.orderStatus === 'processing').length,
        delivered: orderList.filter(o => o.orderStatus === 'delivered').length,
        cancelled: orderList.filter(o => o.orderStatus === 'cancelled').length,
        totalRevenue: orderList.reduce((sum, o) => sum + (o.total || 0), 0)
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Order Management</h1>
                <button 
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Total Orders</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Processing</div>
                    <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Delivered</div>
                    <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Cancelled</div>
                    <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    All Orders
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilterStatus('processing')}
                    className={`px-4 py-2 rounded ${filterStatus === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Processing
                </button>
                <button
                    onClick={() => setFilterStatus('shipped')}
                    className={`px-4 py-2 rounded ${filterStatus === 'shipped' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                >
                    Shipped
                </button>
                <button
                    onClick={() => setFilterStatus('delivered')}
                    className={`px-4 py-2 rounded ${filterStatus === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                    Delivered
                </button>
                <button
                    onClick={() => setFilterStatus('cancelled')}
                    className={`px-4 py-2 rounded ${filterStatus === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    Cancelled
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orderList.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{order.user?.name || order.shippingAddress?.name}</div>
                                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">${order.total?.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.payment?.status)}`}>
                                        {order.payment?.status || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowViewModal(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setNewStatus(order.orderStatus);
                                            setShowStatusModal(true);
                                        }}
                                        className="text-green-600 hover:text-green-900 mr-3"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Order Modal */}
            {showViewModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Order Details</h2>
                                <p className="text-gray-600">Order ID: {selectedOrder.orderId}</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Order Status Banner */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">Order Status:</span>
                                    <span className={`ml-2 px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}>
                                        {selectedOrder.orderStatus.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Payment Status:</span>
                                    <span className={`ml-2 px-2 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.payment?.status)}`}>
                                        {selectedOrder.payment?.status?.toUpperCase() || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Payment Method:</span>
                                    <span className="ml-2 text-sm font-semibold uppercase">
                                        {selectedOrder.payment?.method || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Customer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-medium">{selectedOrder.user?.name || selectedOrder.shippingAddress?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{selectedOrder.user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium">{selectedOrder.user?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">IP Address</p>
                                        <p className="font-medium">{selectedOrder.ipAddress || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Shipping Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Address Line 1</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress?.addressLine1}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Address Line 2</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress?.addressLine2 || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">City</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress?.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Area</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress?.area}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Post Code</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress?.postCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Country</p>
                                        <p className="font-medium">{selectedOrder.shippingAddress?.country}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Shipping Area</p>
                                        <p className="font-medium">{selectedOrder.shippingArea || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={item._id || index} className="border rounded-lg p-4">
                                            <div className="flex gap-4">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    className="w-24 h-24 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                                                    <p className="text-sm text-gray-600">Size: {item.size?.name || 'N/A'}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    <p className="text-sm text-gray-600">Unit Price: ${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg">${item.totalPrice.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Order Summary</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">${selectedOrder.subtotal?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping Cost:</span>
                                            <span className="font-medium">${selectedOrder.shippingCost?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax:</span>
                                            <span className="font-medium">${selectedOrder.tax?.toFixed(2)}</span>
                                        </div>
                                        {selectedOrder.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount:</span>
                                                <span>-${selectedOrder.discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {selectedOrder.couponDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Coupon Discount:</span>
                                                <span>-${selectedOrder.couponDiscount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t mt-2">
                                            <span className="font-bold text-lg">Total:</span>
                                            <span className="font-bold text-lg">${selectedOrder.total?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Timeline */}
                            {selectedOrder.statusTimeline && selectedOrder.statusTimeline.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3 border-b pb-2">Order Timeline</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.statusTimeline.map((timeline, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded">
                                                <div className="w-40 shrink-0">
                                                    <p className="text-sm font-medium">
                                                        {new Date(timeline.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold capitalize">{timeline.status}</p>
                                                    {timeline.note && (
                                                        <p className="text-sm text-gray-600 mt-1">{timeline.note}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Updated by: {timeline.updatedBy}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Additional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Created At</p>
                                        <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">User Agent</p>
                                        <p className="font-medium text-sm">{selectedOrder.userAgent || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Notes</p>
                                        <p className="font-medium">{selectedOrder.notes || 'No notes'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedOrder(selectedOrder);
                                    setNewStatus(selectedOrder.orderStatus);
                                    setShowStatusModal(true);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Update Status
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

            {/* Status Update Modal */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Update Order Status - {selectedOrder.orderId}
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Note (Optional)
                                    </label>
                                    <textarea
                                        value={statusNote}
                                        onChange={(e) => setStatusNote(e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Add a note about this status update..."
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updateStatusMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowStatusModal(false);
                                        setSelectedOrder(null);
                                        setNewStatus('');
                                        setStatusNote('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrderPage;