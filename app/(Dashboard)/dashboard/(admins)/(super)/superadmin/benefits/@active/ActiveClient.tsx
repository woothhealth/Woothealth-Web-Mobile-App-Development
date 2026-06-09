'use client'

import React from 'react';
import { useBenefitsStatsContext } from '../BenefitsStatsContext';

interface ActiveClientProps {
  initialData?: number;
}

const ActiveClient: React.FC<ActiveClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useBenefitsStatsContext();
  const activeCount = stats?.active || initialData;

  return (
    <section className='bg-[#D1FAE5] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#10B981]'>
        <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>Active Plans</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#10B981]'>
            {loading ? '...' : activeCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Currently Active</p>
        </div>
    </section>
  );
};

export default ActiveClient;