import WebsiteFooter from "@/components/footer/website";
import WebsiteHeader from "@/components/header/website";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-background">
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
