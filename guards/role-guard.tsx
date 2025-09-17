"use client";

import { IRoles } from "@/models/roles.model";
import { removeCookie } from "typescript-cookie";
import { useAuthContext } from "@/hooks/userContext";

interface RoleProps {
  sudo: React.ReactNode;
  officer: React.ReactNode;
  student: React.ReactNode;
}

const RoleGuard: React.FC<RoleProps> = ({ sudo, officer, student }) => {
  const { user } = useAuthContext();

  if (!user) {
    window.location.href = "/signin";
    return <p>No User</p>;
  }
  switch (user.role) {
    case IRoles.SUDO:
      return sudo;
    case IRoles.OFFICER:
      return officer;
    case IRoles.STUDENT:
      return student;
    default:
      removeCookie("access_token");
      removeCookie("refresh_token");
      window.location.href = "/signin";
      return <p>Role not recognized</p>;
  }
};

export default RoleGuard;
