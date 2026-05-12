'use client'

import React from 'react';
import { useAdminOverview } from '@/Components/AdminOverviewContext';
import { MetricCard, QuickLinkCard, SectionBlock } from '../../roleViews/OverviewWidgets';

const formatNumber = (value?: number, loading?: boolean) => {
  if (loading) return '...';
  return value != null ? value.toLocaleString() : '—';
};

export const Widget1 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='HR metrics'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Team size' value={formatNumber(overview?.totalUsers, loading)} description='Registered employees and admins.' />
        <MetricCard label='Active hires' value={formatNumber(overview?.activeClients, loading)} description='Recent onboarding and new hire activity.' />
        <MetricCard label='Covered members' value={formatNumber(overview?.totalEnrollees, loading)} description='Members tied to benefit programs.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='People pulse'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Support requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='People operations requests and tasks.' />
        <MetricCard label='Hiring pipeline' value={formatNumber(overview?.activeClients, loading)} description='Candidates in review.' />
        <MetricCard label='Engagement reach' value={formatNumber(overview?.totalEnrollees, loading)} description='Members with HR support.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='HR trend'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Track hiring velocity, retention, and people metrics.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='HR activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent people operations and benefit work.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• New hires added to payroll</li>
          <li>• Benefit enrollments processed</li>
          <li>• Employee support tickets reviewed</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='HR tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track onboarding, engagement, and workforce KPIs.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Hiring' description='Review current openings' />
          <QuickLinkCard label='Benefits' description='Monitor enrollment health' />
          <QuickLinkCard label='People analytics' description='Review HR metrics' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='HR quick links'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Employees' description='Manage employee records' href='/dashboard/superadmin/employees' />
        <QuickLinkCard label='Benefits' description='Open benefits administration' href='/dashboard/superadmin/benefits' />
        <QuickLinkCard label='Requests' description='Review people support' href='/dashboard/superadmin/tickets' />
      </div>
    </SectionBlock>
  );
};
