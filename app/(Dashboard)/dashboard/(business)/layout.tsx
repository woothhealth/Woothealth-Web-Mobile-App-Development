import type { Metadata } from "next";
import "@/styles/globals.css";
import SideBar from "./SideBar";
import ScrollToTop from "@/Components/ScrollToTop";
import DashboardProvider from '@/app/(Dashboard)/dashboard/BusinessDashboardProvider';
import QueryProvider from '@/Components/QueryProvider';
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "WootHealth Business Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function BusinessDashboardLayout({
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
          <DashboardProvider>{children}
            <Toaster richColors position="top-right" />
          </DashboardProvider>
        </QueryProvider>
      </main>
    </div>
  );
}