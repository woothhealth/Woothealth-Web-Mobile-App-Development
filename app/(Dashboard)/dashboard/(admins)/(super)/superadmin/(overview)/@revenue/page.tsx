import React from 'react'
import { IoWalletOutline } from 'react-icons/io5'
import BarChartView from '../../UIs/BarChart'
import { CiCalendar } from 'react-icons/ci'
import { IoIosArrowDown } from 'react-icons/io'

const Page = () => {
  return (
    <section className='bg-[#FFFFFF] py-4 text-[#000000] px-4 space-y-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex space-x-4'>
          <div className='px-2 flex items-center border border-[#D9D9D9] rounded-[5px] text-[15px]'>
            <IoWalletOutline className='text-sm' />
          </div>
          <h3 className='font-semibold text-lg'>Revenue Performance</h3>
        </div>
        <div className='flex flex-col gap-2 border border-[#D9D9D9] rounded-[15px] px-4 py-2 w-fit'>
          <div className='flex items-center gap-2'>
            <CiCalendar className='text-sm' />
            <p className='text-sm'>Monthly</p>
            <IoIosArrowDown className='text-sm' />
          </div>
        </div>
      </div>
      <BarChartView isAnimationActive={true}/>
    </section>
  )
}

export default Page