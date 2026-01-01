import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "WooHealth Buy-Plan",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function ProvidersLayout({
  children,
  header
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="container w-full bg-[#FAFAFA] hidden lg:block">
      <div>{header}</div>
      <div className="px-4">{children}</div>
    </div>
    </>
  );
}