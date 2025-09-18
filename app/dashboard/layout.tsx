"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AuthGuard from "@/guards/auth-guard";
import Footer from "@/components/footer/dashboard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthGuard>
        {/* sidebar with 30% */}
        <div className="flex h-full w-full max-h-screen overflow-hidden flex-col">
          <div className="flex flex-grow">
            <Sidebar />
            {/* main content with 70% */}
            <div className="flex-1 bg-white flex flex-col" key={pathname}>
              <header className="h-16 w-full shadow-md">
                <Navbar />
              </header>
              <main className="flex-grow p-4 text-text bg-gray-light max-h-[93vh] overflow-y-auto">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </AuthGuard>
    </LocalizationProvider>
  );
}
