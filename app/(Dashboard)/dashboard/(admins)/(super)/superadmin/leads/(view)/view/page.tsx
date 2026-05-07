import Link from 'next/link';
import { mockLeads } from '../../mockLeads';
import LeadViewClient from './LeadViewClient';
import { IoIosArrowBack } from 'react-icons/io';

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
            className="mt-6 inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            <IoIosArrowBack size={20} className="mr-2" />
            Back to leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full space-y-4">
      <Link
        href="/dashboard/superadmin/leads"
        className="inline-flex items-center justify-center rounded-lg border border-border px-2 py-2 text-sm font-medium transition hover:bg-slate-100"
      >
        <IoIosArrowBack size={20} className="mr-2" />
        Back to leads
      </Link>
      <LeadViewClient lead={lead} />
    </div>
  );
}
