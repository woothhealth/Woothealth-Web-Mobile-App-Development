import React from 'react'
import { PiHandWaving } from 'react-icons/pi'

const page = () => {
  return (
    <div className='flex px-6 flex-col py-4'>
        <h4>Welcome back,</h4>
        <p className='text-[24px] font-semibold'>Quadri <PiHandWaving className='inline-flex text-[#FAD416]'/></p>
      </div>
  )
}

export default page