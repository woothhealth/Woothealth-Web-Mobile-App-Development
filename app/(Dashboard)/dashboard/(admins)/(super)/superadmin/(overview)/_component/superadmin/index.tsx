'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const SuperadminOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Superadmin overview'
        description='Monitor platform health, administrative activity, and enterprise performance from one dashboard.'
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

export default SuperadminOverview;
