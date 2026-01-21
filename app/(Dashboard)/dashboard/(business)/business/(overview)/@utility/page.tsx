'use client'

import React from 'react';
import Link from 'next/link';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { BsActivity } from 'react-icons/bs';

const Page = () => {

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-6 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48'>
      <Link href='/dashboard/business' className='flex flex-col space-y-2 w-full'>
        <div className='border-[#886af4] border bg-[#8063E81A] p-2 text-[#8063E8] rounded-[10px] w-fit text-3xl'>
          <BsActivity/>
        </div>
        <div className='flex flex-col'>
          <h3 className='text-[17px] font-semibold md:text-[24px]'>
            33.6%
          </h3>
          <p className='text-[15px] md:text-[16px]'>Utilization Rate</p>
        </div>
      </Link>
    </section>
  );
};

export default Page;