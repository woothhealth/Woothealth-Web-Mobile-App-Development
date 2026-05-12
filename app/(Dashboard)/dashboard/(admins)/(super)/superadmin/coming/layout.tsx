import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WooHealth Coming Soon - Super Admin Dashboard",
  description: "This page is under construction. Please check back later for updates.",
};

export default function ComingAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="px-4">{children}</div>
    </div>
    </>
  );
}