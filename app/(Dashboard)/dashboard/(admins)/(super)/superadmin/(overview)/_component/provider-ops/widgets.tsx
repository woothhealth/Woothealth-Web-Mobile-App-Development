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
    <SectionBlock title='Provider operations metrics'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Active providers' value={formatNumber(overview?.activeClients, loading)} description='Providers engaged with clients.' />
        <MetricCard label='Enrollees covered' value={formatNumber(overview?.totalEnrollees, loading)} description='Members supported by providers.' />
        <MetricCard label='Provider requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='Incoming provider-related requests.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Delivery pulse'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Total users' value={formatNumber(overview?.totalUsers, loading)} description='Users connected to providers.' />
        <MetricCard label='Provider health' value={formatNumber(overview?.activeClients, loading)} description='Operational provider status.' />
        <MetricCard label='Client reach' value={formatNumber(overview?.totalEnrollees, loading)} description='Members currently active.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Provider performance'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Monitor provider throughput and engagement over time.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Recent provider activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent provider onboarding and service events.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• Provider applications in review</li>
          <li>• Onboarding progress updates</li>
          <li>• Provider service performance checks</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Provider tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track provider quality, availability, and delivery metrics.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Onboarding' description='Track provider onboarding progress' />
          <QuickLinkCard label='Capacity' description='Monitor current provider capacity' />
          <QuickLinkCard label='Quality' description='Review provider performance' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Provider quick actions'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Providers' description='Manage provider network' href='/dashboard/superadmin/providers' />
        <QuickLinkCard label='Client assignments' description='Review provider-client assignments' href='/dashboard/superadmin/clients' />
        <QuickLinkCard label='Performance' description='Open provider performance tools' href='/dashboard/superadmin/reports' />
      </div>
    </SectionBlock>
  );
};
