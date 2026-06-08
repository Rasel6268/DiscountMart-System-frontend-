'use client';
import api from '@/config/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUserTag, FaEdit, FaTrash, FaSearch, FaUserShield, FaUser, FaUserCircle } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const AdminUsersPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        }
    });

    // Fetch all users
    const { data: users, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await api.get('/auth/all-users');
            return res.data.users;
        }
    });
    console.log("Fetched users:", users);

    // Update user role mutation
    const updateUserRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            const res = await api.put(`/auth/make-admin/${userId}`, { role });
            console.log("Update role response:", res.data);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'User role updated successfully!');
            queryClient.invalidateQueries(['admin-users']);
            setShowEditModal(false);
            setSelectedUser(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update user role');
        }
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const res = await api.delete(`/users/${userId}`);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'User deleted successfully!');
            queryClient.invalidateQueries(['admin-users']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    });

    const handleUpdateRole = () => {
        if (selectedUser) {
            updateUserRoleMutation.mutate({
                userId: selectedUser._id,
                role: editFormData.role
            });
        }
    };

    const handleDeleteUser = (userId, userName) => {
        toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
                <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
                <p className="text-gray-600 mb-4">
                    Are you sure you want to delete user <span className="font-semibold">{userName}</span>? 
                    This action cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            deleteUserMutation.mutate(userId);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
        });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'user',
            address: {
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                country: user.address?.country || '',
                zipCode: user.address?.zipCode || ''
            }
        });
        setShowEditModal(true);
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            user: 'bg-blue-100 text-blue-800',
            moderator: 'bg-green-100 text-green-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'admin':
                return <FaUserShield className="text-purple-500" />;
            case 'user':
                return <FaUser className="text-blue-500" />;
            default:
                return <FaUserCircle className="text-gray-500" />;
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter and search users
    const filteredUsers = React.useMemo(() => {
        if (!users) return [];
        
        let filtered = users;
        
        // Filter by role
        if (filterRole !== 'all') {
            filtered = filtered.filter(user => user.role === filterRole);
        }
        
        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(user => 
                user.name?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term) ||
                user.phone?.includes(term)
            );
        }
        
        return filtered;
    }, [users, filterRole, searchTerm]);

    // Show error toast when fetch fails
    React.useEffect(() => {
        if (isError) {
            toast.error(error?.message || 'Failed to load users');
        }
    }, [isError, error]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading users...</div>
            </div>
        );
    }

    // Statistics
    const stats = {
        total: filteredUsers.length,
        admins: filteredUsers.filter(u => u.role === 'admin').length,
        users: filteredUsers.filter(u => u.role === 'user').length,
        totalUsers: users?.length || 0
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage all registered users</p>
                </div>
                <button 
                    onClick={() => {
                        refetch();
                        toast.success('Refreshing user list...');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Total Users</div>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Current View</div>
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Admins</div>
                    <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Regular Users</div>
                    <div className="text-2xl font-bold text-green-600">{stats.users}</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-50">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterRole('all')}
                        className={`px-4 py-2 rounded-lg ${filterRole === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        All Roles
                    </button>
                    <button
                        onClick={() => setFilterRole('admin')}
                        className={`px-4 py-2 rounded-lg ${filterRole === 'admin' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                    >
                        Admins
                    </button>
                    <button
                        onClick={() => setFilterRole('user')}
                        className={`px-4 py-2 rounded-lg ${filterRole === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Users
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10">
                                                    {user.image ? (
                                                        <img className="h-10 w-10 rounded-full" src={user.image} alt={user.name} />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <FaUserCircle className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">ID: {user._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaEnvelope className="mr-2 text-gray-400" />
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaPhone className="mr-2 text-gray-400" />
                                                <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getRoleIcon(user.role)}
                                                <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.address ? (
                                                <div className="flex items-start">
                                                    <FaMapMarkerAlt className="mr-2 text-gray-400 mt-0.5" />
                                                    <div className="text-sm text-gray-900">
                                                        {user.address.street && <div>{user.address.street}</div>}
                                                        <div className="text-xs text-gray-500">
                                                            {[user.address.city, user.address.state, user.address.country]
                                                                .filter(Boolean).join(', ')}
                                                            {user.address.zipCode && ` - ${user.address.zipCode}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">No address</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(user.lastLogin || user.updatedAt)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowViewModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                title="View Details"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                                title="Edit Role"
                                            >
                                                <FaEdit className="inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete User"
                                            >
                                                <FaTrash className="inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">User Details</h2>
                                <p className="text-gray-600">User ID: {selectedUser._id}</p>
                            </div>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            {/* User Avatar and Basic Info */}
                            <div className="flex items-center mb-6">
                                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    {selectedUser.image ? (
                                        <img className="h-20 w-20 rounded-full" src={selectedUser.image} alt={selectedUser.name} />
                                    ) : (
                                        <FaUserCircle className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-semibold">{selectedUser.name || 'No Name'}</h3>
                                    <div className="flex items-center mt-1">
                                        {getRoleIcon(selectedUser.role)}
                                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                                            {selectedUser.role || 'user'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-3 border-b pb-2">Contact Information</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <FaEnvelope className="w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="w-5 text-gray-400 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            {selectedUser.address && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold mb-3 border-b pb-2">Address</h4>
                                    <div className="flex items-start">
                                        <FaMapMarkerAlt className="w-5 text-gray-400 mr-3 mt-1" />
                                        <div>
                                            {selectedUser.address.street && (
                                                <p className="font-medium">{selectedUser.address.street}</p>
                                            )}
                                            <p className="text-gray-600">
                                                {[selectedUser.address.city, selectedUser.address.state, selectedUser.address.country]
                                                    .filter(Boolean).join(', ')}
                                            </p>
                                            {selectedUser.address.zipCode && (
                                                <p className="text-gray-600">ZIP Code: {selectedUser.address.zipCode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Account Information */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-3 border-b pb-2">Account Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Account Created</p>
                                        <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Login</p>
                                        <p className="font-medium">{formatDate(selectedUser.lastLogin || selectedUser.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                    openEditModal(selectedUser);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Edit Role
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Role Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Update User Role - {selectedUser.name}
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        User Role
                                    </label>
                                    <select
                                        value={editFormData.role}
                                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Changing user role will affect their permissions in the system.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleUpdateRole}
                                    disabled={updateUserRoleMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {updateUserRoleMutation.isPending ? 'Updating...' : 'Update Role'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedUser(null);
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

export default AdminUsersPage;