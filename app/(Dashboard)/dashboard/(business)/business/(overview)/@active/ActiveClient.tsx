'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';
import { useBusinessOverview } from '@/Components/BusinessOverviewContext';

interface ActiveClientProps {
  initialData?: number;
}

const ActiveClient: React.FC<ActiveClientProps> = ({ initialData = 0 }) => {
  const { overview, loading } = useBusinessOverview();
  const totalEmployees = overview?.totalEmployees || initialData;

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48'>
      <Link href='/dashboard/business/employees' className='flex flex-col space-y-2 w-full'>
        <div className='border-[#49A5EF] border bg-[#49A5EF1A] p-2 text-[#49A5EF] rounded-[10px] w-fit text-3xl'>
          <CiUser/>
        </div>
        <div className='flex flex-col'>
          <h3 className='text-[17px] font-semibold md:text-[26px]'>
            {loading ? '...' : totalEmployees.toLocaleString()}
          </h3>
          <p className='text-[15px] md:text-[16px]'>Total Employees</p>
        </div>
      </Link>
    </section>
  );
};

export default React.memo(ActiveClient);