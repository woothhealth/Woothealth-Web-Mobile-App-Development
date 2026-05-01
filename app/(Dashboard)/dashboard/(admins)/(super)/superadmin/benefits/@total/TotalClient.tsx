'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useBenefitsStatsContext } from '../BenefitsStatsContext';

interface TotalClientProps {
  initialData?: number;
}

const TotalClient: React.FC<TotalClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useBenefitsStatsContext();
  const totalCount = stats?.total || initialData;

  return (
    <section className='bg-[#49A5EF1A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#49A5EF]'>
        <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>Total Benefits</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#49A5EF]'>
            {loading ? '...' : totalCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>All Time</p>
        </div>
    </section>
  );
};

export default TotalClient;