'use client'

import Link from 'next/link';
import React, { useState } from 'react'
import { FaHome, FaTimes } from 'react-icons/fa';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { MdHome } from 'react-icons/md';
import { PiHandWavingFill, PiPaperPlaneRightFill } from 'react-icons/pi';
import { TbMessage } from 'react-icons/tb';

const Talk = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    }

  return (
    <div className="fixed bottom-5 right-5 z-20 flex flex-col items-center">
      <div className='flex flex-col items-end gap-2'>
        {isOpen &&
          <div className="shadow-lg chat py-4 md:px-6 px-3 rounded-4xl w-70 md:w-90 h-100 flex flex-col justify-between">
            <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center pt-4'>
                <div className='-space-x-4'>
                    <span className='p-2 border border-amber-50 rounded-full bg-amber-300'>Q</span>
                    <span className='p-2 border border-amber-50 rounded-full bg-amber-300'>A</span>
                    <span className='p-2 border border-amber-50 rounded-full bg-amber-300'>D</span>
                </div>
                <FaTimes className="w-6 h-6 text-white cursor-pointer" onClick={toggleChat}/>
            </div>
            <div className='text-lg text-[#ffffff] leading-tight'>
                <p>Hello <PiHandWavingFill className='text-[#FFDC5D] inline-flex text-2xl'/></p>
                <p>We&apos;re here to help</p>
            </div>
            <form className='w-full bg-[#FFFFFF] py-2 px-4 rounded-2xl flex items-center gap-2 shadow-lg'>
                <div className='grow'>
                    <h2>Send us a message</h2>
                    <input type="text" placeholder="Type your message..." className='w-full resize-none py-2 border-b text-[0.95rem] rounded-r-2xl rounded-l-lg border-gray-300 focus:outline-none'/>
                </div>
                <button onClick={toggleChat}>
                    <PiPaperPlaneRightFill className="w-6 h-6 text-[#49A5EF] cursor-pointer"/>
                </button>
            </form>
            </div>
            <div className='flex items-center justify-between px-6 text-[#4A4A4A] border-t border-[#4A4A4A]/50 pt-2'>
              <Link href={`/`} className='flex flex-col items-center text-[0.95rem]'>
                <MdHome className='text-2xl'/>
                Home
              </Link>
              <Link href={`/`} className='flex flex-col items-center text-[0.95rem]'>
                <TbMessage className='text-2xl'/>
                Messages
              </Link>
            </div>
          </div>
        }
      <div className="shadow-lg bg-[#49A5EF] p-3 rounded-full w-fit" onClick={toggleChat}>
        {!isOpen ? <HiOutlineChatAlt2 className="w-9 h-9 text-white cursor-pointer"/> : <FaTimes className="w-6 h-6 text-white cursor-pointer"/>}
      </div>   
      </div>
      
    </div>
  )
}

export default Talk