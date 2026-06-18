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
  amount?: number;
  Amount?: number;
  price?: number;
  [key: string]: any;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (createdClaim: any) => void;
};

export default function CreateClaimModal({ open, onClose, onSuccess }: Props) {
  const [hmoId, setHmoId] = useState('');
  const [paCode, setPaCode] = useState('');
  const [items, setItems] = useState<TreatmentItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [careType, setCareType] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setHmoId('');
      setPaCode('');
      setItems([]);
      setCareType('');
      setDiagnosis('');
      setRequestedBy('');
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
      const tryFetch = async (paramName: string) => {
        const resp = await fetch(`/api/pr/pa-code?${paramName}=${encodeURIComponent(code)}`);
        if (!resp.ok) return null;
        const data = await resp.json().catch(() => null);
        if (!data) return null;
        // find the paCode object in different response shapes. If backend
        // returned an array (or a wrapper with .data), try to find the exact
        // match by authorizationCode / code / paCode; otherwise fall back to
        // the first element or the object itself.
        let paObj: any = null;
        try {
          let list: any[] | null = null;
          if (data?.data) {
            list = Array.isArray(data.data) ? data.data : [data.data];
          } else if (Array.isArray(data)) {
            list = data;
          } else if (data && typeof data === 'object') {
            list = [data];
          }

            if (list && list.length) {
              const findMatch = (item: any) => {
                const v = (item.authorizationCode || item.authorization_code || item.paCode || item.code || item.authorization || item.id);
                if (v == null) return false;
                try { return String(v).toLowerCase() === String(code).toLowerCase(); } catch { return false; }
              };
              // require an exact match; do NOT fallback to first element
              paObj = list.find(findMatch) || null;
            } else {
              paObj = null;
            }
        } catch (e) {
          paObj = null;
        }

        return paObj;
      };

      let paObj = await tryFetch('paCode');
      if (!paObj) paObj = await tryFetch('code');

      if (paObj) {
        // extract additional fields
        const care = paObj.careType || paObj.care_type || paObj.care || paObj.careTypeName || ''
        const diag = paObj.diagnosis || paObj.diagnoses || paObj.diagnosisText || paObj.diagnosis_description || ''
        const reqBy = paObj.requestedBy || paObj.requested_by || paObj.requestedByName || paObj.requested_by_name || paObj.requested || ''

        setCareType(String(care || ''))
        setDiagnosis(String(diag || ''))
        setRequestedBy(String(reqBy || ''))
        // helper to normalize a single item
        const normalizeItem = (it: any) => {
          const item: any = { ...(it || {}) };
          item.itemCode = item.itemCode || item.item_code || item.ItemCode || item.code || item.Code || item.id || item.item || '';
          item.description = item.description || item.Description || item.desc || item.note || item.name || '';
          const qty = Number(item.quantity ?? item.Quantity ?? 1) || 1;
          const price = Number(item.unitPrice ?? item.unit_price ?? item.price ?? item.Amount ?? item.amount) || 0;
          item.unitPrice = price;
          item.quantity = qty;
          const existingAmount = Number(item.Amount ?? item.amount ?? 0) || 0;
          if (!existingAmount && price && qty) {
            item.Amount = price * qty;
          } else {
            item.Amount = existingAmount;
          }
          item.amount = item.amount ?? item.Amount;
          return item;
        };

        // extract treatment array from various possible shapes
        let treatmentRaw: any = null;
        if (Array.isArray(paObj.treatment)) treatmentRaw = paObj.treatment;
        else if (Array.isArray(paObj.treatmentItems)) treatmentRaw = paObj.treatmentItems;
        else if (Array.isArray(paObj.items)) treatmentRaw = paObj.items;
        else if (paObj.treatment && typeof paObj.treatment === 'object') treatmentRaw = Object.values(paObj.treatment);
        else if (paObj.treatmentItems && typeof paObj.treatmentItems === 'object') treatmentRaw = Object.values(paObj.treatmentItems);
        else if (paObj.items && typeof paObj.items === 'object') treatmentRaw = Object.values(paObj.items);
        else if (paObj.data && (Array.isArray(paObj.data.treatment) || Array.isArray(paObj.data.items))) {
          treatmentRaw = paObj.data.treatment ?? paObj.data.items;
        } else {
          // try common fallbacks
          treatmentRaw = paObj.treatment ?? paObj.treatmentItems ?? paObj.items ?? [];
        }

        const normalized: TreatmentItem[] = Array.isArray(treatmentRaw)
          ? treatmentRaw.map(normalizeItem)
          : [];

        setItems(normalized);
      } else {
        // No exact match found — clear items and display 'no data'
        setItems([]);
        setError('No PA code found');
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
      // send all data pulled to the POST endpoint
      const payload = {
        hmoId: hmoId.trim(),
        paCode: paCode.trim(),
        items: Array.isArray(items) ? items : [],
        careType: careType || undefined,
        diagnosis: diagnosis || undefined,
        requestedBy: requestedBy || undefined,
      };
      const resp = await fetch('/api/pr/claims', {
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
      <div className="relative bg-white rounded-lg shadow-lg w-full h-full max-w-2xl mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Create Provider Claim</h3>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <label className="block text-sm text-gray-700 mb-1">Care Type</label>
              <input
                type="text"
                value={careType}
                onChange={(e) => setCareType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. Inpatient, Outpatient"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Requested By</label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Name of requester"
              />
            </div>
          </div>

          {diagnosis ? (
            <div className="mt-3">
              <label className="block text-sm text-gray-700 mb-1">Diagnosis</label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-800">
                {diagnosis}
              </div>
            </div>
          ) : null}

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
                        <th className="px-3 py-2 text-right font-semibold">amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const code = item.itemCode || item.item_code || item.id || `#${idx + 1}`;
                        const desc = item.description || item.name || item.item || '';
                        const qty = Number(item.quantity ?? 1) || 1;
                        const unit = Number(item.unitPrice ?? 0) || 0;
                        const amount = Number(item.amount ?? item.amount ?? (unit * qty)) || 0;
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
