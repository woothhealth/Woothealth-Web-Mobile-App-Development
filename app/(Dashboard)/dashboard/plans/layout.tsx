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
    <div className="container w-full bg-[#FAFAFA] hidden lg:block">
      <div>{header}</div>
      <div className="flex flex-col px-6 py-4 gap-4">
        <div>{active}</div>
          <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-1 w-full">
            <nav className="">
              <ul className="flex justify-between">
                <li onClick={() => router.push('/dashboard/plans')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/plans' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Overview</li>

                <li onClick={() => router.push('/dashboard/plans/coverage')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/plans/coverage' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Coverage</li>

                <li onClick={() => router.push('/dashboard/plans/members')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/plans/members' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Members</li>

                <li onClick={() => router.push('/dashboard/plans/claims')} className={`text-[18px] font-semibold py-2 px-2 ${pathname === '/dashboard/plans/claims' ? 'border-b-2 border-[#49A5EF]' : ''}`}>Claims</li>
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