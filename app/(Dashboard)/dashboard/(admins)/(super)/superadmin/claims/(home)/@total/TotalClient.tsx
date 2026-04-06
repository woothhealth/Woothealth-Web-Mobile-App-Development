'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useClaimsStats } from '../ClaimsStatsContext';

interface TotalClientProps {
  initialData?: number;
}

const TotalClient: React.FC<TotalClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useClaimsStats();
  const totalCount = stats?.total || initialData;

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border-2 border-[#49A5EF]'>
        <div className='flex flex-col -space-y-1 w-full'>
          <p className='text-[15px] md:text-[16px]'>Total Claims</p>
          <h3 className='text-[17px] font-semibold md:text-[26px] text-[#49A5EF]'>
            {loading ? '...' : totalCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>All Time</p>
        </div>
    </section>
  );
};

export default TotalClient;