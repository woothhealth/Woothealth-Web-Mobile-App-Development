'use client'

import React from 'react';
import Link from 'next/link';
import { LuUsers } from 'react-icons/lu';

const Page = () => {

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-4 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border border-[#D9D9D9]'>
      <Link href='/dashboard/business/employees' className='flex flex-col space-y-4 w-full'>
        <div className='bg-[#49A5EF1A] p-2 text-[#49A5EF] rounded-[10px] w-fit text-3xl'>
          <LuUsers />
        </div>
        <div className='flex flex-col leading-7'>
          <h4 className='text-[14px] md:text-[15px]'>Total Users</h4>
          <h3 className='text-[17px] font-semibold md:text-[26px]'>
            45,234
          </h3>
          <p className='text-[14px] md:text-[15px]'>Registered Accounts</p>
        </div>
      </Link>
    </section>
  );
};

export default Page;