'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useClaimsStats } from '../ClaimsStatsContext';

interface EnrollClientProps {
  initialData?: number;
}

const ApproveClient: React.FC<EnrollClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useClaimsStats();
  const approvedCount = stats?.approved || initialData;

  return (
    <section className='bg-[#10B9811A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border-2 border-[#10B981]'>
      <div className='flex flex-col -space-y-1 w-full'>
          <p className='text-[15px] md:text-[16px]'>Approved</p>
          <h3 className='text-[17px] font-semibold md:text-[26px] text-[#10B981]'>
            {loading ? '...' : approvedCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Processed</p>
        </div>
    </section>
  );
};

export default ApproveClient;