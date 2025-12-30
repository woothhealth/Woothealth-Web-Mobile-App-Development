'use client'

import React from 'react'
import { GoDotFill } from 'react-icons/go'
import { TbCurrencyNaira } from 'react-icons/tb'

const summary = [
  {
    id: 1,
    name: 'Lagos University Teaching Hospital',
    type: 'Outpatient',
    date: '2025-12-11',
    price: '15,000',
    tag: 'approved'
  },
  {
    id: 2,
    name: 'Path Care Laboratory',
    type: 'Diagnostic',
    date: '2025-11-20',
    price: '9,000',
    tag: 'pending'
  },
  {
    id: 3,
    name: 'MediPharm Pharmacy',
    type: 'Prescription',
    date: '2025-09-11',
    price: '12,000',
    tag: 'failed'
  },
  {
    id: 2,
    name: 'Lagos University Teaching Hospital',
    type: 'Outpatient',
    date: '2025-12-11',
    price: '15,000',
    tag: 'pending'
  },
  {
    id: 1,
    name: 'Path Care Laboratory',
    type: 'Diagnostic',
    date: '2025-11-20',
    price: '9,000',
    tag: 'approved'
  },
  {
    id: 1,
    name: 'MediPharm Pharmacy',
    type: 'Prescription',
    date: '2025-09-11',
    price: '12,000',
    tag: 'approved'
  }
]
      
const page = () => {
  return (
    <section className='flex gap-4'>
      <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-3 w-full space-y-4">
        <h3 className='text-lg font-semibold'>Recent Claims</h3>
        <div className='grid grid-cols-2 gap-3 h-80 overflow-x-auto custom-scrollbar pr-2'>
          {summary.map((item, index) => {
            const idNum = Number(item.id);
            const isFirst = idNum === 1;
            const isThird = idNum === 3;
            const tagClasses = isFirst ? 'bg-[#D1FAE5] text-[#10B981]' : isThird ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#FEF3C7] text-[#F59E0B]';
            return (
              <div key={index} className='border border-[#D9D9D9] rounded-[10px] p-4 flex justify-between'>
                <div className='flex flex-col gap-1.5'>
                  <p className='text-[16px]'>{item.name}</p>
                  <div className='flex items-center text-sm text-[#00000080]'>
                    <p className=''>{item.type}</p>
                    <span><GoDotFill className='text-xs ml-2 mr-0.5'/></span>
                    <p>{item.date}</p>
                  </div>
                  <p className='flex font-semibold items-center'><TbCurrencyNaira className='text-[1.35rem]'/> {item.price}</p>
                </div>
                <div className={`py-2 px-3 text-xs h-fit rounded-lg ${tagClasses}`}>{item.tag}</div>
              </div>
            )
          })}
        </div>
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