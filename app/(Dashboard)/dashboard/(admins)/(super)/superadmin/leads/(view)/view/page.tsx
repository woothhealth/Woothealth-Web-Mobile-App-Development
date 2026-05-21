import Link from 'next/link';
import LeadViewClient from './LeadViewClient';
import { IoIosArrowBack } from 'react-icons/io';

interface LeadViewPageProps {
  searchParams: {
    id?: string;
  };
}

export default function LeadViewPage({ searchParams }: LeadViewPageProps) {
  const id = searchParams.id;

  return (
    <div className="p-4 w-full space-y-4">
      <Link
        href="/dashboard/superadmin/leads"
        className="inline-flex items-center justify-center rounded-lg border border-border px-2 py-2 text-sm font-medium transition hover:bg-slate-100"
      >
        <IoIosArrowBack size={20} className="mr-2" />
        Back to leads
      </Link>
      <LeadViewClient leadId={id} />
    </div>
  );
}
