"use client";
import React, { useState } from "react";

import { CheckCircle, Clock, Eye, MapPin, Package, Search } from "lucide-react";

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

const OfficerCollectionPoints: React.FC = () => {
  const { items: collectionPoints, user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  // Filter only points assigned to this officer
  const assignedPoints = collectionPoints.filter((point: CollectionPoint) =>
    point.officers.some((officer) => officer?.id === Number(user?._id))
  );

  // Filter by search and status
  const filteredPoints = assignedPoints.filter((point: CollectionPoint) => {
    const matchesSearch =
      point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || point.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats calculations for officer
  const totalPoints = assignedPoints.length;
  const activePoints = assignedPoints.filter(
    (p) => p.status === "Active"
  ).length;
  const totalCapacity = assignedPoints.reduce((sum, p) => sum + p.capacity, 0);
  const totalItems = assignedPoints.reduce((sum, p) => sum + p.currentItems, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">My Collection Points</h1>
          <p className="opacity-90">
            View and manage your assigned collection points
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-6 overflow-x-auto pb-2">
          <div className="min-w-[220px] bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Points</p>
                <p className="text-2xl font-bold text-text">{totalPoints}</p>
              </div>
              <MapPin className="w-8 h-8 text-secondary-600" />
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
            </div>
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
                    Current Items
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
                    <td className="p-4 text-text">{point.capacity}</td>
                    <td className="p-4 text-text">{point.currentItems}</td>
                    <td className="p-4 text-text-muted">
                      {point.lastActivity}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-secondary-600 hover:bg-secondary-50 rounded transition-colors"
                          // Officer can view items at this point
                          onClick={() => {
                            /* navigate to items page for this point */
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          // Officer can manage claims for this point
                          onClick={() => {
                            /* navigate to claims page for this point */
                          }}
                        >
                          <Package className="w-4 h-4" />
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
    </div>
  );
};

export default OfficerCollectionPoints;
