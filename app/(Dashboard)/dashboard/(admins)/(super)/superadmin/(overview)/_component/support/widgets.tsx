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
    <SectionBlock title='Support workload'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Open tickets' value={formatNumber(overview?.activeClients, loading)} description='Current support cases in queue.' />
        <MetricCard label='Clients served' value={formatNumber(overview?.totalUsers, loading)} description='Clients with active support requests.' />
        <MetricCard label='Member requests' value={formatNumber(overview?.totalEnrollees, loading)} description='Members in active plans.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Support pulse'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Telemedicine requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='New member requests this week.' />
        <MetricCard label='SLA status' value={formatNumber(overview?.activeClients, loading)} description='Response and resolution health.' />
        <MetricCard label='Service reach' value={formatNumber(overview?.totalEnrollees, loading)} description='Members covered by support teams.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Support trend'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Track ticket volume and response velocity.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Recent support actions'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent support handoffs and escalations.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• New validation requests assigned</li>
          <li>• Urgent claim escalations</li>
          <li>• Client onboarding follow-ups</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Support tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track case age, escalation status, and support KPIs.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Queue' description='Review support waiting lists' />
          <QuickLinkCard label='SLA' description='Track adherence to response goals' />
          <QuickLinkCard label='Feedback' description='Monitor client satisfaction' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Support quick actions'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Tickets' description='Open support queue' href='/dashboard/superadmin/tickets' />
        <QuickLinkCard label='Validations' description='Review validation tasks' href='/dashboard/superadmin/validations' />
        <QuickLinkCard label='Claims' description='Track claim processing' href='/dashboard/superadmin/claims' />
      </div>
    </SectionBlock>
  );
};
