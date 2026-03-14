import React from 'react'
import { IoWalletOutline } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import Link from 'next/link'

const page = () => {
  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-4 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border border-[#D9D9D9]'>
         <Link href='/dashboard/business/wallet' className='flex flex-col space-y-4 w-full'>
          <div className='bg-[#FFEDD5] p-2 text-[#F97316] rounded-[10px] w-fit text-3xl'>
            <IoWalletOutline/>
           </div>
           <div className='flex flex-col leading-7'>
             <h4 className='text-[14px] md:text-[15px]'>Telemedicines Requests</h4>
             <h3 className='text-[17px] font-semibold md:text-[26px]'>
               2,847
             </h3>
             <p className='text-[14px] md:text-[15px]'>Registered Accounts</p>
           </div>
         </Link>
       </section>
  )
}

export default page