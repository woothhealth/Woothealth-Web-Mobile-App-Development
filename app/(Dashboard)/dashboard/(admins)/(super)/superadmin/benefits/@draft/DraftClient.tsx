'use client'

import React from 'react';
import Link from 'next/link';
import { PiCopySimpleLight } from 'react-icons/pi';
import { useBenefitsStatsContext } from '../BenefitsStatsContext';

interface DraftClientProps {
  initialData?: number;
}

const DraftClient: React.FC<DraftClientProps> = ({ initialData = 0 }) => {
  const { stats, loading } = useBenefitsStatsContext();
  const draftCount = stats?.draft || initialData;

  return (
    <section className='bg-[#FFDE001A] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 h-fit border-2 border-[#F59E0B]'>
        <div className='flex flex-col w-full'>
          <p className='text-[16px] md:text-[17px]'>Draft Benefits</p>
          <h3 className='text-[19px] font-semibold md:text-[26px] text-[#F59E0B]'>
            {loading ? '...' : draftCount.toLocaleString()}
          </h3>
          <p className='text-[13px] md:text-[14px]'>In Draft</p>
        </div>
    </section>
  );
};

export default DraftClient;