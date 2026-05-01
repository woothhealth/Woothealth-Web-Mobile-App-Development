import { Suspense } from 'react';
import TelemedicineViewClient from './TelemedicineViewClient';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function TelemedicineViewPage({ searchParams }: PageProps) {
  const telemedicineId = typeof searchParams.id === 'string' ? searchParams.id : '';

  if (!telemedicineId) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center text-slate-700">
          <p className="text-lg font-semibold">Telemedicine ID not found</p>
          <p className="mt-2 text-sm text-slate-500">Please select a telemedicine request from the list.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TelemedicineViewClient telemedicineId={telemedicineId} />
    </Suspense>
  );
}