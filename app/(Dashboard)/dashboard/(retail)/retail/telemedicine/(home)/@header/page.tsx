'use client'

import React, { useState } from 'react'
import {  FaChevronDown } from 'react-icons/fa'
import { FaRegBell } from 'react-icons/fa6'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import Toggle from '@/UI/Toggle'
import { IoCloseOutline } from 'react-icons/io5'

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
        setMenuOpen(!menuOpen);
  }
  
  return (
    <>
    <section className='relative'>
      <div className='flex justify-between items-center px-6 py-6 bg-[#FFFFFF] border-b border-[#D9D9D9]'>
        <div className='text-[20px] flex items-center gap-4'>
          <div className='block lg:hidden'>
            {!menuOpen ? <HiOutlineMenuAlt2 className='text-3xl cursor-pointer' onClick={openMenu}/> : <IoCloseOutline className='text-3xl cursor-pointer' onClick={openMenu} /> }
          </div>
          <h2 className='font-bold'>TELEMEDICINE</h2>
        </div>
        <div className='flex gap-5 items-center'>
          <div className='relative border rounded-full p-1'>
            <FaRegBell className='text-[18px]'/>
            <div className='absolute right-0 top-0 p-1 bg-red-500 rounded-full'></div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 bg-amber-700 rounded-full'></div>
            <div className='leading-4'>
              <h3 className='font-bold'>Quadri Adekunle</h3>
              <p className='text-[14px]'>ID: 1306</p>
            </div>
          <FaChevronDown/>
          </div>
        </div>
      </div>
    </section>
    <Toggle isOpen={menuOpen} />
    </>
  )
}

export default Page