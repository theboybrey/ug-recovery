"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  MapPin,
  Package,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useState } from "react";

import { useAuthContext } from "@/hooks/userContext";

// Role enum
const IRoles = {
  SUDO: "SUDO",
  OFFICER: "OFFICER",
  STUDENT: "STUDENT",
};

// Mock data
const mockData = {
  sudo: {
    totalItems: 1247,
    recoveredItems: 892,
    activePoints: 12,
    pendingClaims: 34,
    weeklyStats: [
      { day: "Mon", found: 23, recovered: 18 },
      { day: "Tue", found: 31, recovered: 24 },
      { day: "Wed", found: 28, recovered: 22 },
      { day: "Thu", found: 35, recovered: 29 },
      { day: "Fri", found: 42, recovered: 31 },
      { day: "Sat", found: 18, recovered: 15 },
      { day: "Sun", found: 15, recovered: 12 },
    ],
    categoryData: [
      { name: "Electronics", value: 35, color: "#3B82F6" },
      { name: "Clothing", value: 25, color: "#10B981" },
      { name: "Books", value: 20, color: "#F59E0B" },
      { name: "Accessories", value: 15, color: "#EF4444" },
      { name: "Others", value: 5, color: "#8B5CF6" },
    ],
    collectionPoints: [
      { name: "Main Entrance", items: 45, recovered: 34 },
      { name: "Library", items: 32, recovered: 28 },
      { name: "Hostel A", items: 28, recovered: 22 },
      { name: "Sports Center", items: 24, recovered: 19 },
    ],
  },
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

// Dashboard Components for each role
const SuperAdminDashboard = () => {
  const data = mockData.sudo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">System Overview</h1>
        <p className="opacity-90">
          Monitor campus-wide lost and found operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items Logged"
          value={data.totalItems}
          icon={Package}
          trend={12}
          color="primary"
        />
        <StatCard
          title="Successfully Recovered"
          value={data.recoveredItems}
          icon={CheckCircle}
          trend={8}
          color="success"
        />
        <StatCard
          title="Active Collection Points"
          value={data.activePoints}
          icon={MapPin}
          color="secondary"
        />
        <StatCard
          title="Pending Claims"
          value={data.pendingClaims}
          icon={Clock}
          color="alert"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
            <Activity className="w-5 h-5 mr-2 text-primary-600" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.weeklyStats}>
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
              <Area
                type="monotone"
                dataKey="found"
                stackId="1"
                stroke="#2f4a75"
                fill="#2f4a75"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="recovered"
                stackId="1"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
            Item Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.categoryData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-text-muted">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Points Performance */}
      <div className="bg-card-bg rounded-xl p-6 shadow-sm border border-card-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-text">
          <MapPin className="w-5 h-5 mr-2 text-primary-600" />
          Collection Points Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.collectionPoints}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6d8bf" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="items" fill="#2f4a75" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recovered" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const OfficerDashboard = () => {
  const data = mockData.officer;

  return (
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
  );
};

const StudentDashboard = () => {
  const data = mockData.student;

  return (
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
          <div>• Check multiple categories - items might be misclassified</div>
          <div>• Provide detailed descriptions when claiming</div>
          <div>• Visit collection points regularly for new items</div>
          <div>• Keep your contact information updated</div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const CampusFoundDashboard = () => {
  const { user } = useAuthContext();
  const renderDashboard = () => {
    switch (user?.role) {
      case IRoles.SUDO:
        return <SuperAdminDashboard />;
      case IRoles.OFFICER:
        return <OfficerDashboard />;
      case IRoles.STUDENT:
        return <StudentDashboard />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">{renderDashboard()}</div>
  );
};

export default CampusFoundDashboard;
