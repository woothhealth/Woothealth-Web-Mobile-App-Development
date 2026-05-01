'use client'

import React from 'react';
import { useTicketsStatsContext } from '../TicketsStatsContext';

interface ProgressTicketsClientProps {
  initialData?: number;
}

const ProgressTicketsClient: React.FC<ProgressTicketsClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useTicketsStatsContext();
  const progressCount = stats?.progress || initialData;

  return (
    <section className='bg-[#FFDE001A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#F59E0B]'>
        <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>In Progress</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#F59E0B]'>
            {loading ? '...' : progressCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Progressing tickets</p>
        </div>
    </section>
  );
};

export default ProgressTicketsClient;