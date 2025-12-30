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
      <div className="flex flex-col px-6 py-4">
          <div>
            <nav className="" style={{width: '50%'}}>
              <ul className="flex justify-between">
                <li onClick={() => router.push('/dashboard/reimbursement')} className={`${pathname?.includes('reimbursement') ? 'border-blue-600 border-b' : ''}`}>Submit Claim</li>
                <li onClick={() => router.push('/dashboard/reimbursement/track')} className={`${pathname?.includes('track') ? 'border-blue-600 border-b' : ''}`}>Track Claim</li>
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