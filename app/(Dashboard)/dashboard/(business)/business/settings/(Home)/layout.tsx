'use client'

import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";

export default function PlansLayout({
  header,
  security
}: Readonly<{
  header: React.ReactNode;
  security: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); 

  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex flex-col px-4 md:px-6 py-4 gap-4">
          <div className="rounded-[15px] bg-gray-100 px-2 py-2 w-fit">
            <nav className="">
              <ul className="flex gap-4">
                <li onClick={() => router.push('/dashboard/retail/settings')} className={`text-[14px] md:text-[16px] py-1 px-3 ${pathname === '/dashboard/retail/settings' ? 'bg-[#FFFFFF] rounded-2xl' : ''}`}>Security</li>

                <li onClick={() => router.push('/dashboard/retail/settings/more')} className={`text-[14px] md:text-[16px] py-1 px-3 ${pathname === '/dashboard/retail/settings/more' ? 'bg-[#FFFFFF] rounded-2xl' : ''}`}>More</li>
              </ul>
            </nav>
          </div>
          <div className="">
            {security}
          </div>
      </div>
    </div>
    </>
  );
}