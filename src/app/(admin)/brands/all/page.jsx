import CategoryForm from '@/components/category/CategoryForm';
import CategoryList from '@/components/category/CategoryList';
import React, { useState } from 'react';


const CategoriesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [parentCategory, setParentCategory] = useState(null);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setEditingCategory(null);
    setShowSubcategoryForm(false);
    setParentCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowSubcategoryForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSubcategory = (category) => {
    setParentCategory(category);
    setShowSubcategoryForm(true);
    setEditingCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Category Management System
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {showSubcategoryForm && parentCategory && (
              <div className="mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm text-blue-700">
                    Adding subcategory to: <strong>{parentCategory.name}</strong>
                  </p>
                  <button
                    onClick={() => setShowSubcategoryForm(false)}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Cancel
                  </button>
                </div>
                <CategoryForm
                  key={`sub-${parentCategory._id}`}
                  onSuccess={handleSuccess}
                  editingCategory={null}
                  parentCategoryId={parentCategory._id}
                />
              </div>
            )}
            
            {(editingCategory || (!showSubcategoryForm && !editingCategory)) && (
              <CategoryForm
                key={refreshKey}
                onSuccess={handleSuccess}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
              />
            )}
          </div>
          
          <div>
            <CategoryList
              key={refreshKey}
              onEdit={handleEdit}
              onAddSubcategory={handleAddSubcategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;