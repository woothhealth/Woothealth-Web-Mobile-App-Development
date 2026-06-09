'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import AddTariffModal from './AddTariffModal';

interface ProviderItem {
  $id: string;
  tariffCode?: string;
  serviceName?: string;
  providerName?: string;
  providerType?: string;
  tier?: string;
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
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTariffs = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch providers as the source of table data; tariffs for a provider
      // will be loaded on the view page via `/api/admin/tariff` filtered by provider.
      const response = await fetch('/api/admin/providers?page=1&limit=200', {
        credentials: 'include',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Failed to load tariffs');
      }

      const data = await response.json();

      // Data may come in different shapes: { data: [...providers] } or { providers: [...] } or array
      const records = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.providers)
        ? data.providers
        : Array.isArray(data)
        ? data
        : [];

      // Normalize provider records into the ProviderItem shape used by the table
      const mapped = records.map((p: any) => ({
        $id: p.$id || p.id || p.providerId || p.wootId || Math.random().toString(),
        tariffCode: undefined,
        serviceName: undefined,
        providerName: p.name || p.providerName || p.facilityName || p.company || 'Unknown provider',
        providerType: p.type || p.providerType || p.category || '—',
        tier: p.tier || p.priceTier || p.providerTier || '',
        tierA: undefined,
        tierAPlus: undefined,
        tierB: undefined,
        tierC: undefined,
        tierD: undefined,
        description: p.description || p.about || '',
        $createdAt: p.$createdAt || p.createdAt || p.created || undefined,
      }));

      setProviders(mapped);
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
    providers.forEach((item) => {
      if (item.providerType) {
        types.add(item.providerType);
      }
    });
    return [...types].sort();
  }, [providers]);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = providers;

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
  }, [providers, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProviders.length / 20));
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * 20;
    return filteredProviders.slice(start, start + 20);
  }, [filteredProviders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

  if (loading && providers.length === 0) {
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
                <th className="px-4 py-3 text-left">Date added</th>
                <th className="px-4 py-3 text-left">Provider name</th>
                <th className="px-4 py-3 text-left">Provider type</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="h-4 rounded bg-slate-200 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 rounded bg-slate-200 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 rounded bg-slate-200 animate-pulse" /></td>
                  <td className="px-4 py-3 text-center"><div className="h-8 w-24 mx-auto rounded bg-slate-200 animate-pulse" /></td>
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
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center rounded-[15px] bg-primary w-40 px-4 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 transition"
            >
              <FaPlus className="mr-2" /> Add Tariff
            </button>
        </div>
      </div>

      <div className="overflow-auto h-110 rounded-[15px] bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-[15px]">
          <thead className="text-[18px] font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Date added</th>
              <th className="px-4 py-3 text-left">Provider name</th>
              <th className="px-4 py-3 text-left">Provider type</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredProviders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No providers match your search or filter.
                </td>
              </tr>
            ) : (
              paginatedProviders.map((provider) => {
                const providerLabel = provider.providerName || provider.serviceName || 'Unknown provider';
                const providerId = provider.$id || provider.tariffCode || providerLabel;
                return (
                  <tr key={providerId} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(provider.$createdAt)}</td>
                    <td className="px-4 py-3">{provider.providerName || '-'}</td>
                    <td className="px-4 py-3">{provider.providerType || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      {/*
                        View Tariff flow (handled on the tariff detail page):
                        1. Read the provider id from the route/query (we pass `providerId` below).
                        2. If the provider has a `customTariff`, show that.
                        3. Otherwise fetch `/api/admin/tariff?providerId=...` and filter
                           the returned tariffs by the provider's tier mapping (e.g. tierA, tierB)
                           to display the correct prices for the provider's tiers.
                      */}
                        <Link
                          href={`/dashboard/superadmin/tariff/${encodeURIComponent(providerId)}?providerId=${encodeURIComponent(provider.$id as string)}&providerType=${encodeURIComponent((provider.providerType||'') as string)}&tier=${encodeURIComponent((provider.tier||'') as string)}`}
                          onClick={() => {
                            try {
                              const key = `tariff_provider_${provider.$id}`;
                              // store the provider row so the view can reuse it without refetch
                              sessionStorage.setItem(key, JSON.stringify(provider));
                            } catch (e) {
                              // ignore storage errors
                            }
                          }}
                          className="inline-flex rounded-lg bg-[#49A5EF1A] px-3 py-2 text-xs font-medium text-[#49A5EF] transition hover:bg-blue-100"
                          aria-label={`View tariffs for ${provider.providerName || 'provider'}`}
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
          Showing {filteredProviders.length === 0 ? 0 : (currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, filteredProviders.length)} of {filteredProviders.length} providers
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

      {showAddModal && (
        <AddTariffModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onTariffAdded={() => {
            setShowAddModal(false);
            fetchTariffs();
          }}
        />
      )}
    </div>
  );
}
