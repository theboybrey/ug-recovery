import RoleGuard from "@/guards/role-guard";

export default function Layout({
    children,
    admin,
    organizer,
}: {
    children: React.ReactNode;
    organizer: React.ReactNode
    admin: React.ReactNode

}) {
    return (
        <RoleGuard
            admin={admin}
            organizer={organizer}
        />
    );
}
