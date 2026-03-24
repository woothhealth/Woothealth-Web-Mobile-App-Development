'use client'

import React from 'react';
import Link from 'next/link';
import { FaRegFileLines } from 'react-icons/fa6';
import { LuFileText } from 'react-icons/lu';
import { useBusinessOverview } from '@/Components/BusinessOverviewContext';

interface ReimbursementClientProps {
  initialData?: number;
}

const ReimbursementClient: React.FC<ReimbursementClientProps> = ({ initialData = 0 }) => {
  const { overview, loading } = useBusinessOverview();
  const activeReimbursements = overview?.activeReimbursements || initialData;

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48'>
      <Link href='/dashboard/business/reimbursement' className='flex flex-col space-y-2 w-full'>
        <div className='border-[#10B981] border bg-[#D1FAE5] p-2 text-[#10B981] rounded-[10px] w-fit text-3xl'>
          <LuFileText/>
        </div>
        <div className='flex flex-col'>
          <h3 className='text-[17px] font-semibold md:text-[24px]'>
            {loading ? '...' : activeReimbursements.toLocaleString()}
          </h3>
          <p className='text-[15px] md:text-[16px]'>Active Reimbursements</p>
        </div>
      </Link>
    </section>
  );
};

export default ReimbursementClient;