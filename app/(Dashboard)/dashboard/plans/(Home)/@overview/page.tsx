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
    used: '450,000'
  },
  {
    icon: PiPillFill,
    name: "Pharmacy & Drugs",
    limit: "500,000",
    used: '120,000'
  }
]

const action = [
  {
    name: 'Reimbursement',
    url: '/dashboard/reimbursement'
  },
  {
    name: 'Find a Provider',
    url: '/dashboard/providers'
  },
  {
    name: 'Upgrade Plan',
    url: '/dashboard/buy-plans'
  },
  {
    name: 'Add Dependent',
    url: '/dashboard/plans/add-dependant'
  }
]

const page = () => {
  return (
    <section className='flex gap-4'>
      <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-3 w-[65%] space-y-4">
        <h3 className='text-lg font-semibold'>Coverage Summary</h3>
        <div className='flex flex-col gap-3'>
        {coverage.map((item, index) => (
          <div key={index} className='border border-[#D9D9D9] rounded-[10px] flex justify-between p-3'>
            <div className='flex gap-2 w-full'>
              <div className='text-[#49A5EF] bg-[#D9D9D9] p-1.5 text-2xl h-fit rounded-[5px]'>
                <item.icon/>
              </div>
              <div className='flex fex-col'>
                <div>
                  <h3 className='text-[16px]'>{item.name}</h3>
                  <p className='flex text-sm'>Annual Limit: <TbCurrencyNaira className='text-xl'/>{item.limit}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-end'>Used</h3>
              <p className='text-[16px] flex font-semibold'> <TbCurrencyNaira className='text-2xl'/>{item.limit}</p>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="bg-[#FFFFFF] px-6 rounded-[10px] py-3 space-y-4 w-[33%]">
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