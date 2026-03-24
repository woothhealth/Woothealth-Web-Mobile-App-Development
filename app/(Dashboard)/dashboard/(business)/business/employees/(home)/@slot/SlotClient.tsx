'use client'

import React from 'react';
import Link from 'next/link';
import { PiCopySimpleLight } from 'react-icons/pi';
import { useEmployeeStats } from '../EmployeeStatsContext';

interface SlotClientProps {
  initialData?: number;
}

const SlotClient: React.FC<SlotClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useEmployeeStats();
  const slotsAvailable = stats?.slotsAvailable || initialData;

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48'>
      <div className='flex flex-col space-y-2 w-full'>
        <div className='border-[#49A5EF] border bg-[#49A5EF1A] p-2 text-[#49A5EF] rounded-[10px] w-fit text-3xl'>
          <PiCopySimpleLight/>
        </div>
        <div className='flex flex-col'>
          <h3 className='text-[17px] font-semibold md:text-[26px]'>
            {loading ? '...' : slotsAvailable.toLocaleString()}
          </h3>
          <p className='text-[15px] md:text-[16px]'>Slots</p>
        </div>
      </div>
    </section>
  );
};

export default SlotClient;