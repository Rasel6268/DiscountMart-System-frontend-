import React, { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { X, Plus, Loader2, Package, DollarSign, Box, Image, Truck, Calendar } from 'lucide-react';

const ProductForm = ({ onSuccess, editingProduct, setEditingProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    shortDescription: '',
    
    // Pricing
    regularPrice: '',
    discountPrice: '',
    discountStartDate: '',
    discountEndDate: '',
    costPerItem: '',
    
    // Categories
    category: '',
    subcategory: '',
    brand: '',
    
    // Inventory
    sku: '',
    quantity: '',
    lowStockThreshold: '10',
    trackInventory: true,
    allowBackorder: false,
    
    // Images
    images: [],
    
    // Status
    status: 'draft',
    isActive: true,
    isFeatured: false,
    isPublished: false,
    isFreeShipping: false,
    
    // Variants (optional)
    variants: [],
  });
  
  const [errors, setErrors] = useState({});
  const [imageInput, setImageInput] = useState({ url: '', alt: '' });
  const [showVariants, setShowVariants] = useState(false);
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  
  // Get subcategories based on selected category
  const selectedCategory = categories.find(c => c._id === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        shortDescription: editingProduct.shortDescription || '',
        regularPrice: editingProduct.regularPrice || '',
        discountPrice: editingProduct.discountPrice || '',
        discountStartDate: editingProduct.discountStartDate ? editingProduct.discountStartDate.split('T')[0] : '',
        discountEndDate: editingProduct.discountEndDate ? editingProduct.discountEndDate.split('T')[0] : '',
        costPerItem: editingProduct.costPerItem || '',
        category: editingProduct.category?._id || editingProduct.category || '',
        subcategory: editingProduct.subcategory?._id || editingProduct.subcategory || '',
        brand: editingProduct.brand?._id || editingProduct.brand || '',
        sku: editingProduct.sku || '',
        quantity: editingProduct.quantity || '',
        lowStockThreshold: editingProduct.lowStockThreshold || '10',
        trackInventory: editingProduct.trackInventory !== false,
        allowBackorder: editingProduct.allowBackorder || false,
        images: editingProduct.images || [],
        status: editingProduct.status || 'draft',
        isActive: editingProduct.isActive !== false,
        isFeatured: editingProduct.isFeatured || false,
        isPublished: editingProduct.isPublished || false,
        isFreeShipping: editingProduct.isFreeShipping || false,
        variants: editingProduct.variants || [],
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddImage = () => {
    if (imageInput.url) {
      const newImage = {
        url: imageInput.url,
        alt: imageInput.alt,
        isPrimary: formData.images.length === 0
      };
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setImageInput({ url: '', alt: '' });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.regularPrice) newErrors.regularPrice = 'Regular price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    
    if (formData.discountPrice && parseFloat(formData.discountPrice) >= parseFloat(formData.regularPrice)) {
      newErrors.discountPrice = 'Discount price must be less than regular price';
    }
    
    if (formData.discountStartDate && formData.discountEndDate && formData.discountStartDate > formData.discountEndDate) {
      newErrors.discountEndDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      regularPrice: parseFloat(formData.regularPrice),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      costPerItem: formData.costPerItem ? parseFloat(formData.costPerItem) : null,
      quantity: parseInt(formData.quantity) || 0,
      lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
    };
    
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct._id,
          data: submitData
        });
      } else {
        await createProduct.mutateAsync(submitData);
      }
      
      if (onSuccess) onSuccess();
      if (setEditingProduct) setEditingProduct(null);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const isLoading = createProduct.isLoading || updateProduct.isLoading;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package size={24} className="text-blue-600" />
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= BASIC INFORMATION ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="Enter product description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="2"
                maxLength="200"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="Brief description (max 200 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.shortDescription?.length || 0}/200 characters
              </p>
            </div>
          </div>
        </div>
        
        {/* ================= PRICING ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <DollarSign size={18} className="text-green-600" />
            Pricing
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Regular Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="0.00"
              />
              {errors.regularPrice && <p className="text-red-500 text-xs mt-1">{errors.regularPrice}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount Price
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="0.00"
              />
              {errors.discountPrice && <p className="text-red-500 text-xs mt-1">{errors.discountPrice}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Calendar size={14} />
                Discount Start Date
              </label>
              <input
                type="date"
                name="discountStartDate"
                value={formData.discountStartDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Calendar size={14} />
                Discount End Date
              </label>
              <input
                type="date"
                name="discountEndDate"
                value={formData.discountEndDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              {errors.discountEndDate && <p className="text-red-500 text-xs mt-1">{errors.discountEndDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cost Per Item
              </label>
              <input
                type="number"
                name="costPerItem"
                value={formData.costPerItem}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        
        {/* ================= CATEGORY & BRAND ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Box size={18} className="text-purple-600" />
            Category & Brand
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || !formData.category}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select Brand</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>
          </div>
        </div>
        
        {/* ================= INVENTORY ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Package size={18} className="text-orange-600" />
            Inventory
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="Unique product code"
              />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                placeholder="10"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="trackInventory"
                  checked={formData.trackInventory}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Track Inventory</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="allowBackorder"
                  checked={formData.allowBackorder}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Allow Backorder</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* ================= IMAGES ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Image size={18} className="text-pink-600" />
            Product Images
          </h3>
          
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL"
                value={imageInput.url}
                onChange={(e) => setImageInput({ ...imageInput, url: e.target.value })}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Alt text"
                value={imageInput.alt}
                onChange={(e) => setImageInput({ ...imageInput, alt: e.target.value })}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500">Add product images (first image will be primary by default)</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative border rounded-lg p-2">
                <img src={img.url} alt={img.alt} className="h-24 w-full object-cover rounded" />
                <div className="mt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(idx)}
                    className={`text-xs px-2 py-1 rounded ${img.isPrimary ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    {img.isPrimary ? 'Primary' : 'Set Primary'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* ================= SHIPPING ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Truck size={18} className="text-teal-600" />
            Shipping
          </h3>
          
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFreeShipping"
                checked={formData.isFreeShipping}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">Free Shipping</span>
            </label>
          </div>
        </div>
        
        {/* ================= STATUS ================= */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Status & Visibility</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">Featured Product</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>
        
        {/* ================= SUBMIT BUTTON ================= */}
        <div className="sticky bottom-0 bg-white pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {editingProduct ? 'Updating Product...' : 'Creating Product...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Plus size={18} />
                {editingProduct ? 'Update Product' : 'Create Product'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;