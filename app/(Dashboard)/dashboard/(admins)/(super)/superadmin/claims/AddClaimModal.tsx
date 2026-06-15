'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TreatmentItem = {
  id?: string;
  itemCode?: string;
  name?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  Amount?: number;
  price?: number;
  [key: string]: any;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (createdClaim: any) => void;
};

export default function AddClaimModal({ open, onClose, onSuccess }: Props) {
  const [hmoId, setHmoId] = useState('');
  const [paCode, setPaCode] = useState('');
  const [items, setItems] = useState<TreatmentItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setHmoId('');
      setPaCode('');
      setItems([]);
      setError(null);
    }
  }, [open]);

  // debounce paCode fetch
  useEffect(() => {
    if (!paCode) return;
    const id = setTimeout(() => {
      fetchPaCodeItems(paCode);
    }, 500);
    return () => clearTimeout(id);
  }, [paCode]);

  const fetchPaCodeItems = async (code: string) => {
    setLoadingItems(true);
    setError(null);
    try {
      // Try resolving a PA code object (server may return varying shapes)
      const tryFetch = async (paramName: string) => {
        const resp = await fetch(`/api/admin/pa-codes?${paramName}=${encodeURIComponent(code)}`);
        if (!resp.ok) return null;
        const data = await resp.json().catch(() => null);
        if (!data) return null;

        // find the paCode object in different response shapes
        let paCode: any = null;
        if (data?.data) {
          if (Array.isArray(data.data)) {
            paCode = data.data[0];
          } else {
            paCode = data.data;
          }
        } else if (Array.isArray(data)) {
          paCode = data[0];
        } else {
          paCode = data;
        }

        return paCode;
      };

      let paObj = await tryFetch('paCodeId');
      if (!paObj) paObj = await tryFetch('code');

    //   console.debug('AddClaimModal: resolved paObj:', paObj);

      if (paObj) {
        // Normalize treatment list similar to PaCodeViewClient
        const treatment = paObj.treatment ?? paObj.treatmentItems ?? [];
        const normalized = Array.isArray(treatment)
          ? treatment.map((it: any) => {
              const item: any = { ...(it || {}) };
              item.itemCode = item.itemCode || item.item_code || item.ItemCode || item.code || item.Code || item.id || item.item || '';
              item.description = item.description || item.Description || item.desc || item.note || item.name || '';
              const qty = Number(item.quantity ?? item.Quantity ?? 1) || 1;
              const price = Number(item.unitPrice ?? item.unit_price ?? item.price ?? item.Amount ?? item.amount) || 0;
              item.unitPrice = price;
              item.quantity = qty;
              const existingAmount = Number(item.Amount ?? item.amount ?? 0) || 0;
              item.Amount = existingAmount || (price && qty ? price * qty : 0);
              return item;
            })
          : [];

        //   console.debug('AddClaimModal: normalized treatment items count=', normalized.length);
        setItems(normalized);
      } else {
        // Fallback: handle endpoint returning items directly
        const resp = await fetch(`/api/admin/pa-codes?code=${encodeURIComponent(code)}`);
        if (!resp.ok) throw new Error(`Failed to fetch pa code items (${resp.status})`);
        const data = await resp.json();
        const itemsList: any = data.items ?? data;
        //   console.debug('AddClaimModal: fallback items payload:', data);
        const normalized: TreatmentItem[] = Array.isArray(itemsList)
          ? itemsList
          : itemsList && typeof itemsList === 'object'
          ? Object.values(itemsList)
          : [];
        setItems(normalized);
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching PA code items');
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleSubmit = async () => {
    if (!hmoId) return toast.error('Please enter HMO ID');
    if (!paCode) return toast.error('Please enter PA code');
    setSubmitting(true);
    try {
      const payload = { hmoId, paCode, items: Array.isArray(items) ? items : [] };
      const resp = await fetch('/api/admin/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(`Failed to create claim (${resp.status})`);
      const created = await resp.json();
      toast.success('Claim created successfully');
      onSuccess && onSuccess(created);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Error creating claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Add Claim</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">HMO ID</label>
            <input
              type="text"
              value={hmoId}
              onChange={(e) => setHmoId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">PA Code</label>
            <input
              type="text"
              value={paCode}
              onChange={(e) => setPaCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Items load automatically after typing the PA code.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Treatment Items</label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
              {loadingItems ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">Loading items...</span>
                </div>
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : items.length === 0 ? (
                <div className="text-sm text-gray-600">No items to display</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-3 py-2 text-left font-semibold">Item Code</th>
                        <th className="px-3 py-2 text-left font-semibold">Description</th>
                        <th className="px-3 py-2 text-center font-semibold">Quantity</th>
                        <th className="px-3 py-2 text-right font-semibold">Unit Price</th>
                        <th className="px-3 py-2 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const code = item.itemCode || item.item_code || item.id || `#${idx + 1}`;
                        const desc = item.description || item.name || item.item || '';
                        const qty = Number(item.quantity ?? item.Quantity ?? 1) || 1;
                        const unit = Number(item.unitPrice ?? item.unit_price ?? item.price ?? item.Amount ?? item.amount) || 0;
                        const amount = Number(item.Amount ?? item.amount ?? unit * qty) || 0;
                        return (
                          <tr key={item.id ?? idx} className="border-b">
                            <td className="px-3 py-2 text-primary">{code}</td>
                            <td className="px-3 py-2">{desc}</td>
                            <td className="px-3 py-2 text-center">{qty}</td>
                            <td className="px-3 py-2 text-right">{unit ? `₦${unit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : 'N/A'}</td>
                            <td className="px-3 py-2 text-right font-semibold">{amount ? `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : 'N/A'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-100 rounded-md" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#49A5EF] text-white rounded-md disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Create Claim'}
          </button>
        </div>
      </div>
    </div>
  );
}
