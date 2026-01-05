import React from 'react'
import { IoShieldOutline } from 'react-icons/io5'
import Link from 'next/link'
import { getDashboardPlan } from '@/lib/dashboard'

const page = async() => {

  const data = await getDashboardPlan();
  return (
    <section className='dsbGrad w-44 md:w-[220px] py-6 rounded-[15px] text-[#FFFFFF] flex items-center px-4 md:h-full h-44'>
      <Link href='/dashboard/retail/plans' className='flex flex-col gap-6'>
        <div className='bg-[#49A5EF] p-2 rounded-[10px] w-fit text-3xl'>
          <IoShieldOutline/>
        </div>
        <div className='flex flex-col gap-1'>
          <p className='text-[15px] md:text-[16px]'>Active Plan</p>
          <h3 className='text-[17px] font-semibold md:text-[18px]'>{data.name}</h3>
        </div>
      </Link>
    </section>
  )
}

export default page