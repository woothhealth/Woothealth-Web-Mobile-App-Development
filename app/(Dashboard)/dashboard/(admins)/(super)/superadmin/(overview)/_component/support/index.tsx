'use client'

import React from 'react';
import { Widget1, ActivitiesPage } from './widgets';

const SupportOverview = () => {
  return (
    <div className='space-y-6'>
      <Widget1 />
      <div className="px-2 md:px-4 md:mx-3 border border-[#D9D9D9] rounded-[10px] bg-[#FFFFFF]">
        <ActivitiesPage />
      </div>
    </div>
  );
};

export default SupportOverview;