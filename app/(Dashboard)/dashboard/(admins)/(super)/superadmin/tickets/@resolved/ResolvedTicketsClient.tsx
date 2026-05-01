'use client'

import React from 'react';
import { useTicketsStatsContext } from '../TicketsStatsContext';

interface ResolvedTicketsClientProps {
  initialData?: number;
}

const ResolvedTicketsClient: React.FC<ResolvedTicketsClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useTicketsStatsContext();
  const resolvedCount = stats?.resolved || initialData;

  return (
    <section className='bg-[#10B9811A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#10B981]'>
        <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>Resolved</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#10B981]'>
            {loading ? '...' : resolvedCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Resolved tickets</p>
        </div>
    </section>
  );
};

export default ResolvedTicketsClient;