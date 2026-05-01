import React from 'react'
import { IoWalletOutline } from 'react-icons/io5'
import BarChartView from '../../UIs/BarChart'
import { CiCalendar } from 'react-icons/ci'
import { IoIosArrowDown } from 'react-icons/io'

const Page = () => {
  return (
    <section className='py-4 text-[#000000] px-4 space-y-6'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div className='px-2 py-1 md:py-0 flex items-center h-fit border border-[#D9D9D9] rounded-[5px] text-[15px]'>
            <IoWalletOutline className='text-sm' />
          </div>
          <h3 className='font-semibold md:text-lg'>Revenue Performance</h3>
        </div>
        <div className='flex flex-col gap-1 md:gap-2 border border-[#D9D9D9] rounded-[15px] md:px-4 md:py-2 px-2 py-1 w-fit'>
          <div className='flex items-center gap-2'>
            <CiCalendar className='text-sm' />
            <p className='text-sm'>Monthly</p>
            <IoIosArrowDown className='text-xs md:text-sm' />
          </div>
        </div>
      </div>
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <BarChartView isAnimationActive={true}/>
      </div>
    </section>
  )
}

export default Page