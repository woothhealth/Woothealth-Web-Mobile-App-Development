'use client';

import React, { useState } from 'react';
import BillingsTable from './BillingsTable';
import InvoiceModal, { type Billing } from './InvoiceModal';
import { MOCK_BILLINGS } from './mockBillings';

export default function BillingsPage() {
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);

  const handleDownload = (billing: Billing) => {
    setSelectedBilling(billing);
  };

  return (
    <div className="p-6">
      <BillingsTable billings={MOCK_BILLINGS} onDownload={handleDownload} />

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