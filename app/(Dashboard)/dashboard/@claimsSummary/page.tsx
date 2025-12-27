import React from 'react'

const page = () => {
  return (
    <section className='p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
      <h3 className='text-[20px]'>Claims Summary</h3>
      <div className='grid grid-cols-3 gap-5'>
        <div className='flex flex-col justify-center text-center bg-[#D1FAE5] rounded-[10px] py-4'>
          <p className='text-[#10B981] text-[20px]'>12</p>
          <p>Approved</p>
        </div>
        <div className='flex flex-col justify-center text-center bg-[#FEF3C7] rounded-[10px] py-4'>
          <p className='text-[#F59E0B] text-[20px]'>12</p>
          <p>Pending</p>
        </div>
        <div className='flex flex-col justify-center text-center bg-[#FEE2E2] rounded-[10px] py-4'>
          <p className='text-[#EF4444] text-[20px]'>12</p>
          <p>Failed</p>
        </div>
      </div>
    </section>
  )
}

export default page