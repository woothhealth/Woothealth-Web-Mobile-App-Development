'use client'

import React from 'react'
import { CiCalendar } from 'react-icons/ci'
import { FaRegFileAlt } from 'react-icons/fa'
import { GoDotFill } from 'react-icons/go'

const medic = [
  {
    id: 1,
    name: 'Blood Test Result',
    doc: 'Dr. Amaka Oknokwo',
    location: 'Lagos University Teaching Hospital',
    date: 'Dec. 24, 2025',
    tag: 'PDF',
    size: '2.3'
  },
  {
    id: 2,
    name: 'Chest X-Ray',
    doc: 'Dr. Chioma Nwosu',
    location: 'Radiology Center Lagos',
    date: 'Nov. 7, 2025',
    tag: 'JPG',
    size: '4.1'
  },
  {
    id: 2,
    name: 'Pregnancy Test Result',
    doc: 'Dr. Amaka Oknokwo',
    location: 'Lagos University Teaching Hospital',
    date: 'Jan. 16, 2025',
    tag: 'JPG',
    size: '2.3'
  },
  {
    id: 1,
    name: 'Blood Sugar diagnosis',
    doc: 'Dr. Chioma Nwosu',
    location: 'Lagos University Teaching Hospital',
    date: 'Jun. 15, 2025',
    tag: 'PDF',
    size: '2.3'
  },
]

const page = () => {
  return (
    <section className='py-4 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
      <h3 className='font-semibold text-[20px]'>Medical Records</h3>
      <div className='flex flex-col gap-2 h-60 overflow-x-auto custom-scrollbar pr-2'>
        {medic.map((item, index) => {
          const idNum = Number(item.id);
          const isFirst = idNum === 1;
          const tagClasses = isFirst ? 'bg-[#49A5EF1A] text-[#49A5EF]' : 'bg-[#D1FAE5] text-[#10B981]';
          return (
            <div key={index} className='border border-[#D9D9D9] rounded-[10px] p-4 flex justify-between'>
              <div className='flex gap-2'>
                <div className={`p-2 text-xs h-fit rounded-lg ${tagClasses}`}>
                  <FaRegFileAlt/>
                </div>
                <div className='flex flex-col gap-1.5'>
                  <p className='text-[16px]'>{item.name}</p>
                  <div className='flex items-center text-sm text-[#00000080] gap-1'>
                    <CiCalendar/>
                    <p>{item.date}</p>
                  </div>
                  <div className='flex items-center text-sm text-[#00000080]'>
                    <p className=''>{item.doc}</p>
                    <span><GoDotFill className='text-xs'/></span>
                    <p>{item.location}</p>
                  </div>
                </div>
              </div>
              <div className={`py-2 px-3 text-xs h-fit rounded-lg ${tagClasses}`}>{item.tag}</div>
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