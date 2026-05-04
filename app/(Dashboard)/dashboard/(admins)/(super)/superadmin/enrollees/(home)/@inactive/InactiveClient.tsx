'use client'

import React from 'react';
import { useEmployeeStats } from '../EnrolleesStatsContext';
import { CiUser } from 'react-icons/ci';

interface SlotClientProps {
  initialData?: number;
}

const InactiveClient: React.FC<SlotClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useEmployeeStats();
  const slotsAvailable = stats?.slotsAvailable || initialData;

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border border-[#D9D9D9]'>
      <div className='flex flex-col space-y-2 w-full'>
        <div className='bg-[#FEE2E2] p-2 text-[#EF4444] rounded-[10px] w-fit text-3xl'>
          <CiUser />
        </div>
        <div className='flex flex-col'>
          <p className='text-[15px] md:text-[16px]'>Inactive</p>
          <h3 className='text-[19px] font-semibold md:text-[26px]'>
            {loading ? '...' : slotsAvailable.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Suspended or Expired</p>
        </div>
      </div>
    </section>
  );
};

export default InactiveClient;