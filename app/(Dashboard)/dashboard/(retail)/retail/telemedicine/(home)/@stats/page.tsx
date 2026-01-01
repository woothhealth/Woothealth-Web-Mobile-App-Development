'use client'

import React from 'react'

const session = [
  {
    title: 'Total Consultation',
    num: '25'
  },
  {
    title: 'Average Rating',
    num: '4.8'
  },
  {
    title: 'Upcoming Sessions',
    num: '2'
  }
]
const page = () => {
  return (
    <section className='p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-[10px]'>
      <h3 className='font-semibold text-[20px]'>Your Statistics</h3>
      <div className='flex flex-col gap-3'>
        {session.map((item, index) => {
          return (
            <div key={index} className='border border-[#D9D9D9] rounded-[10px] px-4 py-3 flex justify-between'>
              <p className='text-[18px]'>{item.title}</p>
              <p className='text-[18px] font-semibold'>{item.num}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default page