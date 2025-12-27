import React from 'react'
import { HiOutlineUsers } from 'react-icons/hi'
import { HiMiniUsers } from 'react-icons/hi2'

const page = () => {
  return (
    <section className='dsbGrad w-[220px] py-6 rounded-[15px] text-[#FFFFFF] flex items-center px-4'>
      <div className='flex flex-col gap-6'>
        <div className='bg-[#49A5EF] p-2 rounded-[10px] w-fit text-3xl'>
          <HiOutlineUsers/>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[16px]'>Dependents</p>
          <h3 className='flex items-end text-[18px] gap-1'><HiMiniUsers className='text-3xl font-bold'/>5</h3>
        </div>
      </div>
    </section>
  )
}

export default page