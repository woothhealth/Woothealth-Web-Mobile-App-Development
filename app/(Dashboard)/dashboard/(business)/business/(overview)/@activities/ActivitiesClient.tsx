'use client'

import React from 'react'
import { CiUser } from 'react-icons/ci'
import { FiFileText } from 'react-icons/fi'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { useBusinessOverview } from '@/Components/BusinessOverviewContext'

interface ActivityData {
  id: number;
  name: string;
  user: string;
  time: string;
  type: string;
  icon: string;
  amount: number;
}

const iconMap = {
  FiFileText: FiFileText,
  CiUser: CiUser,
  IoMdCheckmarkCircleOutline: IoMdCheckmarkCircleOutline,
};

interface ActivitiesClientProps {
  initialData?: ActivityData[];
}

const ActivitiesClient: React.FC<ActivitiesClientProps> = ({ initialData = [] }) => {
  const { overview, loading } = useBusinessOverview();
  const activities = overview?.recentActivities || initialData;

  if (loading) {
    return (
      <section className='py-4 px-2 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl w-full'>
        <div className='flex justify-between'>
            <h3 className='text-[20px] font-semibold'>Recent Activities</h3>
            <button className='bg-[#49A5EF1A] text-[#49A5EF] text-[11px] py-2 px-6 hover:underline'>View All</button>
        </div>
        <div className='text-center py-4'>Loading...</div>
      </section>
    );
  }

  return (
    <section className='py-4 px-2 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl w-full'>
        <div className='flex justify-between'>
            <h3 className='text-[20px] font-semibold'>Recent Activities</h3>
            <button className='bg-[#49A5EF1A] text-[#49A5EF] text-[11px] py-2 px-6 hover:underline'>View All</button>
        </div>
        {activities.length === 0 ? (
            <div className='text-center py-4'>No activity found</div>
        ) : (
            <div className='flex flex-col gap-4'>
                {activities.map((item, index) => {
                    const idNum = Number(item.id);
                    const isFirst = idNum === 1;
                    const isThird = idNum === 4;
                    const tagClasses = isFirst ? 'bg-[#49A5EF1A] text-[#49A5EF]' : isThird ? 'bg-[#8063E81A] text-[#8063E8]' : 'bg-[#D1FAE5] text-[#10B981]';
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || FiFileText;
                    return (
                    <div key={index} className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className={`p-1.5 rounded-lg text-[18px] ${tagClasses} `}>
                                <IconComponent />
                            </div>
                            <div>
                                <p className='text-[16px]'>{item.name}</p>
                                <p className='text-[14px] text-gray-600'>{item.user} - {item.type}</p>
                            </div>
                        </div>
                        <div className='text-end'>
                            <p className='font-semibold'>₦{item.amount?.toLocaleString() || '0'}</p>
                            <p className='text-xs'>{item.time} ago</p>
                        </div>
                    </div>
                )
                })}
            </div>
        )}
    </section>
  )
}

export default ActivitiesClient