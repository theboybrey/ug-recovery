import RoleGuard from "@/guards/role-guard";

export default function Layout({
  children,
  sudo,
  officer,
}: {
  children: React.ReactNode;
  officer: React.ReactNode;
  sudo: React.ReactNode;
}) {
  return <RoleGuard sudo={sudo} officer={officer} />;
}
