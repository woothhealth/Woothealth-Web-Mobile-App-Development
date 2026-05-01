import React from 'react'
import { TiClipboard } from "react-icons/ti";


const page = () => {
  return (
    <section className='p-4 flex flex-col space-y-4 bg-[#FFFFFF] rounded-[10px]'>
        <div className='flex items-center space-x-2 text-sm'>
            <div className='px-3 flex items-center border border-[#D9D9D9] rounded-[5px] text-sm'>
                <TiClipboard/>
            </div>
            <h3 className='font-semibold'>SLA Tracking</h3>
        </div>
        <div className='flex flex-col w-full space-y-2'>
            <div className='bg-[#D1FAE5] flex justify-between px-4 py-3 rounded-[10px]'>
                <h3 className='text-[14px]'>Resolved Requests</h3>
                <p className='text-[15px] font-semibold text-[#10B981]'>127</p>
            </div>
            <div className='bg-[#FEF3C7] flex justify-between px-4 py-3 rounded-[10px]'>
                <h3 className='text-[14px]'>In Progress</h3>
                <p className='text-[15px] font-semibold text-[#F59E0B]'>45</p>
            </div>
            <div className='bg-[#FEE2E2] flex justify-between px-4 py-3 rounded-[10px]'>
                <h3 className='text-[14px]'>Escalated</h3>
                <p className='text-[15px] font-semibold text-[#EF4444]'>12</p>
            </div>
        </div>
    </section>
  )
}

export default page