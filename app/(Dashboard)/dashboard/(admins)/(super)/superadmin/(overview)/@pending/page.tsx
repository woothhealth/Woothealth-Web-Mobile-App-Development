import React from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { MdOutlinePendingActions } from 'react-icons/md'

const page = () => {
  return (
    <section className='py-4 md:p-4 flex gap-3 bg-[#FFFFFF] lg:space-x-16 rounded-[10px]'>
            <div className='bg-[#4755691A] p-2 w-fit h-fit rounded-[10px] text-[20px]'>
                <MdOutlinePendingActions />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <p className='text-[15px] font-semibold'>Pending Tickets</p>
              <div className='flex space-x-2 items-center'>
                <h3 className='text-[25px] font-semibold'>2,560</h3>
                <p className='text-sm flex items-center gap-2 text-[#10B981]'>
                  <FaArrowUp className='text-xs'/> 5.7%
                </p>
              </div>
              <p className='text-[13px]'>All time Activity</p>
            </div>
    </section>
  )
}

export default page