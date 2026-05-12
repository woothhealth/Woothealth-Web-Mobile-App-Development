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
    <SectionBlock title='Sales metrics'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Opportunities' value={formatNumber(overview?.activeClients, loading)} description='Active sales opportunities.' />
        <MetricCard label='Clients' value={formatNumber(overview?.totalUsers, loading)} description='Client relationships in progress.' />
        <MetricCard label='Members' value={formatNumber(overview?.totalEnrollees, loading)} description='Members tied to pipeline deals.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Revenue pulse'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Lead flow' value={formatNumber(overview?.telemedicineRequests, loading)} description='Incoming demo and inquiry volume.' />
        <MetricCard label='Conversion' value={formatNumber(overview?.activeClients, loading)} description='Closing activity health.' />
        <MetricCard label='Client growth' value={formatNumber(overview?.totalEnrollees, loading)} description='Growth across client accounts.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Sales trend'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Visualize pipeline and revenue velocity.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Sales activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent sales outreach and deal updates.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• New client presentations scheduled</li>
          <li>• Pricing requests received</li>
          <li>• Contract negotiations in progress</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Sales tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track pipeline stages, forecast, and close rates.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Pipeline' description='Review open deals' />
          <QuickLinkCard label='Forecast' description='Track revenue expectations' />
          <QuickLinkCard label='Targets' description='Monitor sales goals' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Sales quick actions'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Leads' description='Open lead management' href='/dashboard/superadmin/leads' />
        <QuickLinkCard label='Clients' description='Review prospects and accounts' href='/dashboard/superadmin/clients' />
        <QuickLinkCard label='Sales reports' description='Open sales analytics' href='/dashboard/superadmin/reports' />
      </div>
    </SectionBlock>
  );
};
