'use client'

import "@/styles/globals.css";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";

export default function ProvidersLayout({
  family,
  header
}: Readonly<{
  family: React.ReactNode;
  header: React.ReactNode;
}>) {

  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="flex flex-col px-4 md:px-6 py-4 gap-4">
        <div className="flex items-center justify-between">
        <Link href='/dashboard/retail/plans' className='border p-1 rounded-full inline-flex h-fit'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
        <div className="rounded-[20px] bg-[#49A5EF1A] px-0.5 lg:px-2 py-2">
            <nav className="">
              <ul className="flex lg:gap-4">
                <li onClick={() => router.push('/dashboard/retail/buy-plans')} className={`text-[14px] md:text-[16px] py-1 px-3 ${pathname === '/dashboard/retail/buy-plans' ? 'bg-[#49A5EF] rounded-2xl text-[#FFFFFF]' : ''}`}>Family Plans</li>

                <li onClick={() => router.push('/dashboard/retail/buy-plans/individual')} className={`text-[14px] md:text-[16px] py-1 px-3 ${pathname === '/dashboard/retail/buy-plans/individual' ? 'bg-[#49A5EF] rounded-2xl text-[#FFFFFF]' : ''}`}>Individual Plans</li>
              </ul>
            </nav>
          </div>
          </div>
          <div className="px-4">{family}</div>
        </div>
    </div>
    </>
  );
}