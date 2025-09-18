"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  MapPin,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/hooks/userContext";

// TypeScript interfaces
interface Officer {
  id: number;
  name: string;
  email: string;
  phone: string;
  assigned?: boolean;
}

interface CollectionPoint {
  id: number;
  name: string;
  location: string;
  address: string;
  status: "Active" | "Inactive";
  capacity: number;
  currentItems: number;
  officers: Officer[];
  createdAt: string;
  lastActivity: string;
  description: string;
}

interface NewCollectionPoint {
  name: string;
  location: string;
  address: string;
  capacity: string;
  description: string;
  status: "Active" | "Inactive";
}

type StatusFilter = "All" | "Active" | "Inactive";

const SudoCollectionPoints: React.FC = () => {
  const {
    items: collectionPoints,
    setItems: setCollectionPoints,
    officers,
    setOfficers,
    user,
  } = useAuthContext();
  const [filteredPoints, setFilteredPoints] =
    useState<CollectionPoint[]>(collectionPoints);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(
    null
  );
  const [newPoint, setNewPoint] = useState<NewCollectionPoint>({
    name: "",
    location: "",
    address: "",
    capacity: "",
    description: "",
    status: "Active",
  });

  // Filter collection points
  useEffect(() => {
    let filtered: CollectionPoint[] = collectionPoints.filter(
      (point: CollectionPoint) =>
        point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (point: CollectionPoint) => point.status === statusFilter
      );
    }
    setFilteredPoints(filtered);
  }, [searchTerm, statusFilter, collectionPoints]);

  // Handle adding new collection point
  const handleAddPoint = (): void => {
    const newId: number =
      collectionPoints.length > 0
        ? Math.max(...collectionPoints.map((p: CollectionPoint) => p.id)) + 1
        : 1;
    const pointToAdd: CollectionPoint = {
      ...newPoint,
      id: newId,
      capacity: parseInt(newPoint.capacity),
      currentItems: 0,
      officers: [],
      createdAt: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
    };
    setCollectionPoints([...collectionPoints, pointToAdd]);
    setShowAddModal(false);
    setNewPoint({
      name: "",
      location: "",
      address: "",
      capacity: "",
      description: "",
      status: "Active",
    });
  };

  // Handle editing collection point
  const handleEditPoint = (): void => {
    if (!selectedPoint) return;
    const updatedPoints: CollectionPoint[] = collectionPoints.map(
      (point: CollectionPoint) =>
        point.id === selectedPoint.id ? selectedPoint : point
    );
    setCollectionPoints(updatedPoints);
    setShowEditModal(false);
    setSelectedPoint(null);
  };

  // Handle deleting collection point
  const handleDeletePoint = (): void => {
    if (!selectedPoint) return;
    const updatedPoints: CollectionPoint[] = collectionPoints.filter(
      (point: CollectionPoint) => point.id !== selectedPoint.id
    );
    setCollectionPoints(updatedPoints);
    setShowDeleteModal(false);
    setSelectedPoint(null);
  };

  // Handle officer assignment
  const assignOfficer = (officer: Officer): void => {
    if (!selectedPoint) return;
    // Mark officer as assigned
    const updatedOfficer = { ...officer, assigned: true };
    setOfficers(
      officers.map((o) => (o.id === officer.id ? updatedOfficer : o))
    );
    const updatedPoint: CollectionPoint = {
      ...selectedPoint,
      officers: [...selectedPoint.officers, updatedOfficer],
    };
    setSelectedPoint(updatedPoint);
    const updatedPoints: CollectionPoint[] = collectionPoints.map(
      (point: CollectionPoint) =>
        point.id === selectedPoint.id ? updatedPoint : point
    );
    setCollectionPoints(updatedPoints);
  };

  // Handle officer removal
  const removeOfficer = (officerId: number): void => {
    if (!selectedPoint) return;
    // Mark officer as unassigned
    setOfficers(
      officers.map((o) => (o.id === officerId ? { ...o, assigned: false } : o))
    );
    const updatedPoint: CollectionPoint = {
      ...selectedPoint,
      officers: selectedPoint.officers.filter(
        (officer: Officer) => officer.id !== officerId
      ),
    };
    setSelectedPoint(updatedPoint);
    const updatedPoints: CollectionPoint[] = collectionPoints.map(
      (point: CollectionPoint) =>
        point.id === selectedPoint.id ? updatedPoint : point
    );
    setCollectionPoints(updatedPoints);
  };

  // Stats calculations
  const totalPoints: number = collectionPoints.length;
  const activePoints: number = collectionPoints.filter(
    (p: CollectionPoint) => p.status === "Active"
  ).length;
  const totalCapacity: number = collectionPoints.reduce(
    (sum: number, p: CollectionPoint) => sum + p.capacity,
    0
  );
  const totalItems: number = collectionPoints.reduce(
    (sum: number, p: CollectionPoint) => sum + p.currentItems,
    0
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Collection Points Management
          </h1>
          <p className="opacity-90">
            Manage campus collection points and assign officers
          </p>
        </div>

        {/* Stats Cards - always one row, scrollable on small screens */}
        <div className="flex gap-6 overflow-x-auto pb-2">
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Points</p>
                <p className="text-2xl font-bold text-text">{totalPoints}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Points</p>
                <p className="text-2xl font-bold text-success">
                  {activePoints}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Capacity</p>
                <p className="text-2xl font-bold text-secondary-600">
                  {totalCapacity}
                </p>
              </div>
              <Package className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Current Items</p>
                <p className="text-2xl font-bold text-accent">{totalItems}</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search collection points..."
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
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Collection Point
            </button>
          </div>
        </div>

        {/* Collection Points Table */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-card-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-text">
                    Name
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Location
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Capacity
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Officers
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Last Activity
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map((point) => (
                  <tr
                    key={point.id}
                    className="border-b border-card-border hover:bg-surface transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-text">{point.name}</p>
                        <p className="text-sm text-text-muted">
                          {point.address}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-text-muted">{point.location}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          point.status === "Active"
                            ? "bg-success-bg text-success"
                            : "bg-error-bg text-error"
                        }`}
                      >
                        {point.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-text">
                        {point.currentItems}/{point.capacity}
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full"
                            style={{
                              width: `${
                                (point.currentItems / point.capacity) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-text-muted" />
                        <span className="text-text">
                          {point.officers.length}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-text-muted">
                      {point.lastActivity}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPoint(point);
                            setShowViewModal(true);
                          }}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPoint(point);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-secondary-600 hover:bg-secondary-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPoint(point);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-error hover:bg-error-bg rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">
                Add Collection Point
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newPoint.name}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Collection point name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newPoint.location}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Building/Area name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newPoint.address}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={newPoint.capacity}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, capacity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Maximum items"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Description
                </label>
                <textarea
                  value={newPoint.description}
                  onChange={(e) =>
                    setNewPoint({ ...newPoint, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Status
                </label>
                <select
                  value={newPoint.status}
                  onChange={(e) =>
                    setNewPoint({
                      ...newPoint,
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
                onClick={handleAddPoint}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">
                Edit Collection Point
              </h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedPoint.name}
                  onChange={(e) =>
                    setSelectedPoint({ ...selectedPoint, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Collection point name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={selectedPoint.location}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Building/Area name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={selectedPoint.address}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={selectedPoint.capacity}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      capacity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Maximum items"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Description
                </label>
                <textarea
                  value={selectedPoint.description}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Status
                </label>
                <select
                  value={selectedPoint.status}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
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
                onClick={handleEditPoint}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Officer Management Modal */}
      {showViewModal && selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text">
                Collection Point Details
              </h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Point Info */}
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-semibold text-text mb-3">
                  Point Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Name:</span>
                    <p className="font-medium text-text">
                      {selectedPoint.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Location:</span>
                    <p className="font-medium text-text">
                      {selectedPoint.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedPoint.status === "Active"
                          ? "bg-success-bg text-success"
                          : "bg-error-bg text-error"
                      }`}
                    >
                      {selectedPoint.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Capacity:</span>
                    <p className="font-medium text-text">
                      {selectedPoint.currentItems}/{selectedPoint.capacity}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-muted">Address:</span>
                    <p className="font-medium text-text">
                      {selectedPoint.address}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-muted">Description:</span>
                    <p className="font-medium text-text">
                      {selectedPoint.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned Officers */}
              <div className="bg-surface rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-text">
                    Assigned Officers ({selectedPoint.officers.length})
                  </h4>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedPoint.officers.map((officer) => (
                    <div
                      key={officer.id}
                      className="flex items-center justify-between p-3 bg-card-bg rounded-lg border border-card-border"
                    >
                      <div>
                        <p className="font-medium text-text">{officer.name}</p>
                        <p className="text-sm text-text-muted">
                          {officer.email} • {officer.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => removeOfficer(officer.id)}
                        className="p-1 text-error hover:bg-error-bg rounded transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {selectedPoint.officers.length === 0 && (
                    <p className="text-text-muted text-sm italic">
                      No officers assigned
                    </p>
                  )}
                </div>

                {/* Available Officers to Assign */}
                <div>
                  <h5 className="font-medium text-text mb-2">
                    Available Officers
                  </h5>
                  <div className="space-y-2">
                    {officers
                      .filter(
                        (officer) =>
                          !officer.assigned &&
                          !selectedPoint.officers.some(
                            (assigned) => assigned.id === officer.id
                          )
                      )
                      .map((officer) => (
                        <div
                          key={officer.id}
                          className="flex items-center justify-between p-3 bg-card-bg rounded-lg border border-card-border"
                        >
                          <div>
                            <p className="font-medium text-text">
                              {officer.name}
                            </p>
                            <p className="text-sm text-text-muted">
                              {officer.email}
                            </p>
                          </div>
                          <button
                            onClick={() => assignOfficer(officer)}
                            className="p-1 text-success hover:bg-success-bg rounded transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-error-bg rounded-full">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">
                  Delete Collection Point
                </h3>
                <p className="text-text-muted">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-text mb-6">
              Are you sure you want to delete
              <strong>{selectedPoint.name}</strong>? This will remove the
              collection point and all associated data.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePoint}
                className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudoCollectionPoints;
