"use client";

import { ArrowLeft2, ArrowRight2, LogoutCurve } from "iconsax-react";
import { INavItem, getRoutes } from "../../utils/routes";
import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "typescript-cookie";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useAuthContext } from "@/hooks/userContext";
import { usePathname } from "next/navigation";

const NavItem: React.FC<INavItem & { collapsed: boolean }> = ({
  name,
  path,
  Icon,
  collapsed,
}) => {
  const pathname = usePathname();
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    // Extract the part after '/dashboard/' from pathname
    const getDashboardPath = (fullPath: string) => {
      if (!fullPath) return "";
      // Remove '/dashboard' prefix and any leading/trailing slashes
      return fullPath.replace(/^\/dashboard\/?/, "").replace(/\/+$/, "");
    };

    const currentPath = getDashboardPath(pathname);
    const itemPath = path || ""; // Handle empty path for dashboard

    // For dashboard root (empty path), check if currentPath is empty
    if (itemPath === "") {
      setActive(currentPath === "");
    } else {
      // For other paths, check exact match or if currentPath starts with itemPath
      setActive(
        currentPath === itemPath || currentPath.startsWith(itemPath + "/")
      );
    }
  }, [pathname, path]);

  return (
    <Link
      href={`/dashboard/${path}`}
      className={clsx(
        "flex items-center text-white w-full py-2 rounded-full transition-all duration-200 relative group hover:bg-primary-700",
        active && "bg-primary-800 text-white",
        collapsed ? "justify-center px-0" : "justify-start px-3"
      )}
      tabIndex={0}
    >
      {Icon && (
        <span
          className={clsx(
            collapsed ? "mx-0" : "mr-4",
            "transition-all duration-200"
          )}
        >
          {<Icon />}
        </span>
      )}
      {!collapsed && <span>{name}</span>}

      {/* Custom tooltip for collapsed state */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap bg-sidebar text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg border border-white/10">
          {name}
        </span>
      )}
    </Link>
  );
};

const SIDEBAR_COOKIE_KEY = "sidebar_collapsed";

const Sidebar = () => {
  const { user, logout } = useAuthContext();
  const routes = getRoutes(user?.role!);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // On mount, read cookie for sidebar state
  useEffect(() => {
    const cookie = getCookie(SIDEBAR_COOKIE_KEY);
    setCollapsed(cookie === "true");
  }, []);

  // When collapsed changes, update cookie
  useEffect(() => {
    setCookie(SIDEBAR_COOKIE_KEY, String(collapsed), { expires: 365 });
  }, [collapsed]);

  return (
    <div
      className={clsx(
        "h-full bg-sidebar relative transition-all duration-200 py-2",
        collapsed ? "w-16" : "w-1/6 min-w-[200px] max-w-xs"
      )}
    >
      {/* logo and collapse icon */}
      <div
        className={clsx(
          "flex items-center h-20 px-2 relative",
          collapsed
            ? "flex-col justify-center"
            : "flex-row justify-start gap-x-2"
        )}
      >
        <Image
          src="/assets/ugrecover.png"
          alt="logo"
          width={collapsed ? 48 : 40}
          height={collapsed ? 48 : 40}
          className="border border-white rounded bg-white transition-all duration-200"
        />
        {!collapsed && (
          <>
            <p className="font-bold text-white text-2xl ml-2">UGRecover.</p>
            <button
              aria-label="Collapse sidebar"
              onClick={() => setCollapsed(true)}
              className="p-1 rounded hover:bg-white/10 text-white ml-2"
              style={{ outline: "none", border: "none", background: "none" }}
            >
              <ArrowLeft2 size={22} />
            </button>
          </>
        )}
        {collapsed && (
          <button
            aria-label="Expand sidebar"
            onClick={() => setCollapsed(false)}
            className="p-1 rounded hover:bg-white/10 text-white mt-3"
            style={{ outline: "none", border: "none", background: "none" }}
          >
            <ArrowRight2 size={22} />
          </button>
        )}
      </div>
      <div
        className={clsx(
          "flex items-start mt-6 flex-col w-full transition-all duration-200",
          collapsed ? "pl-2 pr-0" : "px-2"
        )}
      >
        {/* nav with icons */}
        {routes.map((route, idx) => (
          <div
            key={route.path}
            className={clsx(
              "w-full",
              collapsed && "justify-center",
              idx !== 0 && "mt-3"
            )}
            style={collapsed ? { width: "100%" } : {}}
          >
            <NavItem {...route} collapsed={collapsed} />
          </div>
        ))}
      </div>

      {/* logout */}
      <div
        className={clsx(
          "absolute bottom-20 w-full",
          collapsed ? "px-2" : "px-8"
        )}
      >
        <div
          onClick={logout}
          className={clsx(
            "cursor-pointer flex items-center w-full h-16 text-white hover:text-gray transition-all duration-200",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogoutCurve />
          {!collapsed && <span className="ml-4">Logout</span>}
          {collapsed && <span className="sr-only">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
