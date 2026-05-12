'use client';

import { useState } from 'react';
import { FaX } from 'react-icons/fa6';
import { Lead, leadStatuses, updateLeadStatus } from '../../mockLeads';

interface LeadViewClientProps {
  lead: Lead;
}

export default function LeadViewClient({ lead }: LeadViewClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<Lead['status']>(lead.status);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const handleStatusChange = (status: Lead['status']) => {
    setSelectedStatus(status);
    updateLeadStatus(lead.id, status);
    setShowStatusPopup(false);
  };

  const statusColors: Record<string, string> = {
    'New Lead': 'bg-[#D1FAE5] text-[#10B981]',
    Contacted: 'bg-[#FEF9C3] text-[#D97706]',
    Converted: 'bg-[#D1FAE5] text-[#10B981]',
    Lost: 'bg-[#FEE2E2] text-[#EF4444]',
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 bg-[#ffffff] rounded-[15px] p-4 md:p-6 shadow-sm w-[80%]">
      <div className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <p className="text-2xl font-bold">{lead.clientName}</p>
            <p className="font-semibold text-slate-900">{lead.clientType}</p>
          </div>
          <div className='space-y-1'>
            <div className="flex space-x-2">
              <p className="text-base">Contact person:</p>
              <p className="font-semibold">{lead.contactPerson}</p>
            </div>
            <div className="flex space-x-2">
              <p className="text-base">Email:</p>
              <p className="font-semibold">{lead.email}</p>
            </div>
            <div className="flex space-x-2">
              <p className="text-base">Phone:</p>
              <p className="font-semibold">{lead.phone}</p>
            </div>
            <div className="flex space-x-2">
              <p className="text-base">Date added:</p>
              <p className="font-semibold">{lead.dateAdded}</p>
            </div>
            <div className="flex space-x-2">
              <p className="text-base">Potential employees:</p>
              <p className="font-semibold">{lead.potentialEmployees}</p>
            </div>
          </div>
        </div>
      <div>
        <div className="">
          <div className='flex md:justify-end'>
            <p className={`text-sm px-4 py-1 rounded-[5px] ${statusColors[selectedStatus] || 'bg-slate-200 text-slate-700'}`}>
              {selectedStatus}
            </p>
          </div>
          <div className="mt-8 rounded-[5px] border border-border bg-slate-5 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Log note</p>
            <p className="mt-3 text-sm text-slate-700">{lead.logNote}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowStatusPopup(true)}
            className="w-fit rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-white hover:bg-slate-50 transition"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Status Update Popup */}
      {showStatusPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Update Status</h2>
              <button
                type="button"
                onClick={() => setShowStatusPopup(false)}
                className="font-semibold hover:text-slate-700"
              >
                <FaX size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {leadStatuses.map((status) => (
                <div
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full flex items-center rounded-lg transition font-medium gap-2`}
                >
                  <span className={`w-4 h-4 rounded-full ${selectedStatus === status ? 'bg-[#49A5EF]' : 'bg-slate-300'}`}></span>
                  {status}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}