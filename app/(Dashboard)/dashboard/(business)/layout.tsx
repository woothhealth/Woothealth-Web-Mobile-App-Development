import type { Metadata } from "next";
import "@/styles/globals.css";
import SideBar from "@/Components/SideBar";


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
          <main className="flex-1 w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
