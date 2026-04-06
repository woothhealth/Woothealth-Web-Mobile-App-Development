import type { Metadata } from "next";
import "@/styles/globals.css";
import Title from "../../../UIs/Title";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";


export const metadata: Metadata = {
  title: "WooHealth Business Employees",
  description: "Woot Health is a digital health platform that provides access to healthcare services, including retail health plans, telemedicine, provider networks, and related health services.",
};

export default function EmployeeLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex items-center px-4 md:px-6 lg:px-8 py-4">
        <Link href='/dashboard/superadmin/enrollees' className='border p-1 rounded-full inline-flex'>
          <FaArrowLeft className='text-xl'/>
        </Link>
        <Title title="Add Enrollee"/>
      </div>
      <div className="p-4">{children}</div>
    </div>
    </>
  );
}