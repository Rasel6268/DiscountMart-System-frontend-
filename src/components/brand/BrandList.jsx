"use client";

import React, { useState } from "react";
import { useBrands, useDeleteBrand } from "@/hooks/useBrands";
import { Edit, Trash2, Loader2, Package, Search, Hash } from "lucide-react";
import toast from "react-hot-toast";

const BrandList = ({ onEdit }) => {
  const [searchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { data: brands = [], isLoading, error } = useBrands();
  const deleteBrand = useDeleteBrand();

  console.log(brands);
  const handleDelete = async (id, name) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-lg">
        <p>Delete "{name}"?</p>
        <div className="flex gap-2 mt-3">
          <button onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeletingId(id);
              await deleteBrand.mutateAsync(id);
              setDeletingId(null);
            }}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Package /> Brands ({brands.length})
      </h2>

      <div className="space-y-3">
        {brands.length === 0 && <p>No brands found</p>}

        {brands.map((brand) => (
          <div
            key={brand._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-semibold">{brand.name}</p>
              {brand.slug && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Hash size={12} /> {brand.slug}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => onEdit(brand)}>
                <Edit size={16} />
              </button>

              <button
                onClick={() => handleDelete(brand._id, brand.name)}
                disabled={deletingId === brand._id}
              >
                {deletingId === brand._id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;