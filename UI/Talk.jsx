'use client'

import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { PiHandWavingFill, PiPaperPlaneRightFill } from 'react-icons/pi';

const Talk = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-2">
      {isOpen ? <div className="shadow-lg bg-[#49A5EF] p-3 rounded-full" onClick={toggleChat}>
        <HiOutlineChatAlt2 className="w-9 h-9 text-white cursor-pointer"/>
      </div>
      : 
      <>
      <div className="shadow-lg chat py-8 px-6 rounded-4xl md:w-104 flex flex-col gap-6">
        <div className='flex justify-between items-center'>
            <div className='-space-x-4'>
                <span className='p-2 border border-amber-50 rounded-full bg-amber-300'>Q</span>
                <span className='p-2 border border-amber-50 rounded-full bg-amber-300'>A</span>
                <span className='p-2 border border-amber-50 rounded-full bg-amber-300'>D</span>
            </div>
            <FaTimes className="w-6 h-6 text-white cursor-pointer" onClick={toggleChat}/>
        </div>
        <div className='text-lg'>
            <p>Hello <PiHandWavingFill className='text-[#FFDC5D] inline-flex text-2xl'/></p>
            <p>We&apos;re here to help</p>
        </div>
        <form className='w-full bg-[#FFFFFF] p-4 rounded-2xl flex items-center gap-4'>
            <div className='grow'>
                <h2>Send us a message</h2>
                <textarea type="text" placeholder="Type your message..." className='w-full resize-none pt-2 pb-1 border-b rounded-r-2xl rounded-l-lg border-gray-300 focus:outline-none'></textarea>
            </div>
            <button onClick={toggleChat}>
                <PiPaperPlaneRightFill className="w-6 h-6 text-blue-600 cursor-pointer"/>
            </button>
        </form>
      </div>
      </>}
    </div>
  )
}

export default Talk