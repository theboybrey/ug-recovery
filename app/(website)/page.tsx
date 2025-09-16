"use client";

import Image from "next/image";
import Link from "next/link";
import WebsiteFooter from "@/components/footer/website";
import WebsiteHeader from "@/components/header/website";
import { generateMockItems } from "@/utils/generateMockItems";
import { useEffect } from "react";
import { useState } from "react";

const categories = [
  {
    name: "Electronics",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Books",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Clothing",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Accessories",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Documents",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Bags",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Keys",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
  {
    name: "Others",
    icon: "/assets/file.svg",
    color: "bg-primary-100 text-primary-800",
  },
];

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [mockItems, setMockItems] = useState<any[]>([]);

  useEffect(() => {
    setMockItems(generateMockItems(3));
  }, []);

  return (
    <>
      <WebsiteHeader />
      <main className="min-h-screen bg-gradient-to-br from-primary-50 to-background flex flex-col">
        {/* Hero Section (reverted background) */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 gap-10 min-h-[420px]">
          <div className="flex-1 flex flex-col items-start justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-text-md">
              Welcome to <span className="text-primary">UGRecover</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 mb-6 max-w-xl">
              The campus lost & found platform. Browse, claim, and recover lost
              items with ease. Officers log found items, students submit claims,
              and everyone stays informed.
            </p>
            <div className="flex gap-4">
              <Link
                href="/browser"
                className="bg-primary text-white px-6 py-3 rounded font-semibold shadow hover:bg-primary-700 transition"
              >
                Browse Found Items
              </Link>
              <Link
                href="/signin"
                className="bg-white border border-primary text-primary px-6 py-3 rounded font-semibold shadow hover:bg-primary hover:text-white transition"
              >
                Admin/Officer Login
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/assets/empty.svg"
              alt="Lost and Found"
              width={400}
              height={400}
              className="w-full max-w-xs md:max-w-md"
            />
          </div>
        </section>

        {/* Global Search Section */}
        <section className="w-full flex justify-center items-center py-6 px-4 md:px-0 bg-white/80 shadow-sm z-10">
          <form
            className="flex flex-col md:flex-row gap-3 w-full max-w-3xl items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              if (searchCategory) params.set("category", searchCategory);
              window.location.href = `/browser${
                params.toString() ? `?${params}` : ""
              }`;
            }}
          >
            <select
              className="border border-primary-200 rounded px-4 py-2 text-base focus:outline-primary bg-white min-w-[140px] text-primary-900"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="border border-primary-200 rounded px-4 py-2 text-base flex-1 focus:outline-primary bg-white text-primary-900 placeholder:text-primary-300"
              placeholder="Search for an item (e.g. phone, bag, book)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded font-semibold shadow hover:bg-primary-700 transition"
            >
              Search
            </button>
          </form>
        </section>

        {/* Categories Section - horizontal scroll */}
        <section className="py-8 px-2 md:px-8 bg-white/80 rounded-3xl shadow mb-8 max-w-6xl mx-auto w-full">
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6 text-center">
            Browse by Category
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-primary-50 pb-2 px-1">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={{ pathname: "/browser", query: { category: cat.name } }}
                className={`flex flex-col items-center min-w-[120px] p-4 rounded-xl shadow hover:scale-105 transition ${cat.color} border border-primary-100`}
              >
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="font-semibold text-base whitespace-nowrap drop-shadow-text-sm">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Items Section */}
        <section
          id="items"
          className="bg-white/90 py-12 px-4 md:px-20 shadow-inner rounded-t-3xl mt-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 mb-8">
            Recently Found Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {mockItems.length > 0 &&
              mockItems.map((item) => (
                <Link
                  key={item.id}
                  href={{ pathname: "/browser", query: { id: item.id } }}
                  className="bg-card-bg rounded-xl shadow-sm hover:shadow-md p-6 flex flex-col items-center border border-card-border transition-all duration-200 hover:border-primary-300 hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="mb-4 w-full h-32 bg-gray-50 rounded-xl overflow-hidden group-hover:bg-primary-50 transition-colors duration-200">
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      width={200}
                      height={128}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/file.svg";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-text text-center group-hover:text-primary-700 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-800 mb-3 border border-primary-200">
                    {item.category}
                  </span>
                  <div className="text-center space-y-1 mb-4">
                    <p className="text-text-muted text-sm">
                      <span className="font-medium">Found at:</span>{" "}
                      {item.foundAt}
                    </p>
                    <p className="text-text-light text-xs">{item.date}</p>
                  </div>
                  <div className="mt-auto">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/browser"
              className="text-primary font-semibold hover:underline"
            >
              See all found items &rarr;
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 px-4 md:px-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
            Lost something?
          </h2>
          <p className="text-slate-700 mb-6">
            Submit a claim and our officers will help you recover your item as
            soon as possible.
          </p>
          <Link
            href="/claim"
            className="bg-primary text-white px-8 py-3 rounded font-semibold shadow hover:bg-primary-700 transition"
          >
            Submit a Report
          </Link>
        </section>
      </main>
      <WebsiteFooter />
    </>
  );
}
