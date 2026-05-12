'use client'

import React from 'react';
import { useAdminOverview } from '@/Components/AdminOverviewContext';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import { RoleOverviewHeader, MetricCard, QuickLinkCard, SectionBlock } from './OverviewWidgets';

const DefaultOverview = () => {
  const { overview, loading } = useAdminOverview();
  const user = useAdminDashboardUser();

  const number = (value?: number) => {
    if (loading) return '...';
    return value != null ? value.toLocaleString() : '—';
  };

  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Overview dashboard'
        description='Your role is not specifically mapped yet, so this overview surfaces key platform metrics.'
      />

      <SectionBlock title='Core metrics'>
        <div className='grid gap-4 lg:grid-cols-3'>
          <MetricCard label='Users' value={number(overview?.totalUsers)} description='Registered accounts on the platform.' />
          <MetricCard label='Enrollees' value={number(overview?.totalEnrollees)} description='Members enrolled in active plans.' />
          <MetricCard label='Active clients' value={number(overview?.activeClients)} description='Current client engagements.' />
        </div>
      </SectionBlock>

      <SectionBlock title='General quick links'>
        <div className='grid gap-4 md:grid-cols-2'>
          <QuickLinkCard label='Users' description='Review registered users' href='/dashboard/superadmin/users' />
          <QuickLinkCard label='Enrollees' description='Manage member enrollments' href='/dashboard/superadmin/enrollees' />
          <QuickLinkCard label='Clients' description='View active client accounts' href='/dashboard/superadmin/clients' />
        </div>
      </SectionBlock>

      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm uppercase tracking-[0.18em] text-slate-500'>Signed in as</p>
        <p className='mt-2 text-lg font-semibold text-slate-900'>{user?.email ?? 'Unknown user'}</p>
        <p className='mt-3 text-sm text-slate-600'>If you expect a role-specific overview, create a role view component in the overview/roleViews folder.</p>
      </div>
    </div>
  );
};

export default DefaultOverview;
