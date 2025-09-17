import RoleGuard from "@/guards/role-guard";

export default function Layout({
  children,
  sudo,
  officer,
  student,
}: {
  children: React.ReactNode;
  officer: React.ReactNode;
  sudo: React.ReactNode;
  student: React.ReactNode;
}) {
  console.log("Dashboard Layout - Rendering RoleGuard with children", {
    sudo: !!sudo,
    officer: !!officer,
    student: !!student,
  });
  return <RoleGuard sudo={sudo} officer={officer} student={student} />;
}
