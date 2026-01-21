import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "WooHealth Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function DashboardLayout({
  children,
  active,
  slot,
  enroll,
  header,
}: Readonly<{
  children: React.ReactNode;
  active: React.ReactNode;
  slot: React.ReactNode;
  enroll: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="relative w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[96%] formDiv">
        <div>{enroll}</div>
        <div>{active}</div>
        <div>{slot}</div>
      </div>
      <div className="px-4">{children}</div>
    </div>
    </>
  );
}
