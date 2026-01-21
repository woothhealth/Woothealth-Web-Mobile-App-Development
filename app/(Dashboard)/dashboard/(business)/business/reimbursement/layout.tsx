'use client'

import "@/styles/globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function ReimbursementLayout({
  header,
  Claims
}: Readonly<{
  header: React.ReactNode;
  Claims: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); 

  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex flex-col px-6 py-4 gap-4">
        <Link href='/dashboard/business/' className='border p-1 rounded-full inline-flex w-fit'>
          <FaArrowLeft className='text-2xl'/>
        </Link>
          <div className="bg-[#FFFFFF] md:px-6 rounded-[10px] py-1 md:w-[60%]">
            <nav className="">
              <ul className="flex justify-between">
                <li onClick={() => router.push('/dashboard/business/reimbursement')} className={`text-base md:text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/business/reimbursement' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Submit Reimbursement</li>
                <li onClick={() => router.push('/dashboard/business/reimbursement/track')} className={`text-base md:text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/business/reimbursement/track' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Track Reimbursement</li>
              </ul>
            </nav>
          </div>
          <div className="">
            {Claims}
          </div>
      </div>
    </div>
    </>
  );
}