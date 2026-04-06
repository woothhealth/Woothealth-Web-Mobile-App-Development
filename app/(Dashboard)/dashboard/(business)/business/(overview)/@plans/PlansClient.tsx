'use client'

import React, { useState, useEffect, memo } from 'react'
import { useBusinessOverview } from '@/Components/BusinessOverviewContext';

interface PlanData {
  name: string;
  employeeCount: number;
}

interface PlansClientProps {
  initialData?: PlanData[];
}

const PlansClient: React.FC<PlansClientProps> = ({ initialData = [] }) => {
  const { overview, loading } = useBusinessOverview();
  const plans = overview?.planBreakdown || initialData;

  if (loading) {
    return (
      <section className='py-4 px-2 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
        <h3 className='text-[20px] font-semibold'>Plan Details</h3>
        <div className='text-center py-4'>Loading...</div>
      </section>
    );
  }

  return (
    <section className='py-4 px-2 md:p-4 flex flex-col gap-3 bg-[#FFFFFF] rounded-2xl'>
        <h3 className='text-[20px] font-semibold'>Plan Details</h3>
        {plans.length === 0 ? (
            <div className='text-center py-4'>No plans found</div>
        ) : (
            <div>
                <table>
                    <thead>
                        <tr className='text-[17px]'>
                            <td>Plan Name</td>
                            <td className='pl-20'>No of employees</td>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {plans.map((item, index) => (
                            <tr key={index} className='bg-[#E5E7EB33] font-bold'>
                                <td className='rounded-[10px] px-4 py-3'>{item.name}</td>
                                <td className='px-6 py-3 text-end'>{item.employeeCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </section>
  )
}

export default memo(PlansClient);