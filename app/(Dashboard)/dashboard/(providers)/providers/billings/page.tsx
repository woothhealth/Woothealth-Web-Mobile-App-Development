'use client';

import React, { useEffect, useRef, useState } from 'react';
import BillingsTable from './BillingsTable';
import InvoiceModal, { type Billing } from './InvoiceModal';
import { MOCK_BILLINGS } from './mockBillings';

export default function BillingsPage() {
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = (billing: Billing) => {
    setSelectedBilling(billing);
  };
  const mountedRef = useRef(true);

  const fetchBillings = async () => {
    setIsLoading(true);
    setError(null);
    setBillings([]);
    try {
      const res = await fetch('/api/pr/billings', { cache: 'no-store' });
      if (!mountedRef.current) return;
      if (!res.ok) throw new Error('Failed to fetch billings');
      const data = await res.json();
      if (!mountedRef.current) return;
      setBillings(Array.isArray(data) ? (data as Billing[]) : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load billings');
      if (mountedRef.current) setBillings(MOCK_BILLINGS);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
    return () => { mountedRef.current = false };
  }, []);

  const handleRetry = () => fetchBillings();

  return (
    <div className="p-6">
      <BillingsTable billings={billings} onDownload={handleDownload} />
      {isLoading && <p className="text-base text-slate-500 mt-4">Loading billings...</p>}
      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {!isLoading && billings.length === 0 && !error && (
        <div className="mt-6 rounded-md border border-dashed border-slate-200 p-6 text-center">
          <p className="text-lg text-slate-600 mb-3">No billings found.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-xl text-sm bg-primary px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      )}

      {selectedBilling && (
        <InvoiceModal
          billing={selectedBilling}
          isOpen={!!selectedBilling}
          onClose={() => setSelectedBilling(null)}
        />
      )}
    </div>
  );
}