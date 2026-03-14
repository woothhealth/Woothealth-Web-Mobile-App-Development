import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "WooHealth Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function DashboardLayout({
  children,
  totalUsers,
  pending,
  activeClient,
  activities,
  enrollees,
  welcome,
  tracking,
  telemedicineStats,
  head,
  revenue,
}: Readonly<{
  children: React.ReactNode;
  totalUsers: React.ReactNode;
  pending: React.ReactNode;
  head: React.ReactNode;
  activeClient: React.ReactNode;
  activities: React.ReactNode;
  enrollees: React.ReactNode;
  welcome: React.ReactNode;
  tracking: React.ReactNode;
  revenue: React.ReactNode;
  telemedicineStats: React.ReactNode;
}>) {
  return (
    <>
    <div className="relative w-full bg-[#FAFAFA] pb-4 space-y-2">
      <div className="sticky top-0">{welcome}</div>
      <div className="sticky">{head}</div>
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-1 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[96%] formDiv">
        <div>{totalUsers}</div>
        <div>{enrollees}</div>
        <div>{activeClient}</div>
        <div>{telemedicineStats}</div>
      </div>
      <div className="px-4 flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-[58%] md:space-y-4 border border-[#D9D9D9] rounded-[10px]">{revenue}</div>
        <div className="md:w-[40%] md:space-y-4 border border-[#D9D9D9] rounded-[10px]">{children}</div>
      </div>
      <div className="px-4 flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-[58%] md:space-y-4 border border-[#D9D9D9] rounded-[10px]">{activities}</div>
        <div className="md:w-[40%] md:space-y-4">
          <div className="border border-[#D9D9D9] rounded-[10px]">{pending}</div>
          <div className="border border-[#D9D9D9] rounded-[10px]">{tracking}</div>
        </div>
      </div>
    </div>
    </>
  );
}
