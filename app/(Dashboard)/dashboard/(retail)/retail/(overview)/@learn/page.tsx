import React from 'react'
import { GoBook } from 'react-icons/go'

const page = () => {
  return (
    <section className='dsbGrad w-44 md:w-[220px] py-6 rounded-[15px] text-[#FFFFFF] flex items-center px-4 md:h-full h-44'>
      <div className='flex flex-col gap-6'>
        <div className='bg-[#49A5EF] p-2 rounded-[10px] w-fit text-3xl'>
          <GoBook/>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[15px] md:text-[16px]'>Learn about</p>
          <h3 className='flex items-end text-[17px] md:text-[18px] gap-1 font-semibold'>WOOT HEALTH</h3>
        </div>
      </div>
    </section>
  )
}

export default page