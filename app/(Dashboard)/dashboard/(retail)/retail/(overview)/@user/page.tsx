"use client";

import React, { useEffect, useState } from 'react';
import { PiHandWaving } from 'react-icons/pi';

const Page = () => {
  return (
    <div className='flex px-6 flex-col py-4'>
      <h4>Welcome back,</h4>
      <p className='text-[24px] font-semibold'>AERRE <PiHandWaving className='inline-flex text-[#FAD416]' /></p>
    </div>
  );
};

export default Page;