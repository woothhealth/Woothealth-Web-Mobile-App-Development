'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const SalesOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Sales dashboard'
        description='Track sales performance, lead momentum, and revenue opportunities for your team.'
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

export default SalesOverview;
