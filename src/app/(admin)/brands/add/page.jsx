"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function BrandAddPage() {
  const [form, setForm] = useState({
    name: "",
    logo: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // CREATE BRAND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/brands", form);

      setForm({
        name: "",
        logo: "",
        description: "",
      });
      toast.success('Brand Create successfull')

      router.push("/brands/all");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Add New Brand
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-5 rounded-xl space-y-4"
      >
        <input
          type="text"
          placeholder="Brand Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Logo URL"
          className="w-full border p-2 rounded"
          value={form.logo}
          onChange={(e) =>
            setForm({ ...form, logo: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Brand"}
        </button>
      </form>
    </div>
  );
}