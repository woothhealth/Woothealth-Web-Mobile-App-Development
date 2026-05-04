'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useEmployeeStats } from '../EnrolleesStatsContext';

interface EnrollClientProps {
  initialData?: number;
}

const EnrollClient: React.FC<EnrollClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useEmployeeStats();
  const enrolledCount = stats?.totalEnrollees || initialData;

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border border-[#D9D9D9]'>
      <div className='flex flex-col space-y-2 w-full'>
        <div className='bg-[#8063E81A] p-2 text-[#8063E8] rounded-[10px] w-fit text-3xl'>
          <CiUser/>
        </div>
        <div className='flex flex-col'>
          <p className='text-[15px] md:text-[16px]'>Total Enrollees</p>
          <h3 className='text-[19px] font-semibold md:text-[26px]'>
            {loading ? '...' : enrolledCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>All Registered Enrollees</p>
        </div>
      </div>
    </section>
  );
};

export default EnrollClient;