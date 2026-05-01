import { Suspense } from 'react';
import PaCodeViewClient from './PaCodeViewClient';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PaCodeViewPage({ searchParams }: PageProps) {
  const paCodeId = typeof searchParams.id === 'string' ? searchParams.id : '';

  if (!paCodeId) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaCodeViewClient paCodeId={paCodeId} />
    </Suspense>
  );
}