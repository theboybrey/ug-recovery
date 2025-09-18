"use client";

import {
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Images,
  Key,
  MapPin,
  Package,
  Search,
  Shirt,
  Smartphone,
  Tag,
  User,
  Watch,
  X,
} from "lucide-react";
import type { Category, LostItem } from "@/providers/auth-context";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { faker } from "@faker-js/faker";
import { generateMockItems } from "@/utils/generateMockItems";
import { useAuthContext } from "@/hooks/userContext";

const PAGE_SIZE = 12;

// Icon mapping for dynamic category rendering
const iconMap: { [key: string]: React.FC<any> } = {
  Smartphone,
  BookOpen,
  Shirt,
  Watch,
  FileText,
  Briefcase,
  Key,
  Package,
};

const categoryNames = [
  "Electronics",
  "Books",
  "Clothing",
  "Accessories",
  "Documents",
  "Bags",
  "Keys",
  "Others",
];
const categoryColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6B7280", // Gray
];
const categoryIcons = [
  "Smartphone", // Electronics
  "BookOpen", // Books
  "Shirt", // Clothing
  "Watch", // Accessories
  "FileText", // Documents
  "Briefcase", // Bags
  "Key", // Keys
  "Package", // Others
];
function generateMockCategories(): Category[] {
  return categoryNames.map((name, index) => ({
    id: index + 1,
    name,
    description: `Category for ${name.toLowerCase()} items found on campus`,
    color: categoryColors[index],
    itemCount: faker.number.int({ min: 2, max: 25 }),
    status: "Active" as const,
    createdAt: faker.date.past().toISOString().slice(0, 10),
    lastUpdated: faker.date.recent().toISOString().slice(0, 10),
    iconName: categoryIcons[index],
  }));
}

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate days until expiry
const getDaysUntilExpiry = (
  keyedInDate: string,
  retentionPeriod: number
): number => {
  const keyedDate = new Date(keyedInDate);
  const expiryDate = new Date(
    keyedDate.getTime() + retentionPeriod * 24 * 60 * 60 * 1000
  );
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get icon component
const getIconComponent = (iconName: string) => {
  const IconComponent = iconMap[iconName] || Package;
  return IconComponent;
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

  const nextImage = () => {
    if (selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  return (
    <div className="mb-6">
      {/* Main Image */}
      <div className="mb-4 bg-surface rounded-xl overflow-hidden relative">
        <img
          src={images[selectedImage]}
          alt={`${itemName} - Image ${selectedImage + 1}`}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/assets/file.svg";
          }}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              disabled={selectedImage === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              disabled={selectedImage === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
            {selectedImage + 1} / {images.length}
          </div>
        )}
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
                  : "border-card-border hover:border-primary-300"
              }`}
            >
              <img
                src={image}
                alt={`${itemName} thumbnail ${index + 1}`}
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
  item: LostItem | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!item) return null;

  const daysUntilExpiry = getDaysUntilExpiry(
    item.keyedInDate,
    item.retentionPeriod
  );
  const expiryStatus =
    daysUntilExpiry <= 7
      ? "urgent"
      : daysUntilExpiry <= 14
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
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-card-bg shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-card-border bg-primary-600 text-white">
            <h2 className="text-xl font-bold">Item Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-200 p-1 rounded-full hover:bg-primary-700 transition-colors"
            >
              <X className="w-5 h-5" />
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
                <h3 className="text-2xl font-bold text-text mb-3">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "Available"
                        ? "bg-success-bg text-success"
                        : item.status === "Pending Verification"
                        ? "bg-alert-bg text-alert"
                        : "bg-primary-50 text-primary-600"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
                    {item.category}
                  </span>
                  {item.images.length > 1 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-surface text-text-muted flex items-center gap-1">
                      <Images className="w-3 h-3" />
                      {item.images.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-semibold text-text mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Features */}
              {item.features && item.features.length > 0 && (
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="font-semibold text-text mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location & Office Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-surface rounded-lg p-4">
                  <h5 className="font-medium text-text mb-3">
                    Location Details
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-text-muted" />
                      <span className="text-text-muted text-sm">Found at:</span>
                      <span className="ml-2 font-medium text-text">
                        {item.foundAt}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-text-muted" />
                      <span className="text-text-muted text-sm">Office:</span>
                      <span className="ml-2 font-medium text-text">
                        {item.checkpointOffice}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-text-muted" />
                      <span className="text-text-muted text-sm">Found by:</span>
                      <span className="ml-2 font-medium text-text">
                        {item.founder}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Retention */}
              <div className="bg-surface rounded-lg p-4">
                <h5 className="font-medium text-text mb-3">Timeline</h5>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-text-muted" />
                    <span className="text-text-muted text-sm">Found:</span>
                    <span className="ml-2 font-medium text-text">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-text-muted" />
                    <span className="text-text-muted text-sm">Logged:</span>
                    <span className="ml-2 font-medium text-text">
                      {formatDate(item.keyedInDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-text-muted" />
                    <span className="text-text-muted text-sm">Expires in:</span>
                    <span
                      className={`ml-2 font-medium ${
                        expiryStatus === "urgent"
                          ? "text-error"
                          : expiryStatus === "warning"
                          ? "text-alert"
                          : "text-text"
                      }`}
                    >
                      {daysUntilExpiry} days
                    </span>
                    {expiryStatus === "urgent" && (
                      <span className="ml-2 text-xs bg-error-bg text-error px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                    {expiryStatus === "warning" && (
                      <span className="ml-2 text-xs bg-alert-bg text-alert px-2 py-1 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Claim Button */}
          <div className="p-6 border-t border-card-border bg-surface">
            {item.status === "Available" ? (
              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                Claim This Item
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
              >
                {item.status === "Claimed"
                  ? "Item Already Claimed"
                  : "Item Under Review"}
              </button>
            )}
            <p className="text-xs text-text-muted mt-3 text-center">
              Visit {item.checkpointOffice} with valid ID and proof of ownership
              to claim
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const ItemsBrowser = () => {
  // Only generate mock data on client to avoid hydration errors
  const [lostItems, setLostItems] = useState<LostItem[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [filtered, setFiltered] = useState<LostItem[]>([]);
  const [items, setItems] = useState<LostItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const loader = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Generate mock data only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLostItems(generateMockItems(60));
      setCategories(generateMockCategories());
    }
  }, []);

  // Extract category names from categories
  const categoryNames = categories ? categories.map((cat) => cat.name) : [];

  // Pre-fill search and category from URL params on first load
  useEffect(() => {
    if (!categories) return;
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams, categories]);

  // Filter logic
  useEffect(() => {
    if (!lostItems) return;
    const filteredItems = lostItems.filter((item) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchDateFrom = !dateFrom || item.date >= dateFrom;
      const matchDateTo = !dateTo || item.date <= dateTo;
      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;
      return (
        matchCategory &&
        matchSearch &&
        matchDateFrom &&
        matchDateTo &&
        matchStatus
      );
    });
    setFiltered(filteredItems);
    setPage(1); // Reset page on filter change
  }, [lostItems, search, selectedCategories, dateFrom, dateTo, statusFilter]);

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
    if (!lostItems) return;
    const id = searchParams.get("id");
    if (id) {
      const item = lostItems.find((itm) => itm.id === Number(id));
      if (item) {
        setSelectedItem(item);
        setIsDrawerOpen(true);
      }
    } else {
      setIsDrawerOpen(false);
      setSelectedItem(null);
    }
  }, [searchParams, lostItems]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const openItemDetails = (item: LostItem) => {
    router.push(`/browser?id=${item.id}`);
  };

  const closeDrawer = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("id");
    router.replace(`/browser${params.toString() ? `?${params}` : ""}`);
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Get category color
  const getCategoryColor = (categoryName: string) => {
    if (!categories) return "#3B82F6";
    const category = categories.find((cat) => cat.name === categoryName);
    return category?.color || "#3B82F6";
  };

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    if (!categories) return Package;
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? getIconComponent(category.iconName) : Package;
  };

  if (!lostItems || !categories) {
    // Prevent hydration errors: don't render until data is ready
    return null;
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Header Strip - UG Blue */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-600 z-50"></div>

      {/* Sidebar: Logo and Navigation */}
      <aside className="hidden md:flex w-72 min-w-[250px] bg-card-bg border-r border-card-border flex-col shadow-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-card-border bg-primary-600">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/ugrecover.png"
              alt="UGRecover Logo"
              width={36}
              height={36}
              className="border border-white rounded bg-white"
            />
            <span className="font-bold text-xl tracking-wide text-white">
              UGRecover
            </span>
          </Link>
          <p className="text-primary-100 text-sm mt-2">
            University of Ghana Lost & Found
          </p>
        </div>

        {/* Stats Section */}
        <div className="p-6 border-b border-card-border bg-surface">
          <h3 className="font-semibold text-text mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card-bg rounded-lg p-3 border border-card-border">
              <p className="text-xs text-text-muted">Total Items</p>
              <p className="text-lg font-bold text-text">{lostItems.length}</p>
            </div>
            <div className="bg-card-bg rounded-lg p-3 border border-card-border">
              <p className="text-xs text-text-muted">Available</p>
              <p className="text-lg font-bold text-success">
                {lostItems.filter((i) => i.status === "Available").length}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="font-semibold text-text mb-4">Filter by Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => {
              const IconComponent = getIconComponent(cat.iconName);
              return (
                <label
                  key={cat.name}
                  className="flex items-center gap-3 cursor-pointer group hover:bg-primary-50 p-3 rounded-lg transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                    className="w-4 h-4 text-primary-600 accent-primary-600 focus:ring-primary-500 focus:ring-2 rounded border-gray-300"
                  />
                  <div
                    className="p-1 rounded-md flex items-center justify-center"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-text font-medium group-hover:text-primary-700 transition-colors">
                      {cat.name}
                    </span>
                    <p className="text-xs text-text-muted">
                      {cat.itemCount} items
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Search and Filters Section */}
        <div className="bg-card-bg border-b border-card-border px-4 md:px-8 py-4 shadow-sm">
          {/* University Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-primary-600 mb-1">
              Lost & Found Items Browser
            </h1>
            <p className="text-text-muted">
              Browse and claim items found around the University of Ghana campus
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-text font-medium text-sm mb-2">
                Search Items
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, description, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-surface text-text placeholder-text-muted transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-text font-medium text-sm mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-card-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Pending Verification">Under Review</option>
                <option value="Claimed">Claimed</option>
              </select>
            </div>

            <div>
              <label className="block text-text font-medium text-sm mb-2">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-card-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-text font-medium text-sm mb-2">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-card-border rounded-lg bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Categories (mobile) */}
          <div className="md:hidden">
            <h4 className="font-medium text-text text-sm mb-3">Categories</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => {
                const IconComponent = getIconComponent(cat.iconName);
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border font-medium whitespace-nowrap transition-all text-sm ${
                      selectedCategories.includes(cat.name)
                        ? "text-white border-primary-600 shadow-sm"
                        : "bg-surface text-text-muted border-card-border hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300"
                    }`}
                    style={
                      selectedCategories.includes(cat.name)
                        ? { backgroundColor: cat.color }
                        : {}
                    }
                  >
                    <IconComponent className="w-3 h-3" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scrollable Items Section */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-background">
          {items.length === 0 ? (
            <div className="text-center text-text-muted mt-12">
              <div className="max-w-md mx-auto bg-card-bg p-8 rounded-xl border border-card-border shadow-sm">
                <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <p className="font-medium text-text mb-2">No items found</p>
                <p className="text-sm">
                  {lostItems.length === 0
                    ? "No items available at the moment. Please check back later."
                    : "Try adjusting your search filters to find more items"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-text-muted text-sm">
                  Showing{" "}
                  <span className="font-medium text-text">{items.length}</span>{" "}
                  of{" "}
                  <span className="font-medium text-text">
                    {filtered.length}
                  </span>{" "}
                  items
                </p>
                <div className="text-xs text-text-light">
                  Last updated: {formatDate(new Date().toISOString())}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  const categoryColor = getCategoryColor(item.category);
                  const daysUntilExpiry = getDaysUntilExpiry(
                    item.keyedInDate,
                    item.retentionPeriod
                  );

                  return (
                    <div
                      key={item.id}
                      onClick={() => openItemDetails(item)}
                      className="bg-card-bg rounded-xl shadow-sm hover:shadow-md p-5 flex flex-col border border-card-border transition-all duration-200 hover:border-primary-300 hover:-translate-y-1 group cursor-pointer"
                    >
                      <div className="mb-4 w-full h-40 bg-surface rounded-xl overflow-hidden group-hover:bg-primary-50 transition-colors duration-200">
                        <img
                          src={item.mainImage}
                          alt={item.name}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/file.svg";
                          }}
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-base mb-2 text-text group-hover:text-primary-700 transition-colors line-clamp-2">
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="p-1 rounded-md flex items-center gap-1 text-xs font-medium border"
                              style={{
                                backgroundColor: `${categoryColor}10`,
                                color: categoryColor,
                                borderColor: `${categoryColor}30`,
                              }}
                            >
                              <CategoryIcon className="w-3 h-3" />
                              {item.category}
                            </div>
                            {item.images.length > 1 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-surface text-text-muted flex items-center gap-1">
                                <Images className="w-2 h-2" />
                                {item.images.length}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-text-muted">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{item.foundAt}</span>
                          </div>
                          <div className="flex items-center text-text-muted">
                            <Building className="w-3 h-3 mr-1" />
                            <span className="truncate">
                              {item.checkpointOffice}
                            </span>
                          </div>
                          <div className="flex items-center text-text-muted">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              item.status === "Available"
                                ? "bg-success-bg text-success"
                                : item.status === "Pending Verification"
                                ? "bg-alert-bg text-alert"
                                : "bg-primary-50 text-primary-600"
                            }`}
                          >
                            {item.status}
                          </span>

                          {item.status === "Available" && (
                            <div className="text-xs text-text-muted">
                              {daysUntilExpiry > 0 ? (
                                <span
                                  className={
                                    daysUntilExpiry <= 7
                                      ? "text-error font-medium"
                                      : ""
                                  }
                                >
                                  {daysUntilExpiry}d left
                                </span>
                              ) : (
                                <span className="text-error font-medium">
                                  Expired
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loader for infinite scroll */}
              <div
                ref={loader}
                className="h-16 flex items-center justify-center mt-8"
              >
                {items.length < filtered.length && (
                  <div className="text-text-muted text-sm bg-card-bg px-4 py-2 rounded-full border border-card-border flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
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
