'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const HrOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='HR overview'
        description='Track employee activity, hiring flow, and people operations for the admin team.'
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

export default HrOverview;
