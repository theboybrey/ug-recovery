"use client";

import {
  ArrowUpRight,
  Award,
  Clock,
  Eye,
  Filter,
  Package,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/hooks/userContext";

// Mock data
const mockData = {
  student: {
    activeClaims: 2,
    successfulRecoveries: 5,
    recentItems: [
      {
        id: 1,
        name: "Black Laptop Bag",
        location: "Library",
        date: "2024-01-15",
        image: "/api/placeholder/100/100",
      },
      {
        id: 2,
        name: "Blue Water Bottle",
        location: "Sports Center",
        date: "2024-01-14",
        image: "/api/placeholder/100/100",
      },
      {
        id: 3,
        name: "Math Notebook",
        location: "Lecture Hall",
        date: "2024-01-13",
        image: "/api/placeholder/100/100",
      },
    ],
  },
};

// Animated Counter Component
const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  prefix = "",
  suffix = "",
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  trend?: number;
  color?: "primary" | "secondary" | "success" | "alert" | "accent" | "error";
}) => {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-600",
    secondary: "bg-secondary-50 text-secondary-600",
    success: "bg-success-bg text-success",
    alert: "bg-alert-bg text-alert",
    accent: "bg-accent-light text-accent",
    error: "bg-error-bg text-error",
  };

  return (
    <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-lg ${
            colorClasses[color] || colorClasses.primary
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend > 0 ? "text-success" : "text-error"
            }`}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-text mb-1">
        <AnimatedCounter
          value={value as number}
          prefix={prefix}
          suffix={suffix}
        />
      </h3>
      <p className="text-text-muted text-sm">{title}</p>
    </div>
  );
};

// Main Dashboard Component
const CampusFoundDashboard = () => {
  const data = mockData.student;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-primary-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Find Your Lost Items</h1>
          <p className="opacity-90">Browse found items and track your claims</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Active Claims"
            value={data.activeClaims}
            icon={Clock}
            color="accent"
          />
          <StatCard
            title="Successful Recoveries"
            value={data.successfulRecoveries}
            icon={Award}
            color="success"
          />
          <StatCard
            title="Items Available"
            value={156}
            icon={Package}
            color="primary"
          />
        </div>

        {/* Search Section */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
            <Search className="w-5 h-5 mr-2 text-accent" />
            Quick Search
          </h3>
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for your lost item..."
                className="w-full px-4 py-3 border border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-surface"
              />
            </div>
            <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
            <button className="px-6 py-3 border border-card-border rounded-lg hover:bg-surface transition-colors flex items-center">
              <Filter className="w-5 h-5 mr-2 text-text-muted" />
              Filter
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
            <Eye className="w-5 h-5 mr-2 text-accent" />
            Recently Found Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentItems.map((item) => (
              <div
                key={item.id}
                className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow bg-surface"
              >
                <div className="w-full h-32 bg-surface-dim rounded-lg mb-3 flex items-center justify-center">
                  <Package className="w-8 h-8 text-text-muted" />
                </div>
                <h4 className="font-medium text-text mb-1">{item.name}</h4>
                <p className="text-sm text-text-muted mb-2">{item.location}</p>
                <p className="text-xs text-text-light mb-3">{item.date}</p>
                <button className="w-full px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-accent/90 transition-colors">
                  Claim Item
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Tips */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
          <h3 className="text-lg font-semibold mb-3 text-primary-800">
            💡 Recovery Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-700">
            <div>
              • Check multiple categories - items might be misclassified
            </div>
            <div>• Provide detailed descriptions when claiming</div>
            <div>• Visit collection points regularly for new items</div>
            <div>• Keep your contact information updated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusFoundDashboard;
