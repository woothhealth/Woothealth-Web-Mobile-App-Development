import React from 'react'
import { BiSolidFile } from 'react-icons/bi'
import { GoBellFill } from 'react-icons/go'
import { HiUsers } from 'react-icons/hi2'
import { IoWallet } from 'react-icons/io5'
import { MdAutorenew } from 'react-icons/md'
import { PiCardholderFill } from 'react-icons/pi'

const quick = [
  {
    icon: PiCardholderFill,
    action: 'Buy Plan'
  },
  {
    icon: IoWallet,
    action: 'Fund Wallet'
  },
  {
    icon: HiUsers,
    action: 'Add Member'
  },
  {
    icon: BiSolidFile,
    action: 'Reimbursement'
  },
]
const page = () => {
  return (
    <section className='p-4 my-4 flex gap-8 bg-[#FFFFFF] rounded-2xl'>
      <div className='w-[60%] space-y-5'>
        <h3 className='text-[20px] font-semibold'>Quick Actions</h3>
        <div className='flex justify-between'>
          {quick.map((item, index) => (
            <div key={index} className='flex flex-col items-center gap-1'>
              <div className='bg-[#49A5EF1A] border-[#49A5EF] border-2 p-4 w-fit rounded-full'>
                <item.icon className='text-[#49A5EF] text-3xl'/>
              </div>
              <p className='text-[18px]'>{item.action}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-[#49A5EF] p-4 rounded-2xl w-[40%] text-[#FFFFFF] space-y-2'>
        <h3 className='text-[18px]'><GoBellFill className='inline-flex mr-1 text-[#FBBF24]'/>Renewal Reminder</h3>
        <p>Your plan expires in 45 days. Renew now to avoid coverage gaps.</p>
        <div className='bg-[#FFFFFF] cursor-pointer rounded-2xl py-2 px-5 text-[#000000] font-semibold w-fit flex gap-3 items-center'>
          <MdAutorenew className='' /> Renew Plan
        </div>
      </div>

    </section>
  )
}

export default page