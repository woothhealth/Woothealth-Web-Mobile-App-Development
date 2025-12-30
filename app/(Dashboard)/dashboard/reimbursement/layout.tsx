'use client'

import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";

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
    <div className="container w-full bg-[#FAFAFA] hidden lg:block">
      <div>{header}</div>
      <div className="flex flex-col px-6 py-4 gap-4">
          <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-1 w-fit" style={{width: '50%'}}>
            <nav className="">
              <ul className="flex justify-between">
                <li onClick={() => router.push('/dashboard/reimbursement')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/reimbursement' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Submit Claim</li>
                <li onClick={() => router.push('/dashboard/reimbursement/track')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/reimbursement/track' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Track Claim</li>
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