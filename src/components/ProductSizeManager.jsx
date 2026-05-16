// components/admin/ProductSizeManager.jsx
import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const SIZE_TYPES = [
  { value: 'men', label: "Men's Sizes", icon: '👨' },
  { value: 'women', label: "Women's Sizes", icon: '👩' },
  { value: 'unisex', label: 'Unisex Sizes', icon: '👥' },
  { value: 'kids', label: "Kids' Sizes", icon: '👶' },
];


const ProductSizeManager = ({ sizes = [], onSizesChange, disabled = false }) => {
  const [editingSize, setEditingSize] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSize, setNewSize] = useState({
    name: '',
    type: 'unisex',
    quantity: 0,
    extraPrice: 0,
    sku: '',
  });

  const handleAddSize = () => {
    if (!newSize.name.trim()) {
      alert('Size name is required');
      return;
    }

    // Check for duplicate
    if (sizes.some(s => s.name === newSize.name)) {
      alert(`Size "${newSize.name}" already exists`);
      return;
    }

    const sizeToAdd = {
      ...newSize,
      name: newSize.name.toUpperCase(),
      isActive: true,
    };

    const updatedSizes = [...sizes, sizeToAdd];
    onSizesChange(updatedSizes);
    
    // Reset form
    setNewSize({
      name: '',
      type: 'unisex',
      quantity: 0,
      extraPrice: 0,
      sku: '',
    });
    setShowAddForm(false);
  };

  const handleUpdateSize = () => {
    if (!editingSize) return;

    const updatedSizes = sizes.map(s => 
      s.name === editingSize.originalName ? { ...editingSize, name: editingSize.name.toUpperCase() } : s
    );
    onSizesChange(updatedSizes);
    setEditingSize(null);
  };

  const handleRemoveSize = (sizeName) => {
    if (confirm(`Remove size "${sizeName}"?`)) {
      const updatedSizes = sizes.filter(s => s.name !== sizeName);
      onSizesChange(updatedSizes);
    }
  };

  const groupedSizes = sizes.reduce((acc, size) => {
    if (!acc[size.type]) acc[size.type] = [];
    acc[size.type].push(size);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Size Management</h3>
          <p className="text-sm text-gray-500">Add sizes with quantities and extra pricing</p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <FaPlus /> Add Size
          </button>
        )}
      </div>

      {/* Add Size Form */}
      {showAddForm && !disabled && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size Name</label>
              <input
                type="text"
                value={newSize.name}
                onChange={(e) => setNewSize({ ...newSize, name: e.target.value.toUpperCase() })}
                placeholder="e.g., M, XL, 42"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newSize.type}
                onChange={(e) => setNewSize({ ...newSize, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              >
                {SIZE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={newSize.quantity}
                onChange={(e) => setNewSize({ ...newSize, quantity: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extra Price (৳)</label>
              <input
                type="number"
                value={newSize.extraPrice}
                onChange={(e) => setNewSize({ ...newSize, extraPrice: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
              <input
                type="text"
                value={newSize.sku}
                onChange={(e) => setNewSize({ ...newSize, sku: e.target.value })}
                placeholder="Unique SKU"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Add Size
            </button>
          </div>
        </div>
      )}
      {/* Sizes List */}
      {sizes.length > 0 && (
        <div className="space-y-4">
          {SIZE_TYPES.map(type => {
            const typeSizes = groupedSizes[type.value] || [];
            if (typeSizes.length === 0) return null;
            
            return (
              <div key={type.value} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="font-medium text-gray-800">
                    {type.icon} {type.label}
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Size</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Extra Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">SKU</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {typeSizes.map((size) => (
                        <tr key={size.name} className="border-t">
                          {editingSize?.originalName === size.name ? (
                            <>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={editingSize.name}
                                  onChange={(e) => setEditingSize({ ...editingSize, name: e.target.value })}
                                  className="w-24 px-2 py-1 border rounded"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={editingSize.quantity}
                                  onChange={(e) => setEditingSize({ ...editingSize, quantity: parseInt(e.target.value) || 0 })}
                                  className="w-24 px-2 py-1 border rounded"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  value={editingSize.extraPrice}
                                  onChange={(e) => setEditingSize({ ...editingSize, extraPrice: parseInt(e.target.value) || 0 })}
                                  className="w-24 px-2 py-1 border rounded"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={editingSize.sku || ''}
                                  onChange={(e) => setEditingSize({ ...editingSize, sku: e.target.value })}
                                  className="w-32 px-2 py-1 border rounded"
                                />
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={handleUpdateSize}
                                  className="text-green-600 hover:text-green-700 mx-1"
                                >
                                  <FaSave />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSize(null)}
                                  className="text-gray-600 hover:text-gray-700 mx-1"
                                >
                                  <FaTimes />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-2 font-medium">{size.name}</td>
                              <td className="px-4 py-2">{size.quantity}</td>
                              <td className="px-4 py-2">
                                {size.extraPrice > 0 ? `৳${size.extraPrice}` : '-'}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">{size.sku || '-'}</td>
                              <td className="px-4 py-2 text-center">
                                {!disabled && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setEditingSize({ ...size, originalName: size.name })}
                                      className="text-blue-600 hover:text-blue-700 mx-1"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSize(size.name)}
                                      className="text-red-600 hover:text-red-700 mx-1"
                                    >
                                      <FaTrash />
                                    </button>
                                  </>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {sizes.length > 0 && (
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-sm text-amber-800">
            Total Inventory: {sizes.reduce((sum, size) => sum + size.quantity, 0)} units
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Total product quantity will be automatically calculated from all sizes
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSizeManager;