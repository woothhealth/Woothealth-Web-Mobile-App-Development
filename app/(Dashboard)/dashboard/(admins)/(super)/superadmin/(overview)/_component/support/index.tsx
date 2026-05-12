'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const SupportOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Support operations'
        description='See support queue activity, response status, and client health from a role-tailored perspective.'
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

export default SupportOverview;
