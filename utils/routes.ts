import {
  AddSquare,
  Archive,
  Chart,
  Check,
  DocumentText,
  Firstline,
  Home,
  Icon,
  Location,
  Moneys,
  Notification,
  People,
  Python,
  Setting2,
  ShoppingBag,
  User,
} from "iconsax-react";

import { IRoles } from "@/models/roles.model";

export interface INavItem {
  name: string;
  path: string;
  Icon?: Icon;
}

export const getRoutes = (role: IRoles): INavItem[] => {
  const defaults = [
    {
      name: "Dashboard",
      path: "",
      Icon: Home,
    },
  ];

  switch (role) {
    case IRoles.SUDO:
      return [
        ...defaults,
        {
          name: "Collection Points",
          path: "collection-points",
          Icon: Location,
        },
        {
          name: "Officers",
          path: "officers",
          Icon: User,
        },
        {
          name: "All Items",
          path: "items",
          Icon: ShoppingBag,
        },
        {
          name: "All Claims",
          path: "claims",
          Icon: DocumentText,
        },
        {
          name: "Categories",
          path: "categories",
          Icon: Moneys,
        },
        {
          name: "Reports & Analytics",
          path: "reports",
          Icon: Chart,
        },
        {
          name: "Notifications",
          path: "notifications",
          Icon: Notification,
        },
        {
          name: "Archived Items",
          path: "archived",
          Icon: Archive,
        },
        {
          name: "Settings",
          path: "settings",
          Icon: Setting2,
        },
      ];

    case IRoles.OFFICER:
      return [
        ...defaults,
        {
          name: "Add New Item",
          path: "add-item",
          Icon: AddSquare,
        },
        {
          name: "My Items",
          path: "my-items",
          Icon: ShoppingBag,
        },
        {
          name: "Pending Claims",
          path: "pending-claims",
          Icon: DocumentText,
        },
        {
          name: "Verify & Release",
          path: "verify-release",
          Icon: Check,
        },
        {
          name: "My Collection Point",
          path: "my-collection-point",
          Icon: Location,
        },
        {
          name: "Released Items",
          path: "released-items",
          Icon: Firstline,
        },
      ];

    // If you need a Student role for internal management
    case IRoles.STUDENT:
      return [
        ...defaults,
        {
          name: "Browse Items",
          path: "browse-items",
          Icon: ShoppingBag,
        },
        {
          name: "My Claims",
          path: "my-claims",
          Icon: DocumentText,
        },
        {
          name: "Claim History",
          path: "claim-history",
          Icon: Firstline,
        },
      ];

    default:
      return [...defaults];
  }
};
