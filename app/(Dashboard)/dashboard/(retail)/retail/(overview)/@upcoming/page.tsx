'use client'

import React from 'react'
import { LuClock4 } from 'react-icons/lu'

const session = [
  {
    id: 1,
    name: 'Dr. Amaka Okonkwo',
    specialist: 'General Physician',
    day: 'Today',
    time: '3:00 PM'
  },
  {
    id: 2,
    name: 'Dr. Ibrahim Suleiman',
    specialist: 'Cardiologist',
    day: 'Tomorrow',
    time: '10:30 AM'
  },
  {
    id: 2,
    name: 'Dr. David Anthony',
    specialist: 'Surgeon',
    day: 'Tomorrow',
    time: '1:00 PM'
  },
  {
    id: 1,
    name: 'Dr. Amaka Okonkwo',
    specialist: 'General Physician',
    day: 'Today',
    time: '3:00 PM'
  }
]
const page = () => {
  return (
    <section className='py-4 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
      <h3 className='font-semibold text-[20px]'>Upcoming Sessions</h3>
      <div className='flex flex-col gap-2 h-60 overflow-x-auto custom-scrollbar pr-2'>
        {session.map((item, index) => {
          const idNum = Number(item.id);
          const isFirst = idNum === 1;
          const tagClasses = isFirst ? 'bg-[#10B981]' : 'bg-[#B6B6B9]';
          return (
            <div key={index} className='border border-[#D9D9D9] rounded-[10px] md:p-4 p-2 flex justify-between'>
              <div className='flex gap-3'>
                <div className='h-12 w-12 rounded-full bg-cyan-300 flex items-end justify-end'>
                  <span className={`p-1 border-3 border-[#FFFFFF] rounded-full ${tagClasses}`}></span>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <p className='text-[16px] md:text-[18px]'>{item.name}</p>
                  <p className='text-[14px] md:text-[16px]'>{item.specialist}</p>
                  <div className='flex items-center text-xs md:text-sm text-[#00000080] gap-1'>
                    <LuClock4/>
                    <p>{item.day} at {item.time}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </section>
  )
}

export default page