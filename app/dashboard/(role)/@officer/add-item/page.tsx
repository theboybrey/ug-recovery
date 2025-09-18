"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/hooks/userContext";

const initialItem = {
  name: "",
  description: "",
  category: "Electronics",
  foundAt: "",
  checkpointOffice: "",
  date: "",
  retentionPeriod: 7,
  status: "Available",
  founder: "",
  features: [],
  images: [] as string[], // <-- fix type here
  mainImage: "",
};

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Accessories",
  "Documents",
  "Bags",
  "Keys",
  "Others",
];

const AddItemPage = () => {
  const { lostItems, setLostItems, user } = useAuthContext();
  const [item, setItem] = useState(initialItem);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setItem((prev) => ({
      ...prev,
      images: previews,
      mainImage: previews[0] || "",
    }));
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newItem = {
      ...item,
      id: lostItems.length + 1,
      founder: user?.name || "Officer",
      date: item.date || new Date().toISOString().slice(0, 10),
      keyedInDate: new Date().toISOString().slice(0, 10),
      mainImage: item.images[0] || "",
      status: "Available" as
        | "Available"
        | "Pending Verification"
        | "Claimed"
        | "Expired",
    };
    setLostItems([...lostItems, newItem]);
    setSuccess(true);
    setItem(initialItem);
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-left justify-left max-w-full">
      <form
        className="bg-card-bg rounded-xl p-8 shadow-sm border border-card-border w-full max-w-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-primary-700">
          Add New Item
        </h2>
        {success && (
          <div className="mb-4 p-3 bg-success-bg text-success rounded-lg">
            Item added successfully!
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Item name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Item description"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Category
          </label>
          <select
            name="category"
            value={item.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Found At
          </label>
          <input
            type="text"
            name="foundAt"
            value={item.foundAt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Location found"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Checkpoint Office
          </label>
          <input
            type="text"
            name="checkpointOffice"
            value={item.checkpointOffice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Checkpoint office"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Date Found
          </label>
          <input
            type="date"
            name="date"
            value={item.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Retention Period (days)
          </label>
          <input
            type="number"
            name="retentionPeriod"
            value={item.retentionPeriod}
            onChange={handleChange}
            min={1}
            max={30}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">
            Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {imagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-lg overflow-hidden border border-card-border bg-surface flex items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-4"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItemPage;
