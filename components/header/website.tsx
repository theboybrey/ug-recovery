"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

export default function WebsiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 border-b border-primary-100 shadow-sm backdrop-blur"
          : "bg-transparent"
      } py-3 px-4 md:px-12 flex items-center justify-between`}
    >
      <Link href={"/"} className="flex items-center gap-3">
        <Image
          src="/assets/ugrecover.png"
          alt="UGRecover Logo"
          width={36}
          height={36}
          className="border border-white rounded bg-white"
        />
        <span className="font-bold text-xl tracking-wide text-primary-900">
          UGRecover
        </span>
      </Link>
      <nav className="flex gap-6 items-center">
        {/* <Link
          href="/"
          className="text-primary-900 font-medium hover:text-primary-700 transition"
        >
          Home
        </Link>
        <Link
          href="/browser"
          className="text-primary-900 font-medium hover:text-primary-700 transition"
        >
          Browse Items
        </Link> */}
        {/* <Link
          href="/signin"
          className="bg-primary text-white px-4 py-2 rounded font-semibold shadow hover:bg-primary-700 transition"
        >
          Admin Login
        </Link> */}
      </nav>
    </header>
  );
}
