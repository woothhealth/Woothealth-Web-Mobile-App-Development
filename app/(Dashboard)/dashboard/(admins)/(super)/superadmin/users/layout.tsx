import type { Metadata } from "next";
import "@/styles/globals.css";
import Title from "../UIs/Title";


export const metadata: Metadata = {
  title: "WooHealth Providers",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function ProvidersLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <Title title="User Management"/>
      <div className="md:px-4">{children}</div>
    </div>
    </>
  );
}