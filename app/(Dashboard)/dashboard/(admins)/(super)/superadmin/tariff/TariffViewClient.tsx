'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

interface TariffRecord {
  $id?: string;
  tariffCode?: string;
  serviceName?: string;
  providerType?: string;
  tierA?: string;
  tierAPlus?: string;
  tierB?: string;
  tierC?: string;
  tierD?: string;
  description?: string;
  providerName?: string;
  providerId?: string;
  city?: string;
  state?: string;
  $createdAt?: string;
}

export default function TariffViewClient() {
  const params = useParams();
  const tariffId = params.tariffId as string;
  const searchParams = useSearchParams();
  const providerIdQuery = searchParams?.get('providerId') || null;
  const providerTypeQuery = searchParams?.get('providerType') || null;
  const tierQuery = searchParams?.get('tier') || null;
  const [records, setRecords] = useState<TariffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerMeta, setProviderMeta] = useState<any>(null);

  useEffect(() => {
    const fetchTariff = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prefer provider-scoped tariffs when providerId is provided
        const fetchUrl = providerIdQuery
          ? `/api/admin/tariff?providerId=${encodeURIComponent(providerIdQuery)}`
          : `/api/admin/tariff?id=${encodeURIComponent(tariffId)}`;

        const response = await fetch(fetchUrl, { credentials: 'include' });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.message || 'Failed to load tariff details.');
        }

        const payload = await response.json().catch(() => null);
        const data = payload?.data ?? payload;

        let rows: any[] = [];
        if (Array.isArray(data)) rows = data;
        else if (Array.isArray(data?.items)) rows = data.items;
        else if (Array.isArray(data?.data)) rows = data.data;
        else if (data && typeof data === 'object') rows = [data];

        // If providerType/tier provided, apply matching and extract amount for the provider's tier
        const providerTypeNormalized = (providerTypeQuery || '').toString().trim().toLowerCase();
        const providerTierRaw = (tierQuery || '').toString().trim();
        const providerTier = providerTierRaw.replace(/^tier\s*/i, '').replace(/^price\s*/i, '');

        const tierCandidates = [
          `tier${providerTier}`,
          `tier${providerTier.toLowerCase()}`,
          `tier${providerTier.toUpperCase()}`,
          `price${providerTier}`,
          `price${providerTier.toLowerCase()}`,
          `price${providerTier.toUpperCase()}`,
          providerTier,
          providerTier.toLowerCase(),
          providerTier.toUpperCase(),
        ].filter(Boolean);

        const extractAmount = (t: any) => {
          if (!t) return null;
          for (const k of tierCandidates) {
            if (t[k] != null) return t[k];
          }
          const nestedKeys = ['prices', 'price', 'tiers', 'amounts', 'rates'];
          for (const nk of nestedKeys) {
            const obj = t[nk];
            if (obj && typeof obj === 'object') {
              for (const k of tierCandidates) {
                if (obj[k] != null) return obj[k];
              }
              const vals = Object.values(obj).filter((v) => v != null && (typeof v === 'number' || !Number.isNaN(Number(v))));
              if (vals.length > 0) return vals[0];
            }
          }
          if (t.amount != null) return t.amount;
          if (t.price != null) return t.price;
          return null;
        };

        const normalized = rows.map((r: any) => {
          const rec: any = { ...r };
          rec._serviceName = r.serviceName || r.service_name || r.name || r.description || r.procedure || '';
          rec._providerType = (r.providerType || r.provider_type || r.type || '').toString().trim().toLowerCase();
          rec._resolvedPrice = extractAmount(r);
          return rec as TariffRecord & { _resolvedPrice?: number; _serviceName?: string; _providerType?: string };
        });

        // If providerTypeQuery provided, filter by providerType match; otherwise keep all
        const filtered = providerTypeQuery
          ? normalized.filter((r: any) => !providerTypeNormalized || (r._providerType || '').toLowerCase() === providerTypeNormalized)
          : normalized;

        setRecords(filtered as TariffRecord[]);
      } catch (err: any) {
        setError(err?.message || 'Unable to load tariff details.');
      } finally {
        setLoading(false);
      }
    };

    // If session storage has a provider row saved by the table, use its tariff rows immediately
    const sessionKey = providerIdQuery ? `tariff_provider_${providerIdQuery}` : null;
    if (sessionKey) {
      try {
        const raw = sessionStorage.getItem(sessionKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed) {
            // use providerTariff or provider.tarrif rows if present
            const providerTariffs = parsed.providerTariff || parsed.tariffs || parsed.tariffRows || parsed.items || null;
            if (Array.isArray(providerTariffs) && providerTariffs.length > 0) {
              const mapped = providerTariffs.map((r: any) => {
                const rec = { ...r };
                rec._serviceName = r.serviceName || r.service_name || r.name || r.description || r.procedure || '';
                rec._providerType = (r.providerType || r.provider_type || r.type || '').toString().trim().toLowerCase();
                rec._resolvedPrice = r.price ?? r.amount ?? null;
                return rec;
              });
              setRecords(mapped as TariffRecord[]);
              setLoading(false);
              // still fetch to refresh in background
              fetchTariff();
              return;
            }
          }
        }
      } catch (e) {
        // ignore session parse errors
      }
    }

    if (tariffId || providerIdQuery) {
      fetchTariff();
    }
  }, [tariffId, providerIdQuery, providerTypeQuery, tierQuery]);

  // Fetch provider metadata when providerIdQuery is provided so we can show provider name/city/state
  useEffect(() => {
    let mounted = true;
    const fetchProvider = async () => {
      if (!providerIdQuery) return;
      try {
        const res = await fetch(`/api/admin/providers?providerId=${encodeURIComponent(providerIdQuery)}`, { credentials: 'include' });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message || 'Failed to fetch provider info');
        }
        const payload = await res.json().catch(() => null);
        const data = payload?.data ?? payload;
        const provider = Array.isArray(data) ? data[0] : (data || null);
        if (mounted) setProviderMeta(provider);
      } catch (err) {
        if (!mounted) return;
        setProviderMeta(null);
      }
    };
    fetchProvider();
    return () => { mounted = false; };
  }, [providerIdQuery]);

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/dashboard/superadmin/tariff" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
          <FaArrowLeft /> Back to tariffs
        </Link>
      </div>
    );
  }

  const firstRecord = records[0] ?? {};
  const providerName = providerMeta?.name || firstRecord.providerName || 'N/A';
  const providerId = providerIdQuery || firstRecord.providerId || tariffId || 'N/A';
  const city = providerMeta?.address?.city || firstRecord.city || 'N/A';
  const state = providerMeta?.state || firstRecord.state || 'N/A';

  return (
    <section className="space-y-6 px-2 md:px-6">
      <div className="flex items-center justify-between">
          <Link href="/dashboard/superadmin/tariff" className="inline-flex items-center rounded-full border border-border font-medium bg-slate-50 p-2">
            <FaArrowLeft size={24} />
          </Link>
          <button type="button" className="flex items-center gap-2 rounded-[10px] bg-primary font-medium tex-xs text-[#ffffff] p-2" disabled>
            <FaEdit /> Edit
          </button>
      </div>

      <div className="rounded-[15px] bg-white p-5 shadow-sm">
        <div className="divide-y divide-border px-6">
          <div className="grid gap-4 md:grid-cols-2 py-2">
            <p className="text-base font-semibold text-slate-900">{providerName}</p>
            <p className="text-base font-semibold text-slate-900">{city}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 py-2">
            <p className="text-base font-semibold text-slate-900">{tariffId}</p>
            <p className="text-base font-semibold text-slate-900">{state}</p>
          </div>
        </div>

      <div className="overflow-x-auto h-90 custom-scrollbar mt-4">
        <table className="min-w-full divide-y divide-border text-sm border rounded-[10px] border-border">
          <thead className="text-left text-sm font-semibold divide divide-border">
            <tr>
              <th className="px-4 py-4">S/N</th>
              <th className="px-4 py-4">Item Code</th>
              <th className="px-4 py-4">Procedure</th>
              <th className="px-4 py-4">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No tariff rows available for this provider.
                </td>
              </tr>
            ) : (
              records.map((record: any, index) => {
                const formatPrice = (v: any) => {
                  if (v == null || v === '') return '—';
                  const n = Number(v);
                  if (!Number.isFinite(n)) return String(v);
                  return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                };
                const itemCode = record.tariffCode ?? record.itemCode ?? record.code ?? record.tariff_code ?? record._code ?? '—';
                const procedure = record._serviceName || record.serviceName || record.service_name || record.name || '—';
                const price = record._resolvedPrice ?? record.tierA ?? record.tier_a ?? record.price ?? record.amount ?? null;

                return (
                  <tr key={`${record.$id || record.tariffCode || index}`} className="hover:bg-slate-50 transition divide-x divide-border">
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{itemCode}</td>
                    <td className="px-4 py-4 font-medium text-slate-900">{procedure}</td>
                    <td className="px-4 py-4">{formatPrice(price)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
    </section>
  );
}
