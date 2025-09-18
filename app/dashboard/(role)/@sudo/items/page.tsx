"use client";

import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Image as ImageIcon,
  MapPin,
  Package,
  Search,
  Tag,
  User,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/hooks/userContext";

// TypeScript interfaces
interface LostItem {
  id: number;
  name: string;
  description: string;
  category: string;
  foundAt: string;
  checkpointOffice: string;
  date: string;
  keyedInDate: string;
  retentionPeriod: number;
  status: "Available" | "Pending Verification" | "Claimed" | "Expired";
  founder: string;
  features?: string[];
  images: string[];
  mainImage: string;
}

type StatusFilter =
  | "All"
  | "Available"
  | "Pending Verification"
  | "Claimed"
  | "Expired";
type CategoryFilter =
  | "All"
  | "Electronics"
  | "Books"
  | "Clothing"
  | "Accessories"
  | "Documents"
  | "Bags"
  | "Keys"
  | "Others";

const SudoItemsManagement: React.FC = () => {
  const { lostItems = [], user } = useAuthContext();

  const [filteredItems, setFilteredItems] = useState<LostItem[]>(lostItems);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // Categories for filtering
  const categories: CategoryFilter[] = [
    "All",
    "Electronics",
    "Books",
    "Clothing",
    "Accessories",
    "Documents",
    "Bags",
    "Keys",
    "Others",
  ];

  // Filter items
  useEffect(() => {
    let filtered: LostItem[] = lostItems.filter(
      (item: LostItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.foundAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.checkpointOffice
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.founder.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (item: LostItem) => item.status === statusFilter
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (item: LostItem) => item.category === categoryFilter
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, statusFilter, categoryFilter, lostItems]);

  // Format date function
  const formatDate = (dateString: string): string => {
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

  // Handle view item
  const handleViewItem = (item: LostItem): void => {
    setSelectedItem(item);
    setSelectedImage(0);
    setShowViewModal(true);
  };

  // Image navigation
  const nextImage = (): void => {
    if (selectedItem && selectedImage < selectedItem.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevImage = (): void => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  // Stats calculations
  const totalItems: number = lostItems.length;
  const availableItems: number = lostItems.filter(
    (item: LostItem) => item.status === "Available"
  ).length;
  const pendingItems: number = lostItems.filter(
    (item: LostItem) => item.status === "Pending Verification"
  ).length;
  const claimedItems: number = lostItems.filter(
    (item: LostItem) => item.status === "Claimed"
  ).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-primary-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Items Management</h1>
          <p className="opacity-90">
            Browse and manage all lost items in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 overflow-x-auto pb-2">
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Items</p>
                <p className="text-2xl font-bold text-text">{totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Available</p>
                <p className="text-2xl font-bold text-success">
                  {availableItems}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Pending</p>
                <p className="text-2xl font-bold text-alert">{pendingItems}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-alert" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Claimed</p>
                <p className="text-2xl font-bold text-primary-600">
                  {claimedItems}
                </p>
              </div>
              <User className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Pending Verification">
                  Pending Verification
                </option>
                <option value="Claimed">Claimed</option>
                <option value="Expired">Expired</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as CategoryFilter)
                }
                className="px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-text-muted">
              Showing {filteredItems.length} of {totalItems} items
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const daysUntilExpiry = getDaysUntilExpiry(
              item.keyedInDate,
              item.retentionPeriod
            );

            return (
              <div
                key={item.id}
                onClick={() => handleViewItem(item)}
                className="bg-card-bg rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col border border-card-border transition-all duration-200 hover:border-accent hover:-translate-y-1 group cursor-pointer"
              >
                {/* Item Image */}
                <div className="mb-4 w-full h-40 bg-gray-50 rounded-xl overflow-hidden group-hover:bg-accent/5 transition-colors duration-200">
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/file.svg";
                    }}
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-text text-center group-hover:text-accent transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mt-2">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-text-muted">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{item.foundAt}</span>
                    </div>
                    <div className="flex items-center text-sm text-text-muted">
                      <Building className="w-3 h-3 mr-1" />
                      <span className="truncate">{item.checkpointOffice}</span>
                    </div>
                    <div className="flex items-center text-sm text-text-muted">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-text-muted">
                      <User className="w-3 h-3 mr-1" />
                      <span className="truncate">{item.founder}</span>
                    </div>
                  </div>

                  {/* Status and Expiry */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Available"
                            ? "bg-success-bg text-success"
                            : item.status === "Pending Verification"
                            ? "bg-alert-bg text-alert"
                            : item.status === "Claimed"
                            ? "bg-primary-50 text-primary-600"
                            : "bg-error-bg text-error"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.images.length > 1 && (
                        <div className="flex items-center text-xs text-text-muted">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          {item.images.length}
                        </div>
                      )}
                    </div>

                    {item.status === "Available" && (
                      <div className="text-xs text-text-muted">
                        {daysUntilExpiry > 0 ? (
                          <span
                            className={
                              daysUntilExpiry <= 7
                                ? "text-alert font-medium"
                                : ""
                            }
                          >
                            Expires in {daysUntilExpiry} days
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg">
              No items found matching your criteria
            </p>
            <p className="text-text-light text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* View Item Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card-bg border-b border-card-border p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-text">
                  Item Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1 hover:bg-surface rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-text-muted" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div>
                <div className="mb-6">
                  {/* Main Image */}
                  <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden relative">
                    <img
                      src={selectedItem.images[selectedImage]}
                      alt={`${selectedItem.name} - Image ${selectedImage + 1}`}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/file.svg";
                      }}
                    />

                    {/* Navigation arrows */}
                    {selectedItem.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          disabled={selectedImage === 0}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          disabled={
                            selectedImage === selectedItem.images.length - 1
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {selectedItem.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedItem.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? "border-accent"
                              : "border-card-border hover:border-accent/50"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedItem.name} thumbnail ${index + 1}`}
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
              </div>

              {/* Item Information */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-text mb-2">
                    {selectedItem.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedItem.status === "Available"
                        ? "bg-success-bg text-success"
                        : selectedItem.status === "Pending Verification"
                        ? "bg-alert-bg text-alert"
                        : selectedItem.status === "Claimed"
                        ? "bg-primary-50 text-primary-600"
                        : "bg-error-bg text-error"
                    }`}
                  >
                    {selectedItem.status}
                  </span>
                </div>

                {/* Description */}
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="font-semibold text-text mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </h4>
                  <p className="text-text-muted">{selectedItem.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface rounded-lg p-4">
                    <h5 className="font-medium text-text mb-3">Item Details</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Tag className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Category:</span>
                        <span className="ml-2 font-medium text-text">
                          {selectedItem.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Found at:</span>
                        <span className="ml-2 font-medium text-text">
                          {selectedItem.foundAt}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Building className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Office:</span>
                        <span className="ml-2 font-medium text-text">
                          {selectedItem.checkpointOffice}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Found by:</span>
                        <span className="ml-2 font-medium text-text">
                          {selectedItem.founder}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-lg p-4">
                    <h5 className="font-medium text-text mb-3">Timeline</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Found:</span>
                        <span className="ml-2 font-medium text-text">
                          {formatDate(selectedItem.date)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Logged:</span>
                        <span className="ml-2 font-medium text-text">
                          {formatDate(selectedItem.keyedInDate)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="w-3 h-3 mr-2 text-text-muted" />
                        <span className="text-text-muted">Retention:</span>
                        <span className="ml-2 font-medium text-text">
                          {selectedItem.retentionPeriod} days
                        </span>
                      </div>
                      {selectedItem.status === "Available" && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2 text-text-muted" />
                          <span className="text-text-muted">Expires in:</span>
                          <span
                            className={`ml-2 font-medium ${
                              getDaysUntilExpiry(
                                selectedItem.keyedInDate,
                                selectedItem.retentionPeriod
                              ) <= 7
                                ? "text-alert"
                                : "text-text"
                            }`}
                          >
                            {getDaysUntilExpiry(
                              selectedItem.keyedInDate,
                              selectedItem.retentionPeriod
                            )}{" "}
                            days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                {selectedItem.features && selectedItem.features.length > 0 && (
                  <div className="bg-surface rounded-lg p-4">
                    <h5 className="font-medium text-text mb-3">Features</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudoItemsManagement;
