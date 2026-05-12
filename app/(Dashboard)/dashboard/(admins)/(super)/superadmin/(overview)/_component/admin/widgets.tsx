'use client'

import React from 'react';
import { useAdminOverview } from '@/Components/AdminOverviewContext';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import { MetricCard, QuickLinkCard, SectionBlock } from '../../roleViews/OverviewWidgets';
import { LuUsers } from 'react-icons/lu';
import { FaRegUser } from 'react-icons/fa';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { IoWalletOutline } from 'react-icons/io5'

const formatNumber = (value?: number, loading?: boolean) => {
  if (loading) return '...';
  return value != null ? value.toLocaleString() : '—';
};

export const Widget1 = () => {
  const { overview, loading } = useAdminOverview();
  return (
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Total users' icon={<LuUsers />} value={formatNumber(overview?.totalUsers, loading)} description='Registered Accounts' />
        <MetricCard label='Total Enrollees' icon={<FaRegUser />} value={formatNumber(overview?.totalEnrollees, loading)} description='Active Plan Members' />
        <MetricCard label='Active clients' icon={<TbActivityHeartbeat />} value={formatNumber(overview?.activeClients, loading)} description='Last 30 Days' />
        <MetricCard label='Telemedicine requests' icon={<IoWalletOutline />} value={formatNumber(overview?.telemedicineRequests, loading)} description='Registered Accounts' />
      </div>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Admin trend view'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Weekly activity trend and engagement overview.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Recent admin activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent tasks and platform updates for your team.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• New client onboarding requests</li>
          <li>• Pending approver assignments</li>
          <li>• Policy and plan updates</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Admin tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Monitor admin operations and SLA response targets.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Open approvals' description='See pending approval items.' />
          <QuickLinkCard label='Performance' description='Review response time metrics.' />
          <QuickLinkCard label='Team health' description='Track support and onboarding status.' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Quick actions'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Users' description='Manage user accounts and permissions' href='/dashboard/superadmin/users' />
        <QuickLinkCard label='Clients' description='Review client relationships and onboarding' href='/dashboard/superadmin/clients' />
        <QuickLinkCard label='Benefits' description='Update plan offerings and benefit packages' href='/dashboard/superadmin/benefits' />
      </div>
    </SectionBlock>
  );
};
