"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { generateMockItems } from "@/utils/generateMockItems";

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

const PAGE_SIZE = 12;

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Image Gallery Component for the drawer
const ImageGallery = ({
  images,
  itemName,
}: {
  images: string[];
  itemName: string;
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="mb-6">
      {/* Main Image */}
      <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={`${itemName} - Image ${selectedImage + 1}`}
          width={400}
          height={300}
          className="w-full h-64 object-cover"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            e.currentTarget.src = "/assets/file.svg";
          }}
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary-600"
                  : "border-gray-200 hover:border-primary-300"
              }`}
            >
              <Image
                src={image}
                alt={`${itemName} thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/assets/file.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Item Details Drawer Component
const ItemDrawer = ({
  item,
  isOpen,
  onClose,
}: {
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!item) return null;

  const retentionStatus =
    item.retentionPeriod <= 7
      ? "urgent"
      : item.retentionPeriod <= 14
      ? "warning"
      : "normal";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-primary-600 text-white">
            <h2 className="text-xl font-bold">Item Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Image Gallery */}
            <ImageGallery images={item.images} itemName={item.name} />

            {/* Item Information */}
            <div className="space-y-6">
              {/* Title and Status */}
              <div>
                <h3 className="text-2xl font-bold text-text mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-800">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-text mb-2">Description</h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Features */}
              {item.features && (
                <div>
                  <h4 className="font-semibold text-text mb-2">Features</h4>
                  <ul className="list-disc list-inside text-text-muted text-sm space-y-1">
                    {item.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Location & Office Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-semibold text-text mb-1">Found At</h4>
                  <p className="text-text-muted text-sm">{item.foundAt}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-1">
                    Checkpoint Office
                  </h4>
                  <p className="text-text-muted text-sm">
                    {item.checkpointOffice}
                  </p>
                </div>
              </div>

              {/* Dates and Retention */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-semibold text-text mb-1">Date Found</h4>
                  <p className="text-text-muted text-sm">
                    {formatDate(item.date)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-1">
                    Keyed In Date
                  </h4>
                  <p className="text-text-muted text-sm">
                    {formatDate(item.keyedInDate)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text mb-1">
                    Retention Period
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-text-muted text-sm">
                      {item.retentionPeriod} days left
                    </p>
                    {retentionStatus === "urgent" && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                    {retentionStatus === "warning" && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Founder */}
              <div>
                <h4 className="font-semibold text-text mb-1">Found By</h4>
                <p className="text-text-muted text-sm">{item.founder}</p>
              </div>
            </div>
          </div>

          {/* Footer with Claim Button */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {item.status === "Available" ? (
              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Claim This Item
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
              >
                Item Not Available for Claim
              </button>
            )}
            <p className="text-xs text-text-muted mt-2 text-center">
              Visit {item.checkpointOffice} with valid ID to claim
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const ItemsBrowser = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [mockItems, setMockItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const loader = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate mock items only on client
  useEffect(() => {
    setMockItems(generateMockItems(60));
  }, []);

  // Pre-fill search and category from URL params on first load
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter logic (client only)
  useEffect(() => {
    if (!mockItems.length) return;
    const filteredItems = mockItems.filter((item) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);
      const matchSearch =
        !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchDateFrom = !dateFrom || item.date >= dateFrom;
      const matchDateTo = !dateTo || item.date <= dateTo;
      return matchCategory && matchSearch && matchDateFrom && matchDateTo;
    });
    setFiltered(filteredItems);
    setPage(1); // Reset page on filter change
  }, [mockItems, search, selectedCategories, dateFrom, dateTo]);

  // Paginate items
  useEffect(() => {
    setItems(filtered.slice(0, PAGE_SIZE * page));
  }, [filtered, page]);

  // Infinite scroll
  useEffect(() => {
    if (!loader.current) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && items.length < filtered.length) {
        setPage((p) => p + 1);
      }
    });
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [items, filtered.length]);

  // Open drawer if id param is present
  useEffect(() => {
    if (!mockItems.length) return;
    const id = searchParams.get("id");
    if (id) {
      const item = mockItems.find((itm) => itm.id === Number(id));
      if (item) {
        setSelectedItem(item);
        setIsDrawerOpen(true);
      }
    } else {
      setIsDrawerOpen(false);
      setSelectedItem(null);
    }
  }, [searchParams, mockItems]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const openItemDetails = (item: any) => {
    router.push(`/browser?id=${item.id}`);
  };

  const closeDrawer = () => {
    // Remove id param from URL
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("id");
    router.replace(`/browser${params.toString() ? `?${params}` : ""}`);
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Header Strip - UG Blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-600 z-50"></div>

      {/* Sidebar: Logo and Navigation */}
      <aside className="hidden md:flex w-64 min-w-[200px] bg-card-bg border-r border-card-border flex-col shadow-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-card-border bg-primary-600">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="UniRecover Logo"
              width={36}
              height={36}
              className="border border-white rounded bg-white"
            />
            <span className="font-bold text-xl tracking-wide text-white">
              UniRecover
            </span>
          </Link>
          <p className="text-primary-100 text-sm mt-2">
            University of Ghana Lost & Found
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          <h3 className="font-semibold text-text mb-4">Filter by Category</h3>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group hover:bg-primary-50 p-3 rounded-lg transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="w-4 h-4 text-primary-600 accent-primary-600 focus:ring-primary-500 focus:ring-2 rounded border-gray-300"
                />
                <span className="text-text font-medium group-hover:text-primary-700 transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Search and Filters Section */}
        <div className="bg-card-bg border-b border-card-border px-2 md:px-10 py-3 shadow-sm">
          {/* University Header */}
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-primary-600 mb-2">
              Lost & Found Items
            </h1>
            <p className="text-text-muted">
              Browse items found around the University of Ghana campus
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-text font-semibold text-sm">
                Search Items
              </label>
              <input
                type="text"
                placeholder="Search by name, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-card-border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-card-bg text-text placeholder-text-muted transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-text font-semibold text-sm">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-card-border rounded-lg px-3 py-3 bg-card-bg text-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-text font-semibold text-sm">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-card-border rounded-lg px-3 py-3 bg-card-bg text-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Categories (mobile) */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full border font-medium whitespace-nowrap transition-all ${
                  selectedCategories.includes(cat)
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "bg-surface text-text-muted border-card-border hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Items Section */}
        <div className="flex-1 overflow-y-auto px-2 md:px-10 py-6 bg-background">
          {items.length === 0 ? (
            <div className="text-center text-text-muted mt-12 text-lg">
              <div className="max-w-md mx-auto bg-card-bg p-8 rounded-xl border border-card-border shadow-sm">
                <div className="text-4xl mb-4">🔍</div>
                <p className="font-medium text-text mb-2">No items found</p>
                <p className="text-sm">
                  Try adjusting your search filters to find more items
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-text-muted text-sm">
                  Showing{" "}
                  <span className="font-medium text-text">{items.length}</span>{" "}
                  of{" "}
                  <span className="font-medium text-text">
                    {filtered.length}
                  </span>{" "}
                  items
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openItemDetails(item)}
                    className="bg-card-bg rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center border border-card-border transition-all duration-200 hover:border-primary-300 hover:-translate-y-1 group cursor-pointer"
                  >
                    <div className="mb-4 w-full h-32 bg-gray-50 rounded-xl overflow-hidden group-hover:bg-primary-50 transition-colors duration-200">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/file.svg";
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-text text-center group-hover:text-primary-700 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-800 mb-3 border border-primary-200">
                      {item.category}
                    </span>
                    <div className="text-center space-y-1 mb-4">
                      <p className="text-text-muted text-sm">
                        <span className="font-medium">Found at:</span>{" "}
                        {item.foundAt}
                      </p>
                      <p className="text-text-light text-xs">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loader for infinite scroll */}
              <div
                ref={loader}
                className="h-10 flex items-center justify-center mt-8"
              >
                {items.length < filtered.length && (
                  <div className="text-text-muted text-sm bg-card-bg px-4 py-2 rounded-full border border-card-border">
                    Loading more items...
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Item Details Drawer */}
      <ItemDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default ItemsBrowser;
