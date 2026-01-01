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
      <div>{header}</div>
      <div className="px-4">{children}</div>
      <div className="px-4">{transaction}</div>
    </div>
    </>
  );
}