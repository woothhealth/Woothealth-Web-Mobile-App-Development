import React from 'react'
import { TiClipboard } from "react-icons/ti";


const TrackingComponent = () => {
  return (
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
  )
}

export default TrackingComponent