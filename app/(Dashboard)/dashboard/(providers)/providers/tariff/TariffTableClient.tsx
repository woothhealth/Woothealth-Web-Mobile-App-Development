"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaSearch, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { useProviderProfiles } from '@/lib/providerUserProfile';

interface TariffRow {
  $id?: string;
  tariffCode?: string;
  serviceName?: string;
  providerType?: string;
  providerName?: string;
  tierA?: any;
  tierB?: any;
  tierC?: any;
  tierD?: any;
  prices?: any;
  price?: any;
  amount?: any;
  $createdAt?: string;
  // computed
  _serviceName?: string;
  _providerType?: string;
  _resolvedPrice?: number | null;
}

const PAGE_SIZE = 20;

export default function TariffTableClient() {
  const [rows, setRows] = useState<TariffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: providerProfileResp } = useProviderProfiles();
  const providerProfile = providerProfileResp?.data || providerProfileResp;
  const resolvedProviderTier = (providerProfile?.tier || providerProfile?.planTier || '').toString().trim();

  const fetchTariffs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pr/tariff", { credentials: "include" });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "Failed to load tariffs");
      }

      const payload = await res.json().catch(() => null);
      const data = payload?.data ?? payload;

      const rawList: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];

      // helper: build tier keys
      const buildTierKeys = (t: string) => {
        if (!t) return [] as string[];
        const cleaned = t.replace(/\s+/g, "").replace(/\+/g, "Plus");
        return [
          `tier${cleaned}`,
          `tier${cleaned.toLowerCase()}`,
          `tier${cleaned.toUpperCase()}`,
          `price${cleaned}`,
          `price${cleaned.toLowerCase()}`,
          `price${cleaned.toUpperCase()}`,
          cleaned,
          cleaned.toLowerCase(),
          cleaned.toUpperCase(),
        ].filter(Boolean);
      };

      const nestedKeys = ["prices", "price", "tiers", "amounts", "rates"];

      const findAmount = (t: any, tierCandidates: string[]) => {
        if (!t) return null;
        for (const k of tierCandidates) {
          if (t[k] != null) return Number(t[k]);
        }
        for (const nk of nestedKeys) {
          const obj = t[nk];
          if (obj && typeof obj === "object") {
            for (const k of tierCandidates) {
              if (obj[k] != null) return Number(obj[k]);
            }
            const vals = Object.values(obj).filter((v) => v != null && (typeof v === "number" || !Number.isNaN(Number(v))));
            if (vals.length > 0) return Number(vals[0]);
          }
        }
        if (t.amount != null) return Number(t.amount);
        if (t.price != null) return Number(t.price);
        return null;
      };

      const mapped: TariffRow[] = rawList.map((r: any) => {
        const rec: any = { ...(r || {}) };
        rec._serviceName = r.serviceName || r.service_name || r.name || r.description || r.procedure || "";
        rec._providerType = (r.providerType || r.provider_type || r.type || "").toString().trim().toLowerCase();

        // attempt to derive tier from possible fields inside record
        const tierSource = (r.tier || r.planTier || r.providerTier || r.tierName || "").toString().trim();
        const tierCandidates = buildTierKeys(tierSource);
        const providerCandidates = buildTierKeys(resolvedProviderTier);
        // prioritize provider's tier keys when resolving price, then fall back to record-specific tier keys
        rec._resolvedPrice = findAmount(r, [...providerCandidates, ...tierCandidates]);
        // fallback to generic amounts/prices
        if (rec._resolvedPrice == null) rec._resolvedPrice = findAmount(r, ["", "a", "b", "c", "d", "tierA", "tierB", "tierC", "tierD"]);

        return rec as TariffRow;
      });

      setRows(mapped);
    } catch (err: any) {
      setError(err?.message || "Unable to fetch tariff data.");
      toast.error(err?.message || "Unable to fetch tariff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  const uniqueTypes = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => { if (r._providerType) s.add(r._providerType); });
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    let result = rows;
    if (typeFilter !== "All Types") result = result.filter(r => (r._providerType || "").toLowerCase() === typeFilter.toLowerCase());
    if (q) {
      result = result.filter(r => [r.providerName, r._providerType, r.tariffCode, r._serviceName]
        .filter(Boolean)
        .some(v => v!.toString().toLowerCase().includes(q)));
    }
    return result;
  }, [rows, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search, typeFilter]);

  const formatPrice = (v: any) => {
    if (v == null || v === "") return "—";
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    return `₦${n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading && rows.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item code or procedure"
              className="w-full rounded-lg border border-slate-300 bg-white px-11 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="w-full md:w-40">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100"
            >
              <option value="All Types">All Types</option>
              {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* <Link href="/dashboard/providers/tariff" className="inline-flex items-center justify-center rounded-[15px] bg-primary w-40 px-4 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 transition">
            <FaPlus className="mr-2" /> Add Tariff
          </Link> */}
        </div>
      </div>

      <div className="rounded-[15px] bg-white p-4 shadow-sm">
        <div className="overflow-x-auto h-90 custom-scrollbar">
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">No tariff rows available.</td>
                </tr>
              ) : (
                paginated.map((rec, idx) => {
                  const itemCode = rec.tariffCode ?? '—';
                  const procedure = rec._serviceName || rec.serviceName || '—';
                  const price = rec._resolvedPrice ?? rec.tierA ?? rec.tierB ?? rec.price ?? rec.amount ?? null;
                  return (
                    <tr key={`${rec.$id || itemCode || idx}`} className="hover:bg-slate-50 transition divide-x divide-border">
                      <td className="px-4 py-4">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
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

      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
        <div className="text-sm text-slate-700">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} tariffs
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <span className="px-3 py-1 text-sm font-medium text-slate-900">Page {currentPage} of {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  );
}
