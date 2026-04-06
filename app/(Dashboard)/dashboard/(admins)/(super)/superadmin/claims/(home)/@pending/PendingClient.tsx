'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useClaimsStats } from '../ClaimsStatsContext';

interface PendingClientProps {
  initialData?: number;
}

const PendingClient: React.FC<PendingClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useClaimsStats();
  const pendingCount = stats?.pending || initialData;

  return (
    <section className='bg-[#FFDE001A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border-2 border-[#FFDE00]'>
        <div className='flex flex-col -space-y-1 w-full'>
          <p className='text-[15px] md:text-[16px]'>Pending Review</p>
          <h3 className='text-[17px] font-semibold md:text-[26px] text-[#FFDE00]'>
            {loading ? '...' : pendingCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Awaiting Decision</p>
        </div>
    </section>
  );
};

export default PendingClient;