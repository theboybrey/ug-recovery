"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/hooks/userContext";

const Settings = () => {
  const { user } = useAuthContext();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would update the user profile in context or via API
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <form
        className="bg-card-bg rounded-xl p-8 shadow-sm border border-card-border w-full max-w-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-primary-700">Settings</h2>
        {success && (
          <div className="mb-4 p-3 bg-success-bg text-success rounded-lg">
            Profile updated successfully!
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-text mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-card-border rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface"
            placeholder="Your phone number"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
