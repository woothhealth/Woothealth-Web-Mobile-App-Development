import React from 'react'
import { IoWalletOutline } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'
import Link from 'next/link'

const page = () => {
  return (
    <section className='dsbGrad w-40 md:w-[220px] py-6 rounded-[15px] text-[#FFFFFF] flex items-center px-4 h-44 md:h-full'>
      <Link href='/dashboard/retail/wallet' className='flex flex-col gap-8 md:gap-6 w-full'>
        <div className='bg-[#49A5EF] p-2 rounded-[10px] w-fit text-3xl'>
          <IoWalletOutline/>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[15px] md:text-[16px]'>Wallet Balance</p>
          <h3 className='flex items-end text-[17px] md:text-[18px]'><TbCurrencyNaira className='md:text-3xl text-2xl font-bold'/>0.00</h3>
        </div>
      </Link>
    </section>
  )
}

export default page