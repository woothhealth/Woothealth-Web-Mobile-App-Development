'use client';

import type { Metadata } from "next";
import "@/styles/globals.css";
import { BusinessOverviewProvider } from "@/Components/BusinessOverviewContext";


// export const metadata: Metadata = {
//   title: "WooHealth Dashboard",
//   description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
// };

export default function DashboardLayout({
  children,
  active,
  plans,
  reimbursement,
  activities,
  utility,
  welcome,
  wallet,
}: Readonly<{
  children: React.ReactNode;
  active: React.ReactNode;
  plans: React.ReactNode;
  reimbursement: React.ReactNode;
  activities: React.ReactNode;
  utility: React.ReactNode;
  welcome: React.ReactNode;
  wallet: React.ReactNode;
}>) {
  return (
    <BusinessOverviewProvider>
    <>
    <div className="relative w-full bg-[#FAFAFA] pb-4">
      <div className="sticky top-0">{welcome}</div>
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-1 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
        <div>{active}</div>
        <div>{utility}</div>
        <div>{reimbursement}</div>
        <div>{wallet}</div>
      </div>
      <div className="px-4">{children}</div>
      <div className="px-4 flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="md:w-[39%] md:space-y-4">{plans}</div>
        <div className="md:w-[58%] md:space-y-4">{activities}</div>
      </div>
    </div>
    </>
    </BusinessOverviewProvider>
  );
}
