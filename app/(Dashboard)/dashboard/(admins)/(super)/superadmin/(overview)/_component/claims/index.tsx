'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const ClaimsOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Claims operations'
        description='Manage claims, validations, and reimbursement workflows from a focused overview.'
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

export default ClaimsOverview;
