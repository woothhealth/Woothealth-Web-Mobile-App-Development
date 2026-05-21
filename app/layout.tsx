import type { Metadata } from "next";
// import { Montserrat } from 'next/font/google';
import "@/styles/globals.css";
import { NotificationProvider } from "@/context/NotificationContext";

// const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WooHealth",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}