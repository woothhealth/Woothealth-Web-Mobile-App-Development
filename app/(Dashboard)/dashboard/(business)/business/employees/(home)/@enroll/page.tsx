'use client'

import React from 'react';
import Link from 'next/link';
import { CiUser } from 'react-icons/ci';

const Page = () => {

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-4 rounded-[15px] text-[rgb(0,0,0)] border border-[#D9D9D9] flex items-center px-4 md:h-fit h-48'>
      <Link href='/dashboard/business' className='flex flex-col space-y-2 w-full'>
        <div className='border-[#8063E8] border bg-[#8063E81A] p-2 text-[#8063E8] rounded-[10px] w-fit text-xl'>
          <CiUser/>
        </div>
        <div className='flex flex-col leading-6'>
          <p className='text-[13px] md:text-[14px]'>Total Enrollees</p>
          <h3 className='text-[17px] font-semibold md:text-[26px]'>
            100
          </h3>
          <p className='text-[13px] md:text-[14px]'>All Registered Enrollees</p>
        </div>
      </Link>
    </section>
  );
};

export default Page;