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
    <SectionBlock title='Platform metrics'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Registered users' value={formatNumber(overview?.totalUsers, loading)} description='All platform accounts.' />
        <MetricCard label='Enrollees' value={formatNumber(overview?.totalEnrollees, loading)} description='Members on active plans.' />
        <MetricCard label='Active clients' value={formatNumber(overview?.activeClients, loading)} description='Clients contributing to platform activity.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Operational pulse'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Telemedicine requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='Recent telemedicine demand.' />
        <MetricCard label='Client reach' value={formatNumber(overview?.activeClients, loading)} description='Clients currently active.' />
        <MetricCard label='Member growth' value={formatNumber(overview?.totalEnrollees, loading)} description='Enrollment movement.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Performance chart'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>High-level performance trend and utilization patterns.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Recent platform activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Latest activity from across the business units.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• New plan approvals submitted</li>
          <li>• Client onboarding updates</li>
          <li>• Reimbursement and claims escalations</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Superadmin tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track service level objectives and operational KPIs.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Governance' description='Review compliance and permissions' />
          <QuickLinkCard label='Health checks' description='Monitor system health metrics' />
          <QuickLinkCard label='Escalations' description='Track open critical issues' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Superadmin quick actions'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Platform settings' description='Update system configuration' href='/dashboard/superadmin/settings' />
        <QuickLinkCard label='Users' description='Manage admins and operators' href='/dashboard/superadmin/users' />
        <QuickLinkCard label='Reports' description='Open high-level analytics' href='/dashboard/superadmin/reports' />
      </div>
    </SectionBlock>
  );
};
