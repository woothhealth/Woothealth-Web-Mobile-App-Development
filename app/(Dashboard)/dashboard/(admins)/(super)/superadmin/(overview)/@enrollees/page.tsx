'use client'

import React from 'react';
import Link from 'next/link';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { BsActivity } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';

const Page = () => {

  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-4 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border border-[#D9D9D9]'>
         <Link href='/dashboard/business/employees' className='flex flex-col space-y-4 w-full'>
           <div className='bg-[#8063E81A] p-2 text-[#8063E8] rounded-[10px] w-fit text-3xl'>
          <FaRegUser/>
           </div>
           <div className='flex flex-col leading-7'>
             <h4 className='text-[14px] md:text-[15px]'>Total Enrollees</h4>
             <h3 className='text-[17px] font-semibold md:text-[26px]'>
               38,891
             </h3>
             <p className='text-[14px] md:text-[15px]'>Active Plan Members</p>
           </div>
         </Link>
       </section>
  );
};

export default Page;