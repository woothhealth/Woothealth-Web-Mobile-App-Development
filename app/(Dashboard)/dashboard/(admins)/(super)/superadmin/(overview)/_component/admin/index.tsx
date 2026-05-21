'use client'

import React from 'react';
import { Widget1, PendingPage, ChartPage1, ChartPage2, ActivitiesPage, TrackingPage } from './widgets';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const AdminOverview = () => {
  return (
    <div className='space-y-6'>
      <Widget1 />
      <div className="px-2 md:px-4 flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-[58%] border border-[#D9D9D9] rounded-[10px] bg-[#FFFFFF]">
          <ChartPage1 />
        </div>
        <div className="md:w-[40%] border border-[#D9D9D9] rounded-[10px] bg-[#FFFFFF]">
          <ChartPage2 />
        </div>
      </div>
      <div className="px-2 md:px-4 flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-[58%] h-fit md:space-y-4 border border-[#D9D9D9] rounded-[10px]">
          <ActivitiesPage/>
        </div>
        <div className="md:w-[40%] space-y-4">
          <div className="border border-[#D9D9D9] rounded-[10px]">
            <PendingPage />
          </div>
          <div className="border border-[#D9D9D9] rounded-[10px]">
            <TrackingPage />
          </div>
          <Link href="/dashboard/superadmin/tariff" className='w-full py-3 bg-primary text-white rounded-[10px] hover:bg-primary/90 transition-colors duration-300 flex justify-between items-center px-4'>
            Tariffs
            <FaArrowRight className='' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
