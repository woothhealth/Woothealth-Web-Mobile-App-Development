import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "WooHealth",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function WalletLayout({
  children,
  header,
  transaction,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
  transaction: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0 z-10">{header}</div>
      <div className="md:px-4 px-1">{children}</div>
      <div className="md:px-4 px-2">{transaction}</div>
    </div>
    </>
  );
}