import type { Metadata } from "next";
import "@/styles/globals.css";
import SideBar from "./SideBar";
import ScrollToTop from "@/Components/ScrollToTop";
import DashboardProvider from '@/app/(Dashboard)/dashboard/DashboardProvider';
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "WooHealth",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <SideBar />
          <main className="flex-1 w-full">
            <ScrollToTop/>
            <DashboardProvider>{children}
              <Toaster richColors position="top-right" />
            </DashboardProvider>
          </main>
        </div>
      </body>
    </html>
  );
}