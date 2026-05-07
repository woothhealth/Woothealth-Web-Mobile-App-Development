'use client';

import React from 'react';
import { MdDownload, MdOutlineFileDownload } from 'react-icons/md';
import type { Billing } from './InvoiceModal';
import { div } from 'motion/react-client';

const getStatusColor = (status: 'paid' | 'denied') => {
  return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface BillingsTableProps {
  billings: Billing[];
  onDownload: (billing: Billing) => void;
}

const BillingsTable: React.FC<BillingsTableProps> = ({ billings, onDownload }) => {
  return (
    <div className="overflow-hidden">
      <div className='space-y-4'>
        {billings.map((billing, index) => (
          <div key={index} className='flex flex-col px-6 py-4 bg-[#ffffff] shadow-sm rounded-[10px] space-y-4'>
        <div className='flex justify-between'>
          <div className='flex flex-col space-y-1'>
            <p className="text-lg font-semibold">{formatDate(billing.date)}</p>
            <p className="text-sm">Invoice: {billing.invoiceNo}</p>
            <div className='flex items-center space-x-2'>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(billing.status)}`}>
                {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
              </span>
              <p className="text-sm">HMO ID: {billing.hmoId}</p>
            </div>
          </div>
          <div className='flex flex-col'>
            <p className="">Due: ₦{billing.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <div className='flex justify-end'>
              <MdOutlineFileDownload className="text-primary text-end hover:text-blue-900 cursor-pointer" onClick={() => onDownload(billing)} size={30} />
            </div>
          </div>
        </div>
        <div className='flex justify-between text-sm'>
          <p className=''>Due date: {billing.dueDate}</p>
          <p>Paid: {billing.date}</p>
        </div>
        </div>
      ))
    }
      </div>
    </div>
  );
};

export default BillingsTable;