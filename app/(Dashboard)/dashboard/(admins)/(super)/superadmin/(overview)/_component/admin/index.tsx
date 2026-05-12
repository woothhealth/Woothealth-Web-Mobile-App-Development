'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const AdminOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Admin command center'
        description='Manage users, enrollees, finance, and platform activity from a unified admin view.'
      />
      <Widget1 />
      <ChartPage />
      <ActivitiesPage />
      <TrackingPage />
      <RecentPage />
    </div>
  );
};

export default AdminOverview;
