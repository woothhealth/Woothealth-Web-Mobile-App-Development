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
    <SectionBlock title='Underwriting metrics'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Policies in review' value={formatNumber(overview?.activeClients, loading)} description='Applications currently underwriting.' />
        <MetricCard label='Client exposure' value={formatNumber(overview?.totalUsers, loading)} description='Accounts under underwriting review.' />
        <MetricCard label='Member risk count' value={formatNumber(overview?.totalEnrollees, loading)} description='Enrollees mapped to underwriting risk.' />
      </div>
    </SectionBlock>
  );
};

export const Widget2 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <SectionBlock title='Risk pulse'>
      <div className='grid gap-4 lg:grid-cols-3'>
        <MetricCard label='Telemedicine requests' value={formatNumber(overview?.telemedicineRequests, loading)} description='Health and claim signals affecting risk.' />
        <MetricCard label='Underwriting backlog' value={formatNumber(overview?.activeClients, loading)} description='Pending review load.' />
        <MetricCard label='Active portfolios' value={formatNumber(overview?.totalEnrollees, loading)} description='Policies covered by underwriting.' />
      </div>
    </SectionBlock>
  );
};

export const ChartPage = () => {
  return (
    <SectionBlock title='Risk trend'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6 min-h-[240px]'>
        <p className='text-sm text-slate-600'>Visualize underwriting approvals and risk exposure.</p>
        <div className='mt-6 h-40 rounded-2xl bg-slate-100' />
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
    <SectionBlock title='Underwriting activity'>
      <div className='space-y-3 rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Recent underwriting actions and review handoffs.</p>
        <ul className='space-y-2 text-sm text-slate-700'>
          <li>• New applications entered</li>
          <li>• Risk reviews initiated</li>
          <li>• Approvals completed</li>
        </ul>
      </div>
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Underwriting tracking'>
      <div className='rounded-3xl border border-[#D9D9D9] bg-white p-6'>
        <p className='text-sm text-slate-600'>Track review cycle times and risk classification volume.</p>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          <QuickLinkCard label='Risk queue' description='Review pending cases' />
          <QuickLinkCard label='Approvals' description='Monitor approval flow' />
          <QuickLinkCard label='Exposure' description='Track portfolio risk metrics' />
        </div>
      </div>
    </SectionBlock>
  );
};

export const RecentPage = () => {
  return (
    <SectionBlock title='Underwriting quick links'>
      <div className='grid gap-4 md:grid-cols-3'>
        <QuickLinkCard label='Applications' description='Open underwriting queue' href='/dashboard/superadmin/underwriting' />
        <QuickLinkCard label='Claims' description='Review claims affecting risk' href='/dashboard/superadmin/claims' />
        <QuickLinkCard label='Reports' description='Open underwriting analytics' href='/dashboard/superadmin/reports' />
      </div>
    </SectionBlock>
  );
};
