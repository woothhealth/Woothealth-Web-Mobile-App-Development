import React from 'react'
import {  FaChevronDown } from 'react-icons/fa'
import { FaRegBell } from 'react-icons/fa6'

const page = () => {
  return (
    <section className=''>
      <div className='flex justify-between items-center px-6 py-4 bg-[#FFFFFF] border-b border-[#D9D9D9]'>
        <h2 className='text-[20px] font-bold'>PROFILE</h2>
        <div className='flex gap-5 items-center'>
          <div className='relative'>
            <FaRegBell className='text-[22px]'/>
            <div className='absolute right-0 -top-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[0.65rem] font-bold text-[#FFFFFF]'>2</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-amber-700 rounded-full'></div>
            <div className='leading-4'>
              <h3 className='font-bold'>Quadri Adekunle</h3>
              <p className='text-[14px]'>ID: 1306</p>
            </div>
          <FaChevronDown/>
          </div>
        </div>
      </div>
    </section>
  )
}

export default page