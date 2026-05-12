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
    <SectionBlock title='Claims metrics'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Active clients' value={formatNumber(overview?.activeClients, loading)} description='Clients with claim activity.' />
        <MetricCard label='Enrollees' value={formatNumber(overview?.totalEnrollees, loading)} description='Members tied to claims.' />
        <MetricCard label='Requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='Incoming claim-related requests.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Claims pipeline'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Total users' value={formatNumber(overview?.totalUsers, loading)} description='Users with claim interactions.' />
        <MetricCard label='Pending reviews' value={formatNumber(overview?.activeClients, loading)} description='Claims under validation.' />
        <MetricCard label='Enrollee exposure' value={formatNumber(overview?.totalEnrollees, loading)} description='Members in open claims.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Claims trend'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Track claims volume and review velocity over time.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Recent claims activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent claim reviews and reimbursement actions.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• Claims assigned to validation workflow</li>
          <li>• Reimbursement review completed</li>
          <li>• Claim denials and approvals updated</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Claims tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Monitor validation backlogs and reimbursement flow.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Claims' description='Open claims overview' />
          <QuickLinkCard label='Validations' description='Review validation queue' />
          <QuickLinkCard label='Reimbursement' description='Track payout progress' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Claims quick links'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Claims' description='View claim records' href='/dashboard/superadmin/claims' />
        <QuickLinkCard label='Validations' description='Review validation tasks' href='/dashboard/superadmin/validations' />
        <QuickLinkCard label='Reimbursement' description='Manage payouts' href='/dashboard/superadmin/reimbursement' />
      </div>
    </SectionBlock>
  );
};
