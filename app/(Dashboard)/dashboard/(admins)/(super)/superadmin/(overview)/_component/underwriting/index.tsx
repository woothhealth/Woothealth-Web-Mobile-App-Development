'use client'

import React from 'react';
import { RoleOverviewHeader } from '../../roleViews/OverviewWidgets';
import { Widget1, Widget2, RecentPage, ChartPage, ActivitiesPage, TrackingPage } from './widgets';

const UnderwritingOverview = () => {
  return (
    <div className='space-y-6'>
      <RoleOverviewHeader
        title='Underwriting overview'
        description='Review risk, policy issuance, and underwriting workflow from a centralized panel.'
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

export default UnderwritingOverview;
