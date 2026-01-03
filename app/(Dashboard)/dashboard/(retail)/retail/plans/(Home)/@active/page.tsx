import React from 'react'
import { HiMiniUsers } from 'react-icons/hi2'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { IoShieldOutline } from 'react-icons/io5'
import { MdAutorenew } from 'react-icons/md'
import { TbCurrencyNaira } from 'react-icons/tb'

const page = () => {
  return (
    <section>
      <p className='mb-2 px-4 md:px-0 md:text-lg'>Manage your health insurance coverage and benefits</p>
    <div className='dsbGrad w-full py-6 text-[#FFFFFF] flex flex-col px-4 md:px-6 space-y-6 rounded-[10px]'>
      <div className='flex justify-between w-full'>
          <div className='flex gap-3'>
            <div className='bg-[#49A5EF] p-2 rounded-[10px] h-fit text-3xl'>
              <IoShieldOutline/>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-[16px]'>Active Plan</p>
              <h3 className='text-[18px]'>Retail Quantum Plan</h3>
            </div>
          </div>
          <div className='flex flex-col text-end'>
            <p className='text-[16px]'>HMO ID</p>
            <p className='text-[20px] font-semibold'>1306</p>
          </div>
      </div>
      <div>
        <p className='py-1 bg-[#10B981] px-4 rounded-full w-fit flex items-center gap-2'>
          <IoMdCheckmarkCircleOutline/> Coverage Active
        </p>
      </div>
      <div className='overflow-x-auto formDiv'>
      <div className='flex bg-black md:justify-between md:w-full w-[90%] gap-1'>
        <div className='flex flex-col gap-1 bg-[#49A5EF] rounded-[10px] justify-between px-4 py-3 w-40 md:w-50'>
          <p className='text-[16px] w-20'>Monthly Premium</p>
          <h3 className='flex items-end text-[20px] md:text-[22px]'><TbCurrencyNaira className='text-3xl md:text-4xl font-bold'/>34, 100</h3>
        </div>
        <div className='flex flex-col gap-1 bg-[#49A5EF] justify-between rounded-[10px] px-4 py-3 md:w-50 w-40'>
          <p className='text-[16px] w-20'>Covered Members</p>
          <h3 className='flex items-end text-[22px] gap-1'><HiMiniUsers className='text-3xl font-bold'/>4</h3>
        </div>
        <div className='flex flex-col justify-between gap-1 bg-[#49A5EF] rounded-[10px] px-4 py-3 md:w-50 w-40'>
          <p className='text-[16px]'>Next Renewal</p>
          <h3 className='text-[22px]'>Jan 10, 2025</h3>
        </div>
        <div className='flex flex-col gap-1 bg-[#49A5EF] rounded-[10px] justify-between px-4 py-3 md:w-50 w-40'>
          <p className='text-[16px]'>Plan Type</p>
          <h3 className='text-[20px] w-20'>Family Coverage</h3>
        </div>
      </div>
      </div>
      <div className='bg-[#FFFFFF] cursor-pointer rounded-2xl py-3 px-6 text-[#000000] w-fit flex gap-2 items-center'>
        <MdAutorenew className='text-xl' /> Renew Plan
      </div>
      </div>
    </section>
  )
}

export default page