import type { Metadata } from "next";
import "@/styles/globals.css";
import ScrollToTop from "@/Components/ScrollToTop";
import AdminDashboardProvider from '@/app/(Dashboard)/dashboard/AdminDashboardProvider';
import QueryProvider from '@/Components/QueryProvider';
import { Toaster } from "sonner";
import SideBar from "./Components/sideBar";

export const metadata: Metadata = {
  title: "WootHealth Administrator Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 w-full">
        <ScrollToTop/>
        <QueryProvider>
          <AdminDashboardProvider>{children}
            <Toaster richColors position="top-right" />
          </AdminDashboardProvider>
        </QueryProvider>
      </main>
    </div>
  );
}