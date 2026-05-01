import React from 'react';
import ReimbursementViewClient from './ReimbursementViewClient';

const page = ({ searchParams }: { searchParams: { id?: string } }) => {
  return <ReimbursementViewClient reimbursementId={searchParams.id || ''} />;
};

export default page;
