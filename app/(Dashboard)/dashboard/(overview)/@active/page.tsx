import React from 'react'
import { IoShieldOutline } from 'react-icons/io5'

const page = () => {
  return (
    <section className='dsbGrad w-[220px] py-6 rounded-[15px] text-[#FFFFFF] flex items-center px-4'>
      <div className='flex flex-col gap-6'>
        <div className='bg-[#49A5EF] p-2 rounded-[10px] w-fit text-3xl'>
          <IoShieldOutline/>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[16px]'>Active Plan</p>
          <h3 className='text-[18px]'>Retail Quantum Plan</h3>
        </div>
      </div>
    </section>
  )
}

export default page