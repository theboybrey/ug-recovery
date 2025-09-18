"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import { getCookies, removeCookie, setCookie } from "typescript-cookie";
import { faker } from "@faker-js/faker";

import { IUser } from "@/models/user.model";

// Officer and CollectionPoint interfaces (should match your dashboard page)
export interface Officer {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "Active" | "Inactive";
  joinDate?: string;
  assigned?: boolean;
  assignedPoint?: string;
  assignedPointId?: number;
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

// Lost Item interface
export interface LostItem {
  id: number;
  name: string;
  description: string;
  category: string;
  foundAt: string;
  checkpointOffice: string;
  date: string;
  keyedInDate: string;
  retentionPeriod: number;
  status: "Available" | "Pending Verification" | "Claimed" | "Expired";
  founder: string;
  features?: string[];
  images: string[];
  mainImage: string;
}

// Category interface
export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  itemCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
  lastUpdated: string;
  iconName: string; // For dynamic icon selection
}

// ClaimRequest interface
export interface ClaimRequest {
  id: number;
  itemId: number;
  itemName: string;
  itemImage: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantStudentId?: string;
  description: string;
  identificationDetails: string;
  status: "Pending" | "Approved" | "Rejected" | "Under Review";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerNotes?: string;
  collectionPoint: string;
  appointmentDate?: string;
  verificationDocuments?: string[];
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: IUser | null;
  officers: Officer[];
  setOfficers: React.Dispatch<React.SetStateAction<Officer[]>>;
  items: CollectionPoint[];
  setItems: React.Dispatch<React.SetStateAction<CollectionPoint[]>>;
  lostItems: LostItem[];
  setLostItems: React.Dispatch<React.SetStateAction<LostItem[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  claimRequests: ClaimRequest[];
  setClaimRequests: React.Dispatch<React.SetStateAction<ClaimRequest[]>>;
  login: (user: IUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Categories for lost items
const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Accessories",
  "Documents",
  "Bags",
  "Keys",
  "Others",
];

// Generate mock lost items
export function generateMockItems(count = 60): LostItem[] {
  return Array.from({ length: count }).map((_, i) => {
    const images = Array.from({
      length: faker.number.int({ min: 1, max: 5 }),
    }).map(() => faker.image.urlPicsumPhotos({ width: 400, height: 300 }));
    return {
      id: i + 1,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: categories[i % categories.length],
      foundAt: faker.location.street(),
      checkpointOffice: faker.company.name(),
      date: faker.date
        .between({ from: "2025-09-01", to: "2025-09-28" })
        .toISOString()
        .slice(0, 10),
      keyedInDate: faker.date
        .between({ from: "2025-09-01", to: "2025-09-28" })
        .toISOString()
        .slice(0, 10),
      retentionPeriod: faker.number.int({ min: 1, max: 30 }),
      status: faker.helpers.arrayElement([
        "Available",
        "Pending Verification",
        "Available",
      ]) as "Available" | "Pending Verification",
      founder: faker.person.fullName(),
      features: faker.datatype.boolean()
        ? [faker.commerce.productAdjective(), faker.commerce.productMaterial()]
        : undefined,
      images,
      mainImage: images[0],
    };
  });
}

// Generate mock categories
function generateMockCategories(): Category[] {
  const categoryColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#6B7280", // Gray
  ];

  const categoryIcons = [
    "Smartphone", // Electronics
    "BookOpen", // Books
    "Shirt", // Clothing
    "Watch", // Accessories
    "FileText", // Documents
    "Briefcase", // Bags
    "Key", // Keys
    "Package", // Others
  ];

  return categories.map((name, index) => ({
    id: index + 1,
    name,
    description: `Category for ${name.toLowerCase()} items found on campus`,
    color: categoryColors[index],
    itemCount: faker.number.int({ min: 2, max: 25 }),
    status: "Active" as const,
    createdAt: faker.date.past().toISOString().slice(0, 10),
    lastUpdated: faker.date.recent().toISOString().slice(0, 10),
    iconName: categoryIcons[index],
  }));
}

// Generate mock claim requests
function generateMockClaimRequests(itemsData: LostItem[]): ClaimRequest[] {
  return Array.from({ length: 32 }).map((_, i) => {
    const randomItem = faker.helpers.arrayElement(itemsData);
    const submittedDate = faker.date.recent({ days: 30 });
    const status = faker.helpers.arrayElement([
      "Pending",
      "Approved",
      "Rejected",
      "Under Review",
    ]) as ClaimRequest["status"];
    const hasBeenReviewed = status !== "Pending";

    return {
      id: i + 1,
      itemId: randomItem.id,
      itemName: randomItem.name,
      itemImage: randomItem.mainImage,
      claimantName: faker.person.fullName(),
      claimantEmail: faker.internet.email(),
      claimantPhone: `024${faker.string.numeric(7)}`,
      claimantStudentId: faker.datatype.boolean()
        ? `UG${faker.string.numeric(8)}`
        : undefined,
      description: `I believe this is my ${randomItem.name.toLowerCase()}. ${faker.lorem.sentence()}`,
      identificationDetails: faker.lorem.sentences(2),
      status,
      submittedAt: submittedDate.toISOString().slice(0, 16).replace("T", " "),
      reviewedAt: hasBeenReviewed
        ? faker.date
            .between({
              from: submittedDate,
              to: new Date(),
            })
            .toISOString()
            .slice(0, 16)
            .replace("T", " ")
        : undefined,
      reviewedBy: hasBeenReviewed
        ? faker.helpers.arrayElement([
            "John Doe",
            "Jane Smith",
            "Mike Johnson",
            "Sarah Wilson",
          ])
        : undefined,
      reviewerNotes: hasBeenReviewed ? faker.lorem.sentence() : undefined,
      collectionPoint: faker.helpers.arrayElement([
        "Main Entrance Gate",
        "Central Library",
        "Sports Complex",
        "Hostel A Reception",
      ]),
      appointmentDate:
        status === "Approved"
          ? faker.date.future().toISOString().slice(0, 10)
          : undefined,
      verificationDocuments: faker.datatype.boolean()
        ? [
            faker.system.fileName({ extensionCount: 1 }),
            faker.system.fileName({ extensionCount: 1 }),
          ]
        : undefined,
    };
  });
}

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
      {
        id: 1,
        name: "John Doe",
        email: "john@ug.edu.gh",
        phone: "0241234567",
        role: "Collection Officer",
        status: "Active",
        joinDate: "2024-01-10",
        assigned: true,
        assignedPoint: "Main Entrance Gate",
        assignedPointId: 1,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@ug.edu.gh",
        phone: "0245678910",
        role: "Senior Officer",
        status: "Active",
        joinDate: "2024-01-12",
        assigned: true,
        assignedPoint: "Main Entrance Gate",
        assignedPointId: 1,
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@ug.edu.gh",
        phone: "0242345678",
        role: "Collection Officer",
        status: "Active",
        joinDate: "2024-01-15",
        assigned: true,
        assignedPoint: "Central Library",
        assignedPointId: 2,
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah@ug.edu.gh",
        phone: "0243456789",
        role: "Supervisor",
        status: "Active",
        joinDate: "2024-01-18",
        assigned: true,
        assignedPoint: "Hostel A Reception",
        assignedPointId: 4,
      },
      {
        id: 5,
        name: "David Brown",
        email: "david@ug.edu.gh",
        phone: "0244567890",
        role: "Collection Officer",
        status: "Active",
        joinDate: "2024-01-20",
        assigned: false,
      },
      {
        id: 6,
        name: "Lisa Anderson",
        email: "lisa@ug.edu.gh",
        phone: "0245678901",
        role: "Collection Officer",
        status: "Inactive",
        joinDate: "2024-01-22",
        assigned: false,
      },
      {
        id: 7,
        name: "Robert Taylor",
        email: "robert@ug.edu.gh",
        phone: "0246789012",
        role: "Collection Officer",
        status: "Active",
        joinDate: "2024-01-25",
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
            role: "Collection Officer",
            status: "Active",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@ug.edu.gh",
            phone: "0245678910",
            role: "Senior Officer",
            status: "Active",
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
            role: "Collection Officer",
            status: "Active",
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
            role: "Supervisor",
            status: "Active",
          },
        ],
        createdAt: "2024-01-12",
        lastActivity: "2024-01-20",
        description: "Collection point at Commonwealth Hall reception",
      },
    ],
    []
  );

  // Generate mock data
  const mockLostItems = useMemo<LostItem[]>(() => generateMockItems(84), []);
  const mockCategories = useMemo<Category[]>(
    () => generateMockCategories(),
    []
  );
  const mockClaimRequests = useMemo<ClaimRequest[]>(
    () => generateMockClaimRequests(mockLostItems),
    [mockLostItems]
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [items, setItems] = useState<CollectionPoint[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);

  const login = useCallback(
    (user: IUser) => {
      setIsLoggedIn(true);
      setUser(user);
      setCookie("current_user", JSON.stringify(user));
      // Insert mock data on login
      setOfficers(mockOfficers);
      setItems(mockItems);
      setLostItems(mockLostItems);
      setCategories(mockCategories);
      setClaimRequests(mockClaimRequests);
    },
    [mockOfficers, mockItems, mockLostItems, mockCategories, mockClaimRequests]
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setOfficers([]);
    setItems([]);
    setLostItems([]);
    setCategories([]);
    setClaimRequests([]);
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
      lostItems,
      setLostItems,
      categories,
      setCategories,
      claimRequests,
      setClaimRequests,
      login,
      logout,
    }),
    [
      isLoggedIn,
      login,
      logout,
      user,
      officers,
      setOfficers,
      items,
      setItems,
      lostItems,
      setLostItems,
      categories,
      setCategories,
      claimRequests,
      setClaimRequests,
    ]
  );

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
}
