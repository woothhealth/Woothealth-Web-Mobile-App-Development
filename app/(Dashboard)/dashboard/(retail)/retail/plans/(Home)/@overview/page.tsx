import PercentageBar from '@/UI/PercentageBar'
import Link from 'next/link'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import { PiPillFill } from 'react-icons/pi'
import { TbCurrencyNaira, TbStethoscope } from 'react-icons/tb'

const coverage = [
  {
    icon: TbStethoscope,
    name: "Hospital Care",
    limit: "5,000,000",
    used: '450,000',
    percent: '9'
  },
  {
    icon: PiPillFill,
    name: "Pharmacy & Drugs",
    limit: "500,000",
    used: '120,000',
    percent: '24'
  }
]

const action = [
  {
    name: 'Reimbursement',
    url: '/dashboard/retail/reimbursement'
  },
  {
    name: 'Find a Provider',
    url: '/dashboard/retail/providers'
  },
  {
    name: 'Upgrade Plan',
    url: '/dashboard/retail/buy-plans'
  },
  {
    name: 'Add Dependent',
    url: '/dashboard/retail/plans/add-dependant'
  }
]

const page = () => {
  return (
    <section className='flex flex-col md:flex-row gap-4'>
      <div className="bg-[#FFFFFF] px-3 md:px-6 rounded-[10px] py-3 md:w-[65%] space-y-4">
        <h3 className='text-lg font-semibold'>Coverage Summary</h3>
        <div className='flex flex-col gap-3'>
        {coverage.map((item, index) => (
          <div key={index} className='border border-[#D9D9D9] rounded-[10px] p-3 flex flex-col gap-2'>
            <div className='flex justify-between'>
              <div className='flex gap-2 w-full'>
                <div className='text-[#49A5EF] bg-[#D9D9D9] p-1 text-xl md:text-2xl h-fit rounded-[5px]'>
                  <item.icon/>
                </div>
                <div className='flex fex-col'>
                  <div>
                    <h3 className='text-[15px] md:text-[16px]'>{item.name}</h3>
                    <p className='flex md:text-sm text-xs'>Annual Limit: <TbCurrencyNaira className='text-sm md:text-xl'/>{item.limit}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className='text-[12px] md:text-base text-end'>Used</h3>
                <p className='text-[14px] md:text-[16px] flex font-semibold'> <TbCurrencyNaira className='text-xl md:text-2xl'/>{item.used}</p>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <PercentageBar percentage={item.percent} />
              <p className='text-xs'>{item.percent}% utilized</p>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="bg-[#FFFFFF] px-4 md:px-6 rounded-[10px] py-3 space-y-4 md:w-[33%]">
        <h3 className='text-lg font-semibold'>Quick Actions</h3>
        <div className='flex flex-col gap-3'>
          {action.map((item, index) => (
            <Link key={index} href={item.url} className='p-2 border border-[#D9D9D9] flex justify-between items-center rounded-[10px] text-[16px]'>
              {item.name}
              <FaChevronRight/>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default page