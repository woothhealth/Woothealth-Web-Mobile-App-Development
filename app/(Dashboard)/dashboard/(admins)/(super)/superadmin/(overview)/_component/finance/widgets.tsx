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
    <SectionBlock title='Finance KPIs'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Total accounts' value={formatNumber(overview?.totalUsers, loading)} description='Registered users across the platform.' />
        <MetricCard label='Active clients' value={formatNumber(overview?.activeClients, loading)} description='Clients generating current cashflow.' />
        <MetricCard label='Enrollees' value={formatNumber(overview?.totalEnrollees, loading)} description='Active members in coverage.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Reimbursement health'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Telemedicine requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='Current request volume affecting payouts.' />
        <MetricCard label='Claims pipeline' value={formatNumber(overview?.activeClients, loading)} description='Claim exposure from active accounts.' />
        <MetricCard label='Enrollment trend' value={formatNumber(overview?.totalEnrollees, loading)} description='New members contributing to revenue.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Financial trend'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Review revenue pattern and reimbursement movement.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Recent finance activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent financial approvals and payout updates.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• Reimbursement requests queued</li>
          <li>• Payment approvals completed</li>
          <li>• Cashflow forecast updates</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Finance tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track cashflow, payout timing, and settlement progress.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Reimbursement' description='View payout queue' />
          <QuickLinkCard label='Claims' description='Analyze claims flow' />
          <QuickLinkCard label='Revenue' description='Review top financial metrics' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Finance quick actions'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Finance' description='Open finance tools' href='/dashboard/superadmin/finance' />
        <QuickLinkCard label='Reimbursement' description='Manage payout flow' href='/dashboard/superadmin/reimbursement' />
        <QuickLinkCard label='Claims' description='Track claim payment activity' href='/dashboard/superadmin/claims' />
      </div>
    </SectionBlock>
  );
};
