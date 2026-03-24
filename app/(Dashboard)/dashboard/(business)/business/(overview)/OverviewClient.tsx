'use client'

import PercentageBar from '@/UI/PercentageBar';
import { url } from 'inspector';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { FaArrowRight } from 'react-icons/fa6';
import { FiFileText } from 'react-icons/fi';
import { GoBellFill } from 'react-icons/go';
import { MdAutorenew } from 'react-icons/md';
import { useBusinessOverview } from '@/Components/BusinessOverviewContext';

interface CoverageData {
  totalLimit: number;
  usedThisYear: number;
  remainingBalance: number;
  utilizationRate: number;
  daysToExpiry?: number | null;
}

const OverviewClient: React.FC = () => {
  const { overview, loading } = useBusinessOverview();
  const coverage = overview?.annualCoverage as CoverageData || {
    totalLimit: 0,
    usedThisYear: 0,
    remainingBalance: 0,
    utilizationRate: 0,
    daysToExpiry: 0
  };

  const links = [
    {
      name: "Reimbursement",
      url: "/dashboard/business/reimbursement"
    },
    {
      name: "Add Employees",
      url: "/dashboard/business/employees/add"
    }
  ]

  const coverageItems = [
    {
      id: 1,
      name: "Total Coverage Limit",
      price: coverage.totalLimit.toLocaleString()
    },
    {
      id: 2,
      name: "Used This Year",
      price: coverage.usedThisYear.toLocaleString()
    },
    {
      id: 3,
      name: "Total Coverage Balance",
      price: coverage.remainingBalance.toLocaleString()
    }
  ];

  return (
    <section className='py-4 md:p-4 my-4 flex flex-col md:flex-row gap-6 md:gap-8 bg-[#FFFFFF] rounded-2xl'>
      <div className='px-6 md:w-[60%] flex flex-col space-y-2'>
        <h3 className='text-[20px] font-semibold'>Annual Coverage Limit</h3>
        <div className=''>
          {coverageItems.map((item, index)=> {
            const idNum = Number(item.id);
                const isFirst = idNum === 1;
                const isThird = idNum === 3;
                const tagClasses = isFirst ? 'text-[#000000]' : isThird ? 'text-[#10B981]' : 'text-[#49A5EF]';
                return (
                  <div key={index} className={`flex justify-between items-center py-2`}>
                    <p className='text-[14px] font-medium text-[#374151]'>{item.name}</p>
                    <span className={`text-[16px] font-medium px-3 ${tagClasses}`}>₦{item.price}</span>
                  </div>
                )
          })}
        </div>
        <div className='flex flex-col gap-2 border-y py-4 border-[#D9D9D9]'>
          <div className='flex justify-between'>
            <p className='text-[12px]'>Utilization Rate</p>
            <p className='text-[14px]'>{loading ? '...' : `${coverage.utilizationRate}%`}</p>
          </div>
          {!loading && <PercentageBar percentage={coverage.utilizationRate} />}
        </div>
      </div>
      <div className='md:w-[45%]'>
        <div className='bg-[#49A5EF] p-4 rounded-2xl text-[#FFFFFF] space-y-2'>
          <h3 className='text-[18px]'><GoBellFill className='inline-flex mr-1 text-[#FBBF24]'/>Renewal Reminder</h3>
          <p>Your plan expires in {coverage.daysToExpiry} days. Renew now to avoid coverage gaps.</p>
          <div className='bg-[#FFFFFF] cursor-pointer rounded-2xl py-1 px-5 text-[#000000] font-semibold w-fit flex gap-3 items-center'>
            <MdAutorenew className='' /> Renew Plan
          </div>
        </div>
        <div className='w-full flex flex-col space-y-3 mt-2'>
          {links.map((item, index) => (
            <Link key={index} href={item.url} className='flex items-center justify-between bg-[#49A5EF] text-[#FFFFFF] font-semibold text-[16px] rounded-[10px] px-4 py-2 w-full'>
              <span className='flex items-center gap-4'>
                <FiFileText className='text-[16px]'/>
                {item.name}
              </span>
              <FaArrowRight/>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OverviewClient