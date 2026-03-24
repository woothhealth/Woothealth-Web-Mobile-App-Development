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
            <div className='flex md:space-x-4 space-y-4 md:space-y-0 flex-col md:flex-row justify-center items-center'>
            <Link href={'/'}>
                <button className='btn px-8 py-3 font-semibold'>
                    Go To Home
                </button>
            </Link>
            <Link href={'/business'}>
                <button className='border-2 border-[#49A5EF] px-6 py-3 font-semibold'>
                    Check our Business Plan
                </button>
            </Link>
            </div>
        </div>
    </section>
  )
}

export default comingSoon