'use client'

import React from 'react';
import { useAdminOverview } from '@/Components/AdminOverviewContext';
import { MetricCard, SectionBlock, OverviewCustomSelect } from '../../roleViews/OverviewWidgets';
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
import { LuClipboardList } from "react-icons/lu";
import { useAdminEnrollees } from '@/Components/AdminEnrolleesContext';
import { useAdminClientContext } from '@/Components/AdminClientContext';

const formatNumber = (value?: number, loading?: boolean) => {
  if (loading) return '...';
  return value != null ? value.toLocaleString() : '—';
};

export const Widget1 = () => {
  const { overview, loading } = useAdminOverview();
  const { enrollees, loading: enrolleesLoading } = useAdminEnrollees();
  const { clients, loading: clientsLoading } = useAdminClientContext();

  const totalEnrolleesValue = enrollees?.total ?? overview?.totalEnrollees;
  const totalEnrolleesLoading = loading || enrolleesLoading;

  const activeClientsValue = Array.isArray(clients)
    ? clients.filter((c: any) => c?.status === 'active').length
    : overview?.activeClients;
  const activeClientsLoading = loading || clientsLoading;

  return (
    <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-1 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[96%] formDiv">
      <div>
        <MetricCard label='Total users' icon={<LuUsers />} value={formatNumber(overview?.totalUsers, loading)} description='Registered Accounts' iconBgColor='[#49A5EF1A]' iconTextColor='[#49A5EF]' />
      </div>
      <div>
        <MetricCard label='Total Enrollees' icon={<FaRegUser />} value={formatNumber(totalEnrolleesValue, totalEnrolleesLoading)} description='Active Plan Members' iconBgColor='[#8063E81A]' iconTextColor='[#8063E8]' />
      </div>
      <div>
        <MetricCard label='Active clients' icon={<TbActivityHeartbeat />} value={formatNumber(activeClientsValue, activeClientsLoading)} description='Last 30 Days' iconBgColor='[#D1FAE5]' iconTextColor='[#10B981]' />
      </div>
      <div>
        <MetricCard label='Pending Tickets' icon={<LuClipboardList />} value={formatNumber(overview?.telemedicineRequests, loading)} description='All Time' iconBgColor='[#4755691A]' iconTextColor='[#475569]' />
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
    <SectionBlock title='SLA Tracking' icon={<TiClipboard />}>
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