'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const [records, setRecords] = useState<TariffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTariff = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/tariff?id=${encodeURIComponent(tariffId)}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.message || 'Failed to load tariff details.');
        }

        const payload = await response.json();

        if (!payload?.data) {
          throw new Error('Tariff details not found.');
        }

        const rows = Array.isArray(payload.data) ? payload.data : [payload.data];
        setRecords(rows);
      } catch (err: any) {
        setError(err?.message || 'Unable to load tariff details.');
      } finally {
        setLoading(false);
      }
    };

    if (tariffId) {
      fetchTariff();
    }
  }, [tariffId]);

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
  const providerName = firstRecord.providerName || 'N/A';
  const providerId = firstRecord.providerId || tariffId || 'N/A';
  const city = firstRecord.city || 'N/A';
  const state = firstRecord.state || 'N/A';

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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm border border-border">
          <thead className="text-left text-sm font-semibold divide divide-border">
            <tr>
              <th className="px-4 py-4">S/N</th>
              <th className="px-4 py-4">Procedure name</th>
              <th className="px-4 py-4">General ward/sharing</th>
              <th className="px-4 py-4">Single room</th>
              <th className="px-4 py-4">Deluxe room/ac room</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No tariff rows available for this provider.
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                // <tr key={`${record.$id || record.tariffCode || index}`} className="hover:bg-slate-50 transition">
                //   <td className="px-4 py-4">{index + 1}</td>
                //   <td className="px-4 py-4 font-medium text-slate-900">{record.serviceName || '—'}</td>
                //   <td className="px-4 py-4">{record.tierA || '—'}</td>
                //   <td className="px-4 py-4">{record.tierAPlus || '—'}</td>
                //   <td className="px-4 py-4">{record.tierB || '—'}</td>
                // </tr>
                return null; // Temporarily hide the table rows until we confirm the correct data structure (tierA, tierAPlus, tierB) 
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
    </section>
  );
}
