'use client'

import React from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
import { FaRegClock } from 'react-icons/fa6'
import { MdOutlineFileDownload } from 'react-icons/md'

const page = () => {
  return (
    <section className='py-4 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
      <h3 className='font-semibold text-[20px]'>Medical Records</h3>
      <p>Request access to your complete medical records including test results, diagnoses, prescriptions, and consultation history.</p>
      <div className='bg-[#f8f8f8] rounded-md px-6 py-2 space-y-2'>
        <div className='flex space-x-4 items-start'>
          <div className='mt-1 text-[#49A5EF]'>
            <FaRegClock/>
          </div>
          <div>
            <p className='font-bold'>Processing Time</p>
            <p className='text-xs'>3-5 working days</p>
          </div>
        </div>

        <div className='flex space-x-4 items-start'>
          <div className='mt-1 text-[#49A5EF]'>
            <MdOutlineFileDownload/>
          </div>
          <div>
            <p className='font-bold'>Format</p>
            <p className='text-xs'>PDF document via email</p>
          </div>
        </div>
      </div>
      <button type='submit' className='bg-[#49A5EF] text-[#FFFFFF] py-2'>
        <FaRegFileAlt className='inline-flex mr-4'/> Request Medical Record
      </button>
    </section>
  )
}

export default page