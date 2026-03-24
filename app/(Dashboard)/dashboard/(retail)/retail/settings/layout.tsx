'use client'

import "@/styles/globals.css";

export default function PlansLayout({
  header,
  children
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {

  return (
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0 z-20">{header}</div>
      <div className="relative md:px-6">
        {children}
      </div>
    </div>
  );
}