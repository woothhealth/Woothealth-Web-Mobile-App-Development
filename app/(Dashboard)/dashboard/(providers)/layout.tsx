import type { Metadata } from "next";
import "@/styles/globals.css";
import ScrollToTop from "@/Components/ScrollToTop";
import QueryProvider from '@/Components/QueryProvider';
import { Toaster } from "sonner";
import SideBar from "./Components/sideBar";

export const metadata: Metadata = {
  title: "WootHealth Provider Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function ProviderLayout({
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
          {children}
            <Toaster richColors position="top-right" />
        </QueryProvider>
      </main>
    </div>
  );
}