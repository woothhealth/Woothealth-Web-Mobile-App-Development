import React from 'react'
import SecurityForm from './SecurityForm';
import { SlScreenDesktop } from "react-icons/sl";
import { MdOutlinePhoneIphone } from 'react-icons/md';

export default function SecurityPanel() {
  return (
    <section className='flex flex-col space-y-6 lg:w-[55%] md:mx-auto h-fit'>
      <div className='flex flex-col space-y-6 bg-[#FFFFFF] rounded-xl p-6'>
        <div>
          <h3 className="text-xl font-semibold">Security</h3>
          <p className='text-[15px]'>Manage Manage your account settings and preferences</p>
        </div>
        <div className=''>
          <SecurityForm />
        </div>
      </div>
      <div className='flex flex-col space-y-6 bg-[#FFFFFF] rounded-xl p-6'>
        <h3 className="text-xl font-semibold">Devices and Activities</h3>
        <div className='flex flex-col space-y-4'>
          <div className='flex border border-[#D9D9D9] rounded-[10px] py-4 px-6 space-x-4'>
            <div className='bg-[#49A5EF1A] p-3 rounded-[5px]'>
              <SlScreenDesktop className='text-xl text-[#49A5EF]'/>
            </div>
            <div>
              <p className='text-[15px] font-semibold'>Chrome on Windows</p>
              <p className='text-sm'>Lagos, Nigeria</p>
            </div>
          </div>

          <div className='flex border border-[#D9D9D9] rounded-[10px] py-4 px-6 justify-between items-center'>
            <div className='flex space-x-4'>
              <div className='bg-[#49A5EF1A] p-3 rounded-[5px]'>
                <MdOutlinePhoneIphone className='text-xl text-[#49A5EF]'/>
              </div>
              <div>
                <p className='text-[15px] font-semibold'>Safari on Iphone</p>
                <p className='text-sm'>Lagos, Nigeria</p>
              </div>
            </div>
            <button className='text-base text-[#EF4444] font-semibold'>Remove</button>
          </div>
        </div>
      </div>
    </section>
  )
}