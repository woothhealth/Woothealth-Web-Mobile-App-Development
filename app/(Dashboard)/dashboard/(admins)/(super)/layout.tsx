import type { Metadata } from "next";
import "@/styles/globals.css";
import ScrollToTop from "@/Components/ScrollToTop";
import AdminDashboardProvider from '@/app/(Dashboard)/dashboard/AdminDashboardProvider';
import QueryProvider from '@/Components/QueryProvider';
import { Toaster } from "sonner";
import SideBar from "./Components/sideBar";
import WelcomeTopBar from "./superadmin/UIs/WelcomeTopBar";

export const metadata: Metadata = {
  title: "WootHealth Administrator Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function AdminMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminDashboardProvider>
      <div className="flex min-h-screen">
        <SideBar />
        <main className="flex-1 w-full">
          <ScrollToTop />
          <QueryProvider>
            <div className="sticky top-0 z-50">
              <WelcomeTopBar />
            </div>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </main>
      </div>
    </AdminDashboardProvider>
  );
}