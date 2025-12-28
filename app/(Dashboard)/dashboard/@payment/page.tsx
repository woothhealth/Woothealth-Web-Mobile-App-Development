import React from 'react'
import { FaDownload } from 'react-icons/fa'
import { TbCurrencyNaira } from 'react-icons/tb'

const page = () => {
  return (
  <section className='p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
    <h3 className='font-semibold text-[20px]'>Payments</h3>
    <div className='bg-[#FEF3C780] border border-[#B57406] rounded-lg flex justify-between items-center py-3 px-4'>
      <div className='flex flex-col gap-1'>
        <p className='text-[#B57406] text-[17px]'>Next Payment Due</p>
        <p className='text-[#F59E0B]'>December 1, 2025</p>
      </div>
      <div>
        <p className='flex items-center text-2xl text-[#B57406]'><TbCurrencyNaira className='text-3xl'/>285</p>
      </div>
    </div>
    <div className='flex flex-col gap-1'>
      <div className='flex justify-between text-[18px]'>
        <p>Paid this year:</p>
        <p className='flex items-center text-[#B57406]'><TbCurrencyNaira className='text-2xl'/>3,135</p>
      </div>
      <div className='flex justify-between text-[18px]'>
        <p>Total annual:</p>
        <p className='flex items-center text-[#B57406]'><TbCurrencyNaira className='text-2xl'/>3,420</p>
      </div>
    </div>
    <div className='btn rounded-xl flex justify-center py-3 text-lg items-center'>
      <FaDownload className='mr-2'/> Download Receipts
    </div>
  </section>
  )
}

export default page