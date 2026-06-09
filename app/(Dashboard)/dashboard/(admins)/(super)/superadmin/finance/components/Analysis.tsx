import PercentageBar from '@/UI/PercentageBar'
import React from 'react'

const Analysis = () => {
    const current = 0
    const target = 50
    // const percentage = (((current / target) * 100).toFixed(2) || '0') as string
    const percentage = 0

  return (
    <section className='bg-[#ffffff] px-4 py-2 rounded-[15px] mb-6'>
        <div className='md:w-[90%]'>
        <div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>
            <h1 className='text-[17px] font-semibold md:text-[22px] text-[#000000]'>Revenue Analysis and EOY Target</h1>
            <p className='text-[16px] text-[#6B7280]'>{percentage}%</p>
        </div>
        <div className='w-full space-y-4'>
            <PercentageBar percentage={percentage}/>
            <div className='flex justify-between'>
                <p>Current: ₦{current}M</p>
                <p>Target: ₦{target}M</p>
            </div>
        </div>
        </div>
    </section>
  )
}

export default Analysis