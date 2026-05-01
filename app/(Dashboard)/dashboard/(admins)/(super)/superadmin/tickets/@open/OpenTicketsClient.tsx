'use client'

import React from 'react';
import { useTicketsStatsContext } from '../TicketsStatsContext';

interface OpenTicketsClientProps {
  initialData?: number;
}

const OpenTicketsClient: React.FC<OpenTicketsClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useTicketsStatsContext();
  const openCount = stats?.open || initialData;

  return (
    <section className='bg-[#8063E81A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#8063E8]'>
        <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>Opened</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#8063E8]'>
            {loading ? '...' : openCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Opened tickets</p>
        </div>
    </section>
  );
};

export default OpenTicketsClient;