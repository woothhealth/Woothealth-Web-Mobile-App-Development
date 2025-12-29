import Link from 'next/link'
import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import "@/styles/globals.css";

const notFound = () => {
  return (
    <section className='sect flex items-center justify-center text-[#ededed] py-10 relative'>
        <div className='flex flex-col z-10 gap-4 items-center w-180'>
        <FaExclamationTriangle className='text-yellow-400 h-40 w-auto mb-5'/>
        <h2 className='font-extrabold text-4xl'>PAGE NOT FOUND</h2>
        <p className='text-xl font-bold text-center'>
          This is page is not available.
        </p>
        <Link href={'/'}>
          <button className='btn px-20 py-3 font-semibold'>
            Go Back
          </button>
        </Link>
      </div>
    </section>
  )
}

export default notFound