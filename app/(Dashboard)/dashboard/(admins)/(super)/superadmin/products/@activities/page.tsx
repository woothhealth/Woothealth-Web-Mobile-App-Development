'use client'

import React from 'react'
import { CiUser } from 'react-icons/ci'
import { FiFileText } from 'react-icons/fi'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { PiClockCounterClockwiseFill } from 'react-icons/pi'

const activity = [
    {
        id: 1,
        name: "Reimbursement Appreoved",
        user: "Adebayo Johnson",
        time: "5 mins",
        type: "Hospitalization",
        icon: FiFileText,
        price: "45,000"
    },
    {
        id: 2,
        name: "New Employee Added",
        user: "Quadri Adekunle",
        time: "5 mins",
        type: "enrolled in business Plan",
        icon: CiUser,
        price: "45,000"
    },
    {
        id: 2,
        name: "New Employee Added",
        user: "Samson Ajayi",
        time: "5 mins",
        type: "enrolled in business Plan",
        icon: CiUser,
        price: "45,000"
    },
    {
        id: 3,
        name: "Payment Processed",
        user: "December 2025",
        time: "5 mins",
        type: "premium payment",
        icon: IoMdCheckmarkCircleOutline,
        price: "45,000"
    },
    {
        id: 1,
        name: "Reimbursement Submitted",
        user: "Emeka Nwosu",
        time: "5 mins",
        type: "Lab Tests",
        icon: FiFileText,
        price: "45,000"
    }
]

const page = () => {
  return (
    <section className='p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl w-full'>
        <div className='flex justify-between'>
            <div className='flex items-center space-x-2 text-[20px] font-semibold'>
                <div className='px-2 flex items-center border border-[#D9D9D9] rounded-[5px] text-[15px]'>
                    <PiClockCounterClockwiseFill/>
                </div>
                <h3>Recent Activities</h3>
            </div>
            <button className='bg-[#49A5EF1A] text-[#49A5EF] text-[11px] py-2 px-6 hover:underline'>View All</button>
        </div>
        <div className='flex flex-col gap-2 h-74 pr-2 overflow-y-auto custom-scrollbar'>
            {activity.map((item, index) => {
                const idNum = Number(item.id);
                const isFirst = idNum === 1;
                const isThird = idNum === 3;
                const tagClasses = isFirst ? 'bg-[#49A5EF1A] text-[#49A5EF]' : isThird ? 'bg-[#8063E81A] text-[#8063E8]' : 'bg-[#D1FAE5] text-[#10B981]';
                return (
                <div key={index} className='flex items-center justify-between bg-[#E5E7EB33] py-2 px-3 rounded-[10px]'>
                    <div className='flex items-center gap-4'>
                        <div className={`p-1.5 rounded-lg text-[18px] ${tagClasses} `}>
                            <item.icon />
                        </div>
                        <div>
                            <p className='text-[16px]'>{item.name}</p>
                            <p className='text-[14px] text-gray-600'>{item.user} - {item.type}</p>
                        </div>
                    </div>
                    <div className='text-end'>
                        <p className='font-semibold'>₦{item.price}</p>
                        <p className='text-xs'>{item.time} ago</p>
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