'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const ProviderOpsOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Provider operations'
        description='Track provider performance, onboarding status, and operational health.'
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

export default ProviderOpsOverview;
