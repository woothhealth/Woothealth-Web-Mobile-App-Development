import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "WooHealth Dashboard",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function DashboardLayout({
  children,
  active,
  plans,
  reimbursement,
  learn,
  medical,
  activities,
  upcoming,
  utility,
  welcome,
  user,
}: Readonly<{
  children: React.ReactNode;
  active: React.ReactNode;
  plans: React.ReactNode;
  reimbursement: React.ReactNode;
  learn: React.ReactNode;
  medical: React.ReactNode;
  activities: React.ReactNode;
  upcoming: React.ReactNode;
  utility: React.ReactNode;
  welcome: React.ReactNode;
  user: React.ReactNode;
}>) {
  return (
    <>
    <div className="relative w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{welcome}</div>
      <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-0 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[96%] formDiv">
        <div>{active}</div>
        <div>{utility}</div>
        <div>{reimbursement}</div>
      </div>
      <div className="px-4">{children}</div>
      <div className="px-4 flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="md:w-[39%] md:space-y-4">{plans}</div>
        <div className="md:w-[58%] md:space-y-4">{activities}</div>
      </div>
    </div>
    </>
  );
}
