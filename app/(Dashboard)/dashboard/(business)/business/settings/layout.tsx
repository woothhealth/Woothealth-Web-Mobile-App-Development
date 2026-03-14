'use client'

import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";

export default function PlansLayout({
  header,
  children
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {

  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="">
        {children}
      </div>
    </div>
    </>
  );
}