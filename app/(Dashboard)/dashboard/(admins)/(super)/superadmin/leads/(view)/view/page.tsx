import Link from 'next/link';
import { mockLeads } from '../../mockLeads';
import LeadViewClient from './LeadViewClient';

interface LeadViewPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function LeadViewPage({ searchParams }: LeadViewPageProps) {
  const { id } = await searchParams;
  const lead = id ? mockLeads.find((item) => item.id === id) : null;

  if (!lead) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">Lead not found.</p>
          <Link
            href="/dashboard/superadmin/leads"
            className="mt-6 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mb-8 w-full lg:max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Lead profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{lead.clientName}</h1>
            <p className="mt-1 text-sm text-slate-600">Lead profile details for the selected client.</p>
          </div>
          <Link
            href="/dashboard/superadmin/leads"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to leads
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Client type</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{lead.clientType}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Contact person</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{lead.contactPerson}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Email</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{lead.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Phone</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{lead.phone}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Date added</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{lead.dateAdded}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Potential employees</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{lead.potentialEmployees}</p>
          </div>
        </div>
      </div>

      <LeadViewClient lead={lead} />
    </div>
  );
}
