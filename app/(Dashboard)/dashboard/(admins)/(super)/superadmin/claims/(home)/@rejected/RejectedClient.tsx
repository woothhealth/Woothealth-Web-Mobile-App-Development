'use client'

import React from 'react';
import Link from 'next/link';
import { PiCopySimpleLight } from 'react-icons/pi';
import { useClaimsStats } from '../ClaimsStatsContext';

interface RejectedClientProps {
  initialData?: number;
}

const RejectedClient: React.FC<RejectedClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useClaimsStats();
  const rejectedCount = stats?.rejected || initialData;

  return (
    <section className='bg-[#EF44441A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border-2 border-[#EF4444]'>
        <div className='flex flex-col -space-y-1 w-full'>
          <p className='text-[15px] md:text-[16px]'>Rejected</p>
          <h3 className='text-[17px] font-semibold md:text-[26px] text-[#EF4444]'>
            {loading ? '...' : rejectedCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Not Approved</p>
        </div>
    </section>
  );
};

export default RejectedClient;