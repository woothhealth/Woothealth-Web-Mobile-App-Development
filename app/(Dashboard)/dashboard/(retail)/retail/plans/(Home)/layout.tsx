'use client'

import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";

export default function PlansLayout({
  header,
  overview,
  active
}: Readonly<{
  header: React.ReactNode;
  overview: React.ReactNode;
  active: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); 

  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex flex-col md:px-6 py-4 gap-4">
        <div>{active}</div>
          <div className="bg-[#FFFFFF] md:px-6 px-2 rounded-[10px] py-1 w-full">
            <nav className="">
              <ul className="flex justify-between">
                <li onClick={() => router.push('/dashboard/retail/plans')} className={`text-[15px] md:text-[18px] font-semibold md:p-2 p-1 ${pathname === '/dashboard/retail/plans' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Overview</li>

                <li onClick={() => router.push('/dashboard/retail/plans/coverage')} className={`text-[15px] md:text-[18px] font-semibold md:p-2 p-1 ${pathname === '/dashboard/retail/plans/coverage' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Coverage</li>

                <li onClick={() => router.push('/dashboard/retail/plans/members')} className={`text-[15px] md:text-[18px] font-semibold md:p-2 p-1 ${pathname === '/dashboard/retail/plans/members' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Members</li>

                <li onClick={() => router.push('/dashboard/retail/plans/PA-codes')} className={`text-[15px] md:text-[18px] font-semibold md:p-2 p-1 ${pathname === '/dashboard/retail/plans/PA-codes' ? 'border-b-2 border-[#49A5EF]' : ''}`}>PA Codes</li>
              </ul>
            </nav>
          </div>
          <div className="">
            {overview}
          </div>
      </div>
    </div>
    </>
  );
}