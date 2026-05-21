'use client'

import React from 'react';
import { useAdminOverview } from '@/Components/AdminOverviewContext';
import { MetricCard, QuickLinkCard, SectionBlock, OverviewCustomSelect } from '../../roleViews/OverviewWidgets';
import { LuUsers } from 'react-icons/lu';
import { FaRegFileAlt, FaRegUser } from 'react-icons/fa';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { IoWalletOutline } from 'react-icons/io5';
import BarChartView from '../../../UIs/BarChart';
import PieChartWithCustomizedLabel from '../../../UIs/PieChart';
import { PiClockCounterClockwiseFill } from 'react-icons/pi';
import RecentComponent from '../RecentComponent';
import PendingComponent from '../PendingComponent';
import TrackingComponent from '../TrackingComponent';
import { TiClipboard } from 'react-icons/ti';
import { RiErrorWarningLine } from 'react-icons/ri';
import { MdPauseCircleOutline } from 'react-icons/md';

const formatNumber = (value?: number, loading?: boolean) => {
  if (loading) return '...';
  return value != null ? value.toLocaleString() : '—';
};

export const Widget1 = () => {
  const { overview, loading } = useAdminOverview();

  return (
    <div className="block gap-2 md:grid md:grid-cols-4 lg:gap-1 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[96%] formDiv">
      <div>
        <MetricCard label='Total Providers' icon={<LuUsers />} value={formatNumber(overview?.totalUsers, loading)} iconBgColor='[#8063E81A]' iconTextColor='[#8063E8]' />
      </div>
      <div>
        <MetricCard label='Active Providers' icon={<TbActivityHeartbeat />} value={formatNumber(overview?.totalEnrollees, loading)} iconBgColor='[#D1FAE5]' iconTextColor='[#10B981]' />
      </div>
      <div>
        <MetricCard label='Inactive Provider' icon={<RiErrorWarningLine />} value={formatNumber(overview?.activeClients, loading)} iconBgColor='[#EF44441A]' iconTextColor='[#EF4444]' />
      </div>
      <div>
        <MetricCard label='Suspended Providers' icon={<MdPauseCircleOutline />} value={formatNumber(overview?.telemedicineRequests, loading)} iconBgColor='[#F59E0B1A]' iconTextColor='[#F59E0B]' />
      </div>
    </div>
  );
};

export const ChartPage1 = () => {
  return (
    <SectionBlock title='Revenue Performance' icon={<IoWalletOutline />} side={<OverviewCustomSelect options={['Last 30 Days', 'Last 90 Days', 'Last Year']} selected='Last 30 Days' onChange={() => {}} />} >
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <BarChartView isAnimationActive={true}/>
      </div>
    </SectionBlock>
  );
};

export const ChartPage2 = () => {
  return (
    <SectionBlock title='Claim status' icon={<FaRegFileAlt className='text-sm' />}>
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <PieChartWithCustomizedLabel isAnimationActive={true}/>
      </div>
    </SectionBlock>
  );
};

export const ActivitiesPage = () => {
  return (
     <SectionBlock title='Recent Activities' icon={<PiClockCounterClockwiseFill />}>
      <RecentComponent />
    </SectionBlock>
  );
};

export const TrackingPage = () => {
  return (
    <SectionBlock title='Onboarding Providers SLA Tracking' icon={<TiClipboard />}>
      <TrackingComponent/>
    </SectionBlock>
  );
};

export const PendingPage = () => {
  return (
    <SectionBlock>
      <PendingComponent/>
    </SectionBlock>
  );
};