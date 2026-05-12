'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const FinanceOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Financial performance'
        description='Monitor finance metrics, reimbursement health, and cashflow signals for the business.'
      />
      <Widget1 />
      <Widget2 />
      <ChartPage />
      <ActivitiesPage />
      <TrackingPage />
      <RecentPage />
    </div>
  );
};

export default FinanceOverview;
