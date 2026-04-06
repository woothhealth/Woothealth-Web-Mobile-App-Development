import Link from 'next/link'
import React from 'react'
import "@/styles/globals.css";
import { LuConstruction } from 'react-icons/lu';

const comingSoon = () => {
  return (
    <section className='flex items-center justify-center py-16 relative'>
        <div className='flex flex-col z-10 gap-4 md:gap-6 items-center text-center lg:w-150 px-6'>
            <LuConstruction className='text-[#f4b740] h-30 md:h-40 w-auto'/>
            <h2 className='font-bold text-3xl md:text-4xl'>Page Under Construction</h2>
            <p className='text-xl text-center'>
                We are working hard to bring this feature to you. It'll be available soon - Stay tuned!
            </p>
            <Link href={'/dashboard/superadmin'}>
                <button className='btn px-8 py-3 font-semibold'>
                    Go To Overview
                </button>
            </Link>
            
        </div>
    </section>
  )
}

export default comingSoon