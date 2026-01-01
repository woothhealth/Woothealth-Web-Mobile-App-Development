import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "WooHealth Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function DashboardLayout({
  children,
  active,
  claimsSummary,
  dependant,
  learn,
  medical,
  payment,
  upcoming,
  wallet,
  welcome,
}: Readonly<{
  children: React.ReactNode;
  active: React.ReactNode;
  claimsSummary: React.ReactNode;
  dependant: React.ReactNode;
  learn: React.ReactNode;
  medical: React.ReactNode;
  payment: React.ReactNode;
  upcoming: React.ReactNode;
  wallet: React.ReactNode;
  welcome: React.ReactNode;
}>) {
  return (
    <>
    <div className="container w-full bg-[#FAFAFA]">
      <div>{welcome}</div>
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-0 lg:ml-6 mx-auto overflow-x-auto w-[95%]  md:overflow-hidden formDiv">
        <div>{active}</div>
        <div>{wallet}</div>
        <div>{dependant}</div>
        <div>{learn}</div>
      </div>
      <div className="px-4">{children}</div>
      <div className="px-4 flex gap-10">
        <div className="w-[60%] space-y-4">
          <div>{claimsSummary}</div>
          <div>{medical}</div>
        </div>
        <div className="w-[39%] space-y-4">
          <div>{payment}</div>
          <div>{upcoming}</div>
        </div>
      </div>
    </div>
    </>
  );
}
