'use client'

import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { PiHandWavingFill } from 'react-icons/pi';

const Talk = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-2">
      {isOpen ? <div className="shadow-lg hover:bg-blue-700 bg-blue-600 p-3 rounded-full" onClick={toggleChat}>
        <HiOutlineChatAlt2 className="w-8 h-8 text-white cursor-pointer"/>
      </div>
      : <div className="shadow-lg chat py-3 px-6 rounded-full w-104">
        <div className='flex justify-between items-center'>
            <div className='inline-flex'>
                <span className='p-4 rounded-full bg-amber-300'></span>
                <span className='p-4 rounded-full bg-amber-300'></span>
                <span className='p-4 rounded-full bg-amber-300'></span>
            </div>
            <FaTimes className="w-6 h-6 text-white cursor-pointer" onClick={toggleChat}/>
        </div>
        <div>
            <p>Hello <PiHandWavingFill className='text-[#FFDC5D]'/></p>
        </div>
      </div>}
    </div>
  )
}

export default Talk