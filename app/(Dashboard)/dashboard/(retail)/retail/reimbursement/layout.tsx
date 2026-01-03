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
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex flex-col px-6 py-4 gap-4">
          <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-1 md:w-1/2">
            <nav className="">
              <ul className="flex justify-between">
                <li onClick={() => router.push('/dashboard/retail/reimbursement')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/retail/reimbursement' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Submit Claim</li>
                <li onClick={() => router.push('/dashboard/retail/reimbursement/track')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/retail/reimbursement/track' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Track Claim</li>
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