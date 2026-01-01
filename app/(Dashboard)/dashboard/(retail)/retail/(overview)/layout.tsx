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
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-0 lg:ml-6 mx-auto overflow-x-auto w-[95%] formDiv">
        <div>{active}</div>
        <div>{wallet}</div>
        <div>{dependant}</div>
        <div>{learn}</div>
      </div>
      <div className="px-4">{children}</div>
      <div className="px-4 flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="md:w-[60%] md:space-y-4">
          <div>{claimsSummary}</div>
          <div>{medical}</div>
        </div>
        <div className="md:w-[39%] md:space-y-4">
          <div>{payment}</div>
          <div>{upcoming}</div>
        </div>
      </div>
    </div>
    </>
  );
}
