'use client';

import { useState } from 'react';
import { Lead, leadStatuses, updateLeadStatus } from '../../mockLeads';

interface LeadViewClientProps {
  lead: Lead;
}

export default function LeadViewClient({ lead }: LeadViewClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<Lead['status']>(lead.status);

  const handleStatusChange = (status: Lead['status']) => {
    setSelectedStatus(status);
    updateLeadStatus(lead.id, status);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Lead details</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{lead.clientName}</h2>
        <p className="mt-2 text-sm text-slate-600">Lead details for the selected client.</p>

        <div className="mt-6 grid gap-4">
          <DetailCard label="Client type" value={lead.clientType} />
          <DetailCard label="Contact person" value={lead.contactPerson} />
          <DetailCard label="Email" value={lead.email} />
          <DetailCard label="Phone" value={lead.phone} />
          <DetailCard label="Date added" value={lead.dateAdded} />
          <DetailCard label="Potential employees" value={lead.potentialEmployees.toString()} />
          <DetailCard label="Assigned to" value={lead.assignedTo} />
          <DetailCard label="Current status" value={selectedStatus} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-slate-700">Move lead to</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {leadStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={`rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                selectedStatus === status
                  ? 'border-[#49A5EF] bg-[#EFF7FF] text-slate-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Log note</p>
          <p className="mt-3 text-sm text-slate-700">{lead.logNote}</p>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
