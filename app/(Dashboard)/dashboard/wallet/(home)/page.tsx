'use client'

import React, { useState } from 'react'
import { CiBacon } from 'react-icons/ci'
import { FaEye, FaEyeSlash, FaMinus, FaPlus } from 'react-icons/fa6'
import Image from 'next/image'
import { TbCurrencyNaira } from 'react-icons/tb'
import Link from 'next/link'

const Page = () => {
  const [showBalance, setShowBalance] = useState(false);

  const balance = '1,000,000';
  const masked = '*'.repeat(balance.length);

  return (
    <section className='p-4 my-4 rounded-2xl'>
      <div className='flex w-full gap-8'>
        <div className='relative flex flex-col px-5 py-6 bg-[#49A5EF1A] text-[#49A5EF] rounded-lg space-y-4' style={{width: '55%'}}>
          <div className='flex justify-between text-[20px] items-center'>
            <h4 className=''>Current Balance</h4>
            <div className='cursor-pointer'>
              {!showBalance ? <FaEyeSlash onClick={() => setShowBalance((prev) => !prev)}/> : <FaEye onClick={() => setShowBalance((prev) => !prev)}/>}
            </div>
          </div>
          <div className='flex gap-4'>
            <p className='text-[45px] font-semibold flex items-center'>
              <TbCurrencyNaira className='text-6xl'/>
              {showBalance ? masked : balance}
            </p>
            <CiBacon className='text-9xl text-[#49A5EF4D] absolute bottom-1 right-0'/>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='flex bg-[#FFFFFF] rounded-xl p-3 items-center justify-center gap-6'>
            <Link href='/dashboard/wallet/fund'>
              <button className='btn flex items-center py-2 px-6 gap-2'>
                <FaPlus className=''/>Fund Wallet
              </button>
            </Link>
            <button className='py-2 flex items-center px-6 border-2 gap-2 text-[0.9rem] border-[#49A5EF]'>
              <FaMinus/>Withdraw Funds
            </button>
          </div>
          <div className='bg-[#FFFFFF] rounded-xl flex gap-3 p-3'>
            <Image src='/card_img.png' alt='card' width={100} height={100} className='h-10 object-contain' priority/>
            <div className='space-y-2'>
              <p className='text-[14px]'>Your account doesn&apos;t have an active payment card. Add a card to set up auto-renewal.</p>
              <button className='btn flex items-center py-2 px-4 text-sm gap-2'>
              <FaPlus className=''/> Add Card
            </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page