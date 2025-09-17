"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  MapPin,
  Package,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useState } from "react";

const mockData = {
  officer: {
    myItems: 23,
    pendingClaims: 8,
    recoveredToday: 4,
    myCollectionPoint: "Main Entrance",
    recentItems: [
      {
        id: 1,
        name: "iPhone 14",
        category: "Electronics",
        date: "2024-01-15",
        status: "Pending",
      },
      {
        id: 2,
        name: "Red Backpack",
        category: "Accessories",
        date: "2024-01-14",
        status: "Claimed",
      },
      {
        id: 3,
        name: "CS Textbook",
        category: "Books",
        date: "2024-01-13",
        status: "Verified",
      },
    ],
    weeklyActivity: [
      { day: "Mon", logged: 3, released: 2 },
      { day: "Tue", logged: 5, released: 3 },
      { day: "Wed", logged: 4, released: 4 },
      { day: "Thu", logged: 6, released: 5 },
      { day: "Fri", logged: 8, released: 6 },
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
  const data = mockData.officer;
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">My Collection Point</h1>
          <p className="opacity-90">
            {data.myCollectionPoint} - Manage your items and claims
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Items at My Point"
            value={data.myItems}
            icon={Package}
            color="secondary"
          />
          <StatCard
            title="Pending Claims"
            value={data.pendingClaims}
            icon={AlertTriangle}
            color="alert"
          />
          <StatCard
            title="Recovered Today"
            value={data.recoveredToday}
            icon={CheckCircle}
            color="success"
          />
          <StatCard
            title="Collection Point"
            value={data.myCollectionPoint}
            icon={MapPin}
            color="primary"
          />
        </div>

        {/* Weekly Activity */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
            <Activity className="w-5 h-5 mr-2 text-secondary-600" />
            My Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6d8bf" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="logged"
                stroke="#b79a64"
                strokeWidth={3}
                dot={{ fill: "#b79a64" }}
              />
              <Line
                type="monotone"
                dataKey="released"
                stroke="#2f4a75"
                strokeWidth={3}
                dot={{ fill: "#2f4a75" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Items */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
            <Clock className="w-5 h-5 mr-2 text-secondary-600" />
            Recent Items
          </h3>
          <div className="space-y-3">
            {data.recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-card-border rounded-lg hover:bg-surface"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-surface-dim rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-text-muted" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{item.name}</h4>
                    <p className="text-sm text-text-muted">
                      {item.category} • {item.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Pending"
                      ? "bg-alert-bg text-alert"
                      : item.status === "Claimed"
                      ? "bg-primary-50 text-primary-600"
                      : "bg-success-bg text-success"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusFoundDashboard;
