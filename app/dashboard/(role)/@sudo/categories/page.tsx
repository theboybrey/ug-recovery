"use client";

import {
  AlertTriangle,
  Archive,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  Filter,
  Hash,
  Key,
  Package,
  Palette,
  Plus,
  Save,
  Search,
  Shirt,
  Smartphone,
  Tag,
  TrendingUp,
  Watch,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import type { Category } from "@/providers/auth-context";
import { useAuthContext } from "@/hooks/userContext";

interface NewCategory {
  name: string;
  description: string;
  color: string;
  iconName: string;
  status: "Active" | "Inactive";
}

type StatusFilter = "All" | "Active" | "Inactive";

// Icon mapping for dynamic rendering
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

// Available colors for categories
const availableColors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Emerald", value: "#059669" },
];

// Available icons
const availableIcons = [
  { name: "Smartphone", label: "Electronics" },
  { name: "BookOpen", label: "Books" },
  { name: "Shirt", label: "Clothing" },
  { name: "Watch", label: "Accessories" },
  { name: "FileText", label: "Documents" },
  { name: "Briefcase", label: "Bags" },
  { name: "Key", label: "Keys" },
  { name: "Package", label: "Others" },
];

const SudoCategoriesManagement: React.FC = () => {
  const { categories, setCategories, user } = useAuthContext();

  const [filteredCategories, setFilteredCategories] =
    useState<Category[]>(categories);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    description: "",
    color: "#3B82F6",
    iconName: "Package",
    status: "Active",
  });

  // Filter categories
  useEffect(() => {
    let filtered: Category[] = categories.filter(
      (category: Category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (category: Category) => category.status === statusFilter
      );
    }

    setFilteredCategories(filtered);
  }, [searchTerm, statusFilter, categories]);

  // Handle adding new category
  const handleAddCategory = (): void => {
    const newId: number =
      categories.length > 0
        ? Math.max(...categories.map((c: Category) => c.id)) + 1
        : 1;
    const categoryToAdd: Category = {
      ...newCategory,
      id: newId,
      itemCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setCategories([categoryToAdd, ...categories]);
    setShowAddModal(false);
    setNewCategory({
      name: "",
      description: "",
      color: "#3B82F6",
      iconName: "Package",
      status: "Active",
    });
  };

  // Handle editing category
  const handleEditCategory = (): void => {
    if (!selectedCategory) return;

    const updatedCategory = {
      ...selectedCategory,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    const updatedCategories: Category[] = categories.map((category: Category) =>
      category.id === selectedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  // Handle archiving category
  const handleArchiveCategory = (): void => {
    if (!selectedCategory) return;

    const updatedCategory: Category = {
      ...selectedCategory,
      status: "Inactive",
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    const updatedCategories: Category[] = categories.map((category: Category) =>
      category.id === selectedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);
    setShowArchiveModal(false);
    setSelectedCategory(null);
  };

  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Package;
    return IconComponent;
  };

  // Stats calculations
  const totalCategories: number = categories.length;
  const activeCategories: number = categories.filter(
    (c: Category) => c.status === "Active"
  ).length;
  const totalItems: number = categories.reduce(
    (sum: number, c: Category) => sum + c.itemCount,
    0
  );
  const archivedCategories: number = categories.filter(
    (c: Category) => c.status === "Inactive"
  ).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Categories Management</h1>
          <p className="opacity-90">
            Organize and manage item categories for the lost and found system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 overflow-x-auto pb-2">
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Categories</p>
                <p className="text-2xl font-bold text-text">
                  {totalCategories}
                </p>
              </div>
              <Tag className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Categories</p>
                <p className="text-2xl font-bold text-success">
                  {activeCategories}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Items</p>
                <p className="text-2xl font-bold text-accent">{totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Archived</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {archivedCategories}
                </p>
              </div>
              <Archive className="w-8 h-8 text-secondary-600" />
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
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Archived</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = getIconComponent(category.iconName);

            return (
              <div
                key={category.id}
                className="bg-card-bg rounded-xl shadow-sm border border-card-border p-6 hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${category.color}15`,
                      color: category.color,
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === "Active"
                        ? "bg-success-bg text-success"
                        : "bg-secondary-50 text-secondary-600"
                    }`}
                  >
                    {category.status}
                  </span>
                </div>

                {/* Category Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-text mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-text-muted">
                      <Hash className="w-3 h-3 mr-1" />
                      <span>{category.itemCount} items</span>
                    </div>
                    <div className="flex items-center text-text-muted">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(category.createdAt)}</span>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="flex items-center text-sm text-text-muted">
                    <Palette className="w-3 h-3 mr-1" />
                    <span>Color:</span>
                    <div
                      className="w-4 h-4 rounded ml-2 border border-card-border"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="ml-1 text-xs">{category.color}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-card-border">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowViewModal(true);
                      }}
                      className="flex-1 p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">View</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowEditModal(true);
                      }}
                      className="flex-1 p-2 text-secondary-600 hover:bg-secondary-50 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-xs">Edit</span>
                    </button>
                    {category.status === "Active" && (
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowArchiveModal(true);
                        }}
                        className="flex-1 p-2 text-alert hover:bg-alert-bg rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <Archive className="w-4 h-4" />
                        <span className="text-xs">Archive</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg">
              No categories found matching your criteria
            </p>
            <p className="text-text-light text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">
                Add New Category
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setNewCategory({ ...newCategory, color: color.value })
                      }
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        newCategory.color === color.value
                          ? "border-text scale-110"
                          : "border-card-border hover:border-text/50"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((icon) => {
                    const IconComponent = getIconComponent(icon.name);
                    return (
                      <button
                        key={icon.name}
                        onClick={() =>
                          setNewCategory({
                            ...newCategory,
                            iconName: icon.name,
                          })
                        }
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          newCategory.iconName === icon.name
                            ? "border-primary-600 bg-primary-50"
                            : "border-card-border hover:border-primary-300"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-xs">{icon.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Status
                </label>
                <select
                  value={newCategory.status}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Edit Category</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Description
                </label>
                <textarea
                  value={selectedCategory.description}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setSelectedCategory({
                          ...selectedCategory,
                          color: color.value,
                        })
                      }
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        selectedCategory.color === color.value
                          ? "border-text scale-110"
                          : "border-card-border hover:border-text/50"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((icon) => {
                    const IconComponent = getIconComponent(icon.name);
                    return (
                      <button
                        key={icon.name}
                        onClick={() =>
                          setSelectedCategory({
                            ...selectedCategory,
                            iconName: icon.name,
                          })
                        }
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          selectedCategory.iconName === icon.name
                            ? "border-primary-600 bg-primary-50"
                            : "border-card-border hover:border-primary-300"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-xs">{icon.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Status
                </label>
                <select
                  value={selectedCategory.status}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Category Modal */}
      {showViewModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text">
                Category Details
              </h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Preview */}
              <div className="bg-surface rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="p-4 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${selectedCategory.color}15`,
                      color: selectedCategory.color,
                    }}
                  >
                    {React.createElement(
                      getIconComponent(selectedCategory.iconName),
                      { className: "w-8 h-8" }
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-text">
                      {selectedCategory.name}
                    </h2>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        selectedCategory.status === "Active"
                          ? "bg-success-bg text-success"
                          : "bg-secondary-50 text-secondary-600"
                      }`}
                    >
                      {selectedCategory.status}
                    </span>
                  </div>
                </div>
                <p className="text-text-muted">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-lg p-4">
                  <h5 className="font-medium text-text mb-3">Statistics</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Items Count:</span>
                      <span className="font-medium text-text">
                        {selectedCategory.itemCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Status:</span>
                      <span className="font-medium text-text">
                        {selectedCategory.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-lg p-4">
                  <h5 className="font-medium text-text mb-3">Design</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Color:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-card-border"
                          style={{ backgroundColor: selectedCategory.color }}
                        />
                        <span className="font-medium text-text text-xs">
                          {selectedCategory.color}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Icon:</span>
                      <span className="font-medium text-text">
                        {selectedCategory.iconName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 bg-surface rounded-lg p-4">
                  <h5 className="font-medium text-text mb-3">Timeline</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2 text-text-muted" />
                      <span className="text-text-muted">Created:</span>
                      <span className="ml-2 font-medium text-text">
                        {formatDate(selectedCategory.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-2 text-text-muted" />
                      <span className="text-text-muted">Updated:</span>
                      <span className="ml-2 font-medium text-text">
                        {formatDate(selectedCategory.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-alert-bg rounded-full">
                <Archive className="w-6 h-6 text-alert" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">
                  Archive Category
                </h3>
                <p className="text-text-muted">
                  This will deactivate the category.
                </p>
              </div>
            </div>

            <p className="text-text mb-6">
              Are you sure you want to archive
              <strong>{selectedCategory.name}</strong>? This category will be
              marked as inactive but can be reactivated later.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowArchiveModal(false)}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleArchiveCategory}
                className="flex-1 px-4 py-2 bg-alert text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Archive Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudoCategoriesManagement;
