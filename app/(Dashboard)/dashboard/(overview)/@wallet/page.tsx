import React from 'react'
import { IoWalletOutline } from 'react-icons/io5'
import { TbCurrencyNaira } from 'react-icons/tb'

const page = () => {
  return (
    <section className='dsbGrad w-[220px] py-6 rounded-[15px] text-[#FFFFFF] flex items-center px-4'>
          <div className='flex flex-col gap-6'>
            <div className='bg-[#49A5EF] p-2 rounded-[10px] w-fit text-3xl'>
              <IoWalletOutline/>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-[16px]'>Wallet Balance</p>
              <h3 className='flex items-end text-[18px]'><TbCurrencyNaira className='text-3xl font-bold'/>1, 000,000</h3>
            </div>
          </div>
        </section>
  )
}

export default page