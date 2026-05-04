import { Suspense } from 'react';
import PaCodeViewClient from './PaCodeViewClient';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function normalizeSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export default function PaCodeViewPage({ searchParams }: PageProps) {
  const paCodeId = normalizeSearchParam(searchParams.id || searchParams.paCodeId);

  // if (!paCodeId) {
  //   return (
  //     <div className="p-6">
  //       <p className="text-lg font-semibold text-slate-900">PA Code missing</p>
  //       <p className="mt-2 text-sm text-slate-600">
  //         The PA code could not be loaded because the URL does not contain a valid <code>id</code> or <code>paCodeId</code> parameter.
  //       </p>
  //       <p className="mt-4 text-sm text-slate-500">
  //         Please navigate from the PA Codes list or use the correct link format: <code>?id=PA_CODE_ID</code>.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaCodeViewClient paCodeId={paCodeId} />
    </Suspense>
  );
}