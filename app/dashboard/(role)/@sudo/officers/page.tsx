"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  X,
  Save,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Award,
} from "lucide-react";

import { useAuthContext } from "@/hooks/userContext";
import type { Officer, CollectionPoint } from "@/providers/auth-context";

interface NewOfficer {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
}

type StatusFilter = "All" | "Active" | "Inactive";
type AssignmentFilter = "All" | "Assigned" | "Unassigned";

const SudoOfficersManagement: React.FC = () => {
  const {
    officers,
    setOfficers,
    items: collectionPoints,
    setItems: setCollectionPoints,
    user,
  } = useAuthContext();

  const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>(officers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [assignmentFilter, setAssignmentFilter] =
    useState<AssignmentFilter>("All");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [newOfficer, setNewOfficer] = useState<NewOfficer>({
    name: "",
    email: "",
    phone: "",
    role: "Collection Officer",
    status: "Active",
  });

  // Filter officers
  useEffect(() => {
    let filtered: Officer[] = officers.filter(
      (officer: Officer) =>
        officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.phone.includes(searchTerm) ||
        (officer.assignedPoint &&
          officer.assignedPoint
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (officer: Officer) => officer.status === statusFilter
      );
    }

    if (assignmentFilter !== "All") {
      if (assignmentFilter === "Assigned") {
        filtered = filtered.filter((officer: Officer) => officer.assigned);
      } else {
        filtered = filtered.filter((officer: Officer) => !officer.assigned);
      }
    }

    setFilteredOfficers(filtered);
  }, [searchTerm, statusFilter, assignmentFilter, officers]);

  // Handle adding new officer
  const handleAddOfficer = (): void => {
    const newId: number =
      officers.length > 0
        ? Math.max(...officers.map((o: Officer) => o.id)) + 1
        : 1;
    const officerToAdd: Officer = {
      ...newOfficer,
      id: newId,
      assigned: false,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setOfficers([...officers, officerToAdd]);
    setShowAddModal(false);
    setNewOfficer({
      name: "",
      email: "",
      phone: "",
      role: "Collection Officer",
      status: "Active",
    });
  };

  // Handle editing officer
  const handleEditOfficer = (): void => {
    if (!selectedOfficer) return;

    const updatedOfficers: Officer[] = officers.map((officer: Officer) =>
      officer.id === selectedOfficer.id ? selectedOfficer : officer
    );
    setOfficers(updatedOfficers);

    // Update collection points if officer name changed
    const updatedCollectionPoints = collectionPoints.map(
      (point: CollectionPoint) => ({
        ...point,
        officers: point.officers.map((officer: Officer) =>
          officer.id === selectedOfficer.id ? selectedOfficer : officer
        ),
      })
    );
    setCollectionPoints(updatedCollectionPoints);

    setShowEditModal(false);
    setSelectedOfficer(null);
  };

  // Handle deleting officer
  const handleDeleteOfficer = (): void => {
    if (!selectedOfficer) return;

    // Remove officer from all collection points first
    const updatedCollectionPoints = collectionPoints.map(
      (point: CollectionPoint) => ({
        ...point,
        officers: point.officers.filter(
          (officer: Officer) => officer.id !== selectedOfficer.id
        ),
      })
    );
    setCollectionPoints(updatedCollectionPoints);

    // Remove officer from officers list
    const updatedOfficers: Officer[] = officers.filter(
      (officer: Officer) => officer.id !== selectedOfficer.id
    );
    setOfficers(updatedOfficers);

    setShowDeleteModal(false);
    setSelectedOfficer(null);
  };

  // Handle officer assignment to collection point
  const assignOfficerToPoint = (pointId: number): void => {
    if (!selectedOfficer) return;

    const selectedPoint = collectionPoints.find(
      (p: CollectionPoint) => p.id === pointId
    );
    if (!selectedPoint) return;

    // Update officer with assignment
    const updatedOfficer: Officer = {
      ...selectedOfficer,
      assigned: true,
      assignedPoint: selectedPoint.name,
      assignedPointId: pointId,
    };

    // Update officers list
    const updatedOfficers = officers.map((officer: Officer) =>
      officer.id === selectedOfficer.id ? updatedOfficer : officer
    );
    setOfficers(updatedOfficers);

    // Update collection point with new officer
    const updatedCollectionPoints = collectionPoints.map(
      (point: CollectionPoint) =>
        point.id === pointId
          ? { ...point, officers: [...point.officers, updatedOfficer] }
          : point
    );
    setCollectionPoints(updatedCollectionPoints);

    setSelectedOfficer(updatedOfficer);
    setShowAssignModal(false);
  };

  // Handle officer removal from collection point
  const removeOfficerFromPoint = (): void => {
    if (!selectedOfficer || !selectedOfficer.assignedPointId) return;

    // Update officer to unassigned
    const updatedOfficer: Officer = {
      ...selectedOfficer,
      assigned: false,
      assignedPoint: undefined,
      assignedPointId: undefined,
    };

    // Update officers list
    const updatedOfficers = officers.map((officer: Officer) =>
      officer.id === selectedOfficer.id ? updatedOfficer : officer
    );
    setOfficers(updatedOfficers);

    // Remove officer from collection point
    const updatedCollectionPoints = collectionPoints.map(
      (point: CollectionPoint) =>
        point.id === selectedOfficer.assignedPointId
          ? {
              ...point,
              officers: point.officers.filter(
                (o: Officer) => o.id !== selectedOfficer.id
              ),
            }
          : point
    );
    setCollectionPoints(updatedCollectionPoints);

    setSelectedOfficer(updatedOfficer);
  };

  // Stats calculations
  const totalOfficers: number = officers.length;
  const activeOfficers: number = officers.filter(
    (o: Officer) => o.status === "Active"
  ).length;
  const assignedOfficers: number = officers.filter(
    (o: Officer) => o.assigned
  ).length;
  const availableOfficers: number = officers.filter(
    (o: Officer) => !o.assigned && o.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Officers Management</h1>
          <p className="opacity-90">
            Manage checkpoint officers and their assignments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 overflow-x-auto pb-2">
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Officers</p>
                <p className="text-2xl font-bold text-text">{totalOfficers}</p>
              </div>
              <Users className="w-8 h-8 text-secondary-600" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Active Officers</p>
                <p className="text-2xl font-bold text-success">
                  {activeOfficers}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Assigned</p>
                <p className="text-2xl font-bold text-primary-600">
                  {assignedOfficers}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Available</p>
                <p className="text-2xl font-bold text-accent">
                  {availableOfficers}
                </p>
              </div>
              <UserX className="w-8 h-8 text-accent" />
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
                  placeholder="Search officers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-surface"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-surface"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={assignmentFilter}
                onChange={(e) =>
                  setAssignmentFilter(e.target.value as AssignmentFilter)
                }
                className="px-4 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-surface"
              >
                <option value="All">All Officers</option>
                <option value="Assigned">Assigned</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-secondary-600 text-white px-6 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Officer
            </button>
          </div>
        </div>

        {/* Officers Table */}
        <div className="bg-card-bg rounded-xl shadow-sm border border-card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-card-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-text">
                    Officer
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Contact
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Role
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Assignment
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Join Date
                  </th>
                  <th className="text-left p-4 font-semibold text-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr
                    key={officer.id}
                    className="border-b border-card-border hover:bg-surface transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                          <span className="text-secondary-700 font-medium">
                            {officer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text">
                            {officer.name}
                          </p>
                          <p className="text-sm text-text-muted">
                            ID: {officer.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-text">
                          <Mail className="w-3 h-3 mr-1 text-text-muted" />
                          {officer.email}
                        </div>
                        <div className="flex items-center text-sm text-text">
                          <Phone className="w-3 h-3 mr-1 text-text-muted" />
                          {officer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent-light text-accent">
                        {officer.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          officer.status === "Active"
                            ? "bg-success-bg text-success"
                            : "bg-error-bg text-error"
                        }`}
                      >
                        {officer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {officer.assigned && officer.assignedPoint ? (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 mr-1 text-primary-600" />
                          <span className="text-primary-600 font-medium">
                            {officer.assignedPoint}
                          </span>
                        </div>
                      ) : (
                        <span className="text-text-muted text-sm italic">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-text-muted">
                        <Calendar className="w-3 h-3 mr-1" />
                        {officer.joinDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOfficer(officer);
                            setShowViewModal(true);
                          }}
                          className="p-1 text-secondary-600 hover:bg-secondary-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOfficer(officer);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOfficer(officer);
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

      {/* Add Officer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">
                Add New Officer
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newOfficer.name}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                  placeholder="Enter officer's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newOfficer.email}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                  placeholder="officer@ug.edu.gh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newOfficer.phone}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                  placeholder="0241234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Role
                </label>
                <select
                  value={newOfficer.role}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                >
                  <option value="Collection Officer">Collection Officer</option>
                  <option value="Senior Officer">Senior Officer</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Status
                </label>
                <select
                  value={newOfficer.status}
                  onChange={(e) =>
                    setNewOfficer({
                      ...newOfficer,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
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
                onClick={handleAddOfficer}
                className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Officer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Officer Modal */}
      {showEditModal && selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Edit Officer</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={selectedOfficer.name}
                  onChange={(e) =>
                    setSelectedOfficer({
                      ...selectedOfficer,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedOfficer.email}
                  onChange={(e) =>
                    setSelectedOfficer({
                      ...selectedOfficer,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={selectedOfficer.phone}
                  onChange={(e) =>
                    setSelectedOfficer({
                      ...selectedOfficer,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Role
                </label>
                <select
                  value={selectedOfficer.role}
                  onChange={(e) =>
                    setSelectedOfficer({
                      ...selectedOfficer,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
                >
                  <option value="Collection Officer">Collection Officer</option>
                  <option value="Senior Officer">Senior Officer</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Status
                </label>
                <select
                  value={selectedOfficer.status}
                  onChange={(e) =>
                    setSelectedOfficer({
                      ...selectedOfficer,
                      status: e.target.value as "Active" | "Inactive",
                    })
                  }
                  className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-secondary-500 bg-surface"
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
                onClick={handleEditOfficer}
                className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Officer & Assignment Modal */}
      {showViewModal && selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text">
                Officer Details
              </h3>
              <button onClick={() => setShowViewModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Officer Info */}
              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-semibold text-text mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Name:</span>
                    <p className="font-medium text-text">
                      {selectedOfficer.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Email:</span>
                    <p className="font-medium text-text">
                      {selectedOfficer.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Phone:</span>
                    <p className="font-medium text-text">
                      {selectedOfficer.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Role:</span>
                    <p className="font-medium text-text">
                      {selectedOfficer.role}
                    </p>
                  </div>
                  <div>
                    <span className="text-text-muted">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOfficer.status === "Active"
                          ? "bg-success-bg text-success"
                          : "bg-error-bg text-error"
                      }`}
                    >
                      {selectedOfficer.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Join Date:</span>
                    <p className="font-medium text-text">
                      {selectedOfficer.joinDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              <div className="bg-surface rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-text">
                    Collection Point Assignment
                  </h4>
                </div>

                {selectedOfficer.assigned && selectedOfficer.assignedPoint ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-primary-800">
                            {selectedOfficer.assignedPoint}
                          </p>
                          <p className="text-sm text-primary-600">
                            Currently assigned
                          </p>
                        </div>
                        <button
                          onClick={removeOfficerFromPoint}
                          className="px-3 py-1 bg-error text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Remove Assignment
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-text-muted text-sm italic mb-3">
                      Not assigned to any collection point
                    </p>
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      Assign to Collection Point
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">
                Assign to Collection Point
              </h3>
              <button onClick={() => setShowAssignModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-text-muted text-sm">
                Select a collection point to assign {selectedOfficer.name}:
              </p>

              {collectionPoints
                .filter((point: CollectionPoint) => point.status === "Active")
                .map((point: CollectionPoint) => (
                  <div
                    key={point.id}
                    className="p-3 border border-card-border rounded-lg hover:bg-surface transition-colors cursor-pointer"
                    onClick={() => assignOfficerToPoint(point.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-text">{point.name}</p>
                        <p className="text-sm text-text-muted">
                          {point.location}
                        </p>
                        <p className="text-xs text-text-light">
                          {point.officers.length} officers assigned
                        </p>
                      </div>
                      <MapPin className="w-5 h-5 text-secondary-600" />
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-error-bg rounded-full">
                <AlertTriangle className="w-6 h-6 text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text">
                  Delete Officer
                </h3>
                <p className="text-text-muted">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-text mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedOfficer.name}</strong>? This will remove the
              officer from all assignments and the system permanently.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-card-border rounded-lg hover:bg-surface transition-colors text-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOfficer}
                className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Officer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudoOfficersManagement;
