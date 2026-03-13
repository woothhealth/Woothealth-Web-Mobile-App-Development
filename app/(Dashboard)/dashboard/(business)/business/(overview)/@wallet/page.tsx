import React from 'react'
import { IoWalletOutline } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import Link from 'next/link'

const page = () => {
  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48'>
      <Link href='/dashboard/business/wallet' className='flex flex-col space-y-2 w-full'>
        <div className='border-[#49A5EF] border bg-[#49A5EF1A] p-2 text-[#49A5EF] rounded-[10px] w-fit text-3xl'>
          <IoWalletOutline/>
        </div>
        <div className='flex flex-col'>
          <h3 className='flex items-center text-[17px] font-semibold md:text-[26px]'>
            <TbCurrencyNaira className='md:text-3xl text-2xl font-bold'/>0.00
          </h3>
          <p className='text-[15px] md:text-[16px]'>Wallet Balance</p>
        </div>
      </Link>
    </section>
  )
}

export default page