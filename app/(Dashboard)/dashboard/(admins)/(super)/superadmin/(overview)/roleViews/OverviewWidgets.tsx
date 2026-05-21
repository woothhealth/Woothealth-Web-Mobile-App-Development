'use client'

import Link from 'next/link';
import React from 'react';

export type OverviewCardProps = {
  label: string;
  value?: string;
  description?: string;
  href?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
};

export const RoleOverviewHeader: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.18em] text-slate-500'>Role overview</p>
        <h2 className='text-2xl font-semibold text-slate-900'>{title}</h2>
        <p className='text-sm text-slate-600'>{description}</p>
      </div>
    </div>
  );
};

export const MetricCard: React.FC<OverviewCardProps> = ({ label, value, description, icon, iconBgColor, iconTextColor }) => {
  return (
    <section className='bg-[#FFFFFF] w-44 md:w-full py-4 rounded-[15px] text-[#000000] flex items-center px-4 md:h-fit h-48 border border-[#D9D9D9]'>
      <div className='flex flex-col space-y-4 w-full'>
        <div className={`bg-${iconBgColor} p-2 text-${iconTextColor} rounded-[10px] w-fit text-3xl`}>
          {icon}
        </div>
        <div className='flex flex-col leading-7'>
          <h4 className='text-[14px] md:text-[15px]'>{label}</h4>
          <h3 className='text-[17px] font-semibold md:text-[26px]'>{value ?? '—'}</h3>
          <p className='text-[14px] md:text-[15px]'>{description}</p>
        </div>
      </div>
    </section>
  );
};

export const QuickLinkCard: React.FC<OverviewCardProps> = ({ label, description, href, icon }) => {
  if (!href) {
    return (
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-5'>
        <p className='text-sm font-semibold text-slate-900'>{label}</p>
        <p className='mt-2 text-sm text-slate-600'>{description}</p>
      </div>
    );
  }
  return (
    <Link href={href} className='block rounded-3xl border border-[#D9D9D9] bg-white p-5 hover:shadow-lg transition'>
      <p className='text-sm font-semibold text-slate-900'>{label}</p>
      <p className='mt-2 text-sm text-slate-600'>{description}</p>
    </Link>
  );
};

export const SectionBlock: React.FC<{ title?: string; children: React.ReactNode; icon?: React.ReactNode; side?: React.ReactNode }> = ({ title, children, icon, side }) => {
  return (
    <section className='p-4 flex flex-col space-y-4 bg-[#FFFFFF] rounded-[10px]'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2 text-sm'>
            <div className='px-3 flex items-center border border-[#D9D9D9] rounded-[5px] text-sm'>
                {icon}
            </div>
            <h3 className='font-semibold'>{title}</h3>
        </div>
        <div>
          {side}
        </div>
      </div>
      {children}
    </section>
  );
};

export const OverviewCustomSelect: React.FC<{ options: string[]; selected: string; onChange: (value: string) => void }> = ({ options, selected, onChange }) => {
  return (
    <select value={selected} onChange={(e) => onChange(e.target.value)} className='border border-[#D9D9D9] rounded-[10px] px-3 py-2 text-sm bg-white'>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}
