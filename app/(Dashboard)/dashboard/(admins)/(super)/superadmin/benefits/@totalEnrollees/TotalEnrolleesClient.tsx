'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useBenefitsStatsContext } from '../BenefitsStatsContext';

interface TotalEnrolleesClientProps {
  initialData?: number;
}

const TotalEnrolleesClient: React.FC<TotalEnrolleesClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useBenefitsStatsContext();
  const totalEnrolleesCount = stats?.totalEnrollees || initialData;

  return (
    <section className='bg-[#8B5CF61A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#8B5CF6]'>
      <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>Total Enrollees</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#8B5CF6]'>
            {loading ? '...' : totalEnrolleesCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>Enrolled Users</p>
        </div>
    </section>
  );
};

export default TotalEnrolleesClient;