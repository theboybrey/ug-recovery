"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import { getCookies, removeCookie, setCookie } from "typescript-cookie";

import { IUser } from "@/models/user.model";

// Officer and CollectionPoint interfaces (should match your dashboard page)
export interface Officer {
  id: number;
  name: string;
  email: string;
  phone: string;
  assigned?: boolean;
}

export interface CollectionPoint {
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

export interface AuthContextType {
  isLoggedIn: boolean;
  user: IUser | null;
  officers: Officer[];
  setOfficers: React.Dispatch<React.SetStateAction<Officer[]>>;
  items: CollectionPoint[];
  setItems: React.Dispatch<React.SetStateAction<CollectionPoint[]>>;
  login: (user: IUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function removeAllCookies() {
  const allCookies = getCookies();

  for (const cookieName in allCookies) {
    if (allCookies.hasOwnProperty(cookieName)) {
      removeCookie(cookieName);
    }
  }
}

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock officers and items (collection points)
  const mockOfficers = useMemo<Officer[]>(
    () => [
      { id: 1, name: "John Doe", email: "john@ug.edu.gh", phone: "0241234567" },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@ug.edu.gh",
        phone: "0245678910",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@ug.edu.gh",
        phone: "0242345678",
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah@ug.edu.gh",
        phone: "0243456789",
      },
      {
        id: 5,
        name: "David Brown",
        email: "david@ug.edu.gh",
        phone: "0244567890",
        assigned: false,
      },
      {
        id: 6,
        name: "Lisa Anderson",
        email: "lisa@ug.edu.gh",
        phone: "0245678901",
        assigned: false,
      },
      {
        id: 7,
        name: "Robert Taylor",
        email: "robert@ug.edu.gh",
        phone: "0246789012",
        assigned: false,
      },
    ],
    []
  );

  const mockItems = useMemo<CollectionPoint[]>(
    () => [
      {
        id: 1,
        name: "Main Entrance Gate",
        location: "University Main Gate",
        address: "Main Campus Road, University of Ghana",
        status: "Active",
        capacity: 50,
        currentItems: 23,
        officers: [
          {
            id: 1,
            name: "John Doe",
            email: "john@ug.edu.gh",
            phone: "0241234567",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@ug.edu.gh",
            phone: "0245678910",
          },
        ],
        createdAt: "2024-01-15",
        lastActivity: "2024-01-20",
        description: "Primary collection point at the main university entrance",
      },
      {
        id: 2,
        name: "Central Library",
        location: "Balme Library",
        address: "Library Road, Legon Campus",
        status: "Active",
        capacity: 30,
        currentItems: 12,
        officers: [
          {
            id: 3,
            name: "Mike Johnson",
            email: "mike@ug.edu.gh",
            phone: "0242345678",
          },
        ],
        createdAt: "2024-01-10",
        lastActivity: "2024-01-19",
        description: "Collection point inside the main library building",
      },
      {
        id: 3,
        name: "Sports Complex",
        location: "Sports Center",
        address: "Sports Complex, University of Ghana",
        status: "Inactive",
        capacity: 25,
        currentItems: 5,
        officers: [],
        createdAt: "2024-01-05",
        lastActivity: "2024-01-18",
        description: "Collection point at the university sports facilities",
      },
      {
        id: 4,
        name: "Hostel A Reception",
        location: "Commonwealth Hall",
        address: "Commonwealth Hall, Legon Campus",
        status: "Active",
        capacity: 40,
        currentItems: 18,
        officers: [
          {
            id: 4,
            name: "Sarah Wilson",
            email: "sarah@ug.edu.gh",
            phone: "0243456789",
          },
        ],
        createdAt: "2024-01-12",
        lastActivity: "2024-01-20",
        description: "Collection point at Commonwealth Hall reception",
      },
    ],
    []
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [items, setItems] = useState<CollectionPoint[]>([]);

  const login = useCallback(
    (user: IUser) => {
      setIsLoggedIn(true);
      setUser(user);
      setCookie("current_user", JSON.stringify(user));
      // Insert mock data on login
      setOfficers(mockOfficers);
      setItems(mockItems);
    },
    [mockOfficers, mockItems]
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setOfficers([]);
    setItems([]);
    removeAllCookies();
    window.location.href = "/signin";
  }, []);

  const contextValues = useMemo(
    () => ({
      user,
      isLoggedIn,
      officers,
      setOfficers,
      items,
      setItems,
      login,
      logout,
    }),
    [isLoggedIn, login, logout, user, officers, setOfficers, items, setItems]
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}
