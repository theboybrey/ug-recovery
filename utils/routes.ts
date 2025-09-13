import {
  Firstline,
  Home,
  Icon,
  Moneys,
  Python,
  Setting2,
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
          name: "Officers",
          path: "officers",
          Icon: User,
        },
        {
          name: "Items",
          path: "items",
          Icon: Firstline,
        },
        {
          name: "Settings",
          path: "settings",
          Icon: Setting2,
        },
      ];
    case IRoles.OFFICER:
      return [...defaults];
    // Add cases for other roles as needed
    default:
      return [...defaults];
  }
};
