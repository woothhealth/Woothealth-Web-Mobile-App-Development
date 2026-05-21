'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
// tariff creation is on its own page now

interface TariffItem {
  $id: string;
  tariffCode?: string;
  serviceName?: string;
  providerName?: string;
  providerType?: string;
  tierA?: string;
  tierAPlus?: string;
  tierB?: string;
  tierC?: string;
  tierD?: string;
  description?: string;
  $createdAt?: string;
}

const expectedProviderTypes = [
  'optical',
  'pharmacy',
  'laboratory',
  'hospital',
  'dental',
  'mri',
  'specialist',
];

export default function TariffTableClient() {
  const [tariffs, setTariffs] = useState<TariffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTariffs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/tariff', {
        credentials: 'include',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Failed to load tariffs');
      }

      const data = await response.json();
      const records = Array.isArray(data?.data) ? data.data : [];
      setTariffs(records);
    } catch (err: any) {
      setError(err?.message || 'Unable to fetch tariff data.');
      toast.error(err?.message || 'Unable to fetch tariff data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    tariffs.forEach((item) => {
      if (item.providerType) {
        types.add(item.providerType);
      }
    });
    return [...types].sort();
  }, [tariffs]);

  const filteredTariffs = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = tariffs;

    if (typeFilter !== 'All Types') {
      result = result.filter((item) => item.providerType?.toLowerCase() === typeFilter.toLowerCase());
    }

    if (query) {
      result = result.filter((item) =>
        [
          item.providerName,
          item.providerType,
          item.tariffCode,
          item.serviceName,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query))
      );
    }

    return result;
  }, [tariffs, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTariffs.length / 20));
  const paginatedTariffs = useMemo(() => {
    const start = (currentPage - 1) * 20;
    return filteredTariffs.slice(start, start + 20);
  }, [filteredTariffs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

  if (loading && tariffs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="h-12 w-full rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-12 w-32 rounded-lg bg-slate-200 animate-pulse" />
        </div>
        <div className="overflow-x-auto rounded-[15px] bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-[15px]">
            <thead className="text-[18px] font-semibold">
              <tr>
                <th className="px-4 py-4 text-left">Date added</th>
                <th className="px-4 py-4 text-left">Provider name</th>
                <th className="px-4 py-4 text-left">Provider type</th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="transition hover:bg-slate-50">
                  <td className="px-4 py-4"><div className="h-4 rounded bg-slate-200 animate-pulse" /></td>
                  <td className="px-4 py-4"><div className="h-4 rounded bg-slate-200 animate-pulse" /></td>
                  <td className="px-4 py-4"><div className="h-4 rounded bg-slate-200 animate-pulse" /></td>
                  <td className="px-4 py-4 text-center"><div className="h-8 w-24 mx-auto rounded bg-slate-200 animate-pulse" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row w-full gap-3">
          <label htmlFor="tariff-search" className="sr-only">Search tariffs</label>
          <div className="relative w-full">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="tariff-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search provider, tariff code, service name"
              className="w-full rounded-lg border border-slate-300 bg-white px-11 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="w-full md:w-40">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
            >
              <option value="All Types">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            </div>
            <button
              type="button"
              onClick={() => router.push('/dashboard/providers/tariff')}
              className="inline-flex items-center justify-center rounded-[15px] bg-primary w-40 px-4 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 transition"
            >
              <FaPlus className="mr-2" /> Add Tariff
            </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[15px] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-[15px]">
          <thead className="text-[18px] font-semibold">
            <tr>
              <th className="px-4 py-4 text-left">Date added</th>
              <th className="px-4 py-4 text-left">Provider name</th>
              <th className="px-4 py-4 text-left">Provider type</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredTariffs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No tariffs match your search or filter.
                </td>
              </tr>
            ) : (
              paginatedTariffs.map((tariff) => {
                const providerLabel = tariff.providerName || tariff.serviceName || 'Unknown provider';
                const tariffId = tariff.$id || tariff.tariffCode || providerLabel;
                return (
                  <tr key={tariffId} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4 whitespace-nowrap">{formatDate(tariff.$createdAt)}</td>
                    <td className="px-4 py-4">{tariff.providerName || '-'}</td>
                    <td className="px-4 py-4">{tariff.providerType || '—'}</td>
                    <td className="px-4 py-4 text-center">
                      <Link
                        href={`/dashboard/superadmin/tariff/${encodeURIComponent(tariffId)}`}
                        className="inline-flex rounded-lg bg-[#49A5EF1A] px-3 py-2 text-xs font-medium text-[#49A5EF] transition hover:bg-blue-100"
                      >
                        View Tariff
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
        <div className="text-sm text-slate-700">
          Showing {filteredTariffs.length === 0 ? 0 : (currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, filteredTariffs.length)} of {filteredTariffs.length} tariffs
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm font-medium text-slate-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Tariff creation handled on its own page */}
    </div>
  );
}
