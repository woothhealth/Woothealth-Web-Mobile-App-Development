'use client'

import React from 'react';
import { Widget1, PendingPage, ChartPage1, ChartPage2, ActivitiesPage, TrackingPage } from './widgets';

const SuperadminOverview = () => {
  return (
    <div className='space-y-6'>
      <Widget1 />
      <div className="px-2 md:px-4 flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-[58%] md:space-y-4 border border-[#D9D9D9] rounded-[10px]">
          <ChartPage1/>
        </div>
        <div className="md:w-[40%] space-y-4">
          <div className="border border-[#D9D9D9] rounded-[10px]">
            <PendingPage />
          </div>
          <div className="border border-[#D9D9D9] rounded-[10px]">
            <TrackingPage />
          </div>
        </div>
      </div>
      <div className="px-2 md:px-4 md:mx-3 border border-[#D9D9D9] rounded-[10px] bg-[#FFFFFF]">
        <ActivitiesPage />
      </div>
    </div>
  );
};

export default SuperadminOverview;