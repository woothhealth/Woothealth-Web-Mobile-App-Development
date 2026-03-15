'use client';

import { Reveal } from '@/UI/Reveal';
import { table } from 'console';
import { useState, useEffect, useMemo, useRef } from 'react';

type Provider = {
  $id: string;
  sn?: number;
  name: string;
  address: string;
  state?: string;
  email?: string;
};

async function getProviders(): Promise<Provider[]> {
  const res = await fetch('/api/providers?page=1&limit=20', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch providers');

  const data = await res.json();

  let providers: any[] = [];

  if (Array.isArray(data)) {
    providers = data;
  }
  else if (data?.data?.categories && Array.isArray(data.data.categories)) {
    const providersCategory = data.data.categories.find((c: any) => c.name === 'providers');
    providers = providersCategory?.documents || [];
  }
  else if (data?.providers && Array.isArray(data.providers)) {
    providers = data.providers;
  }
  else if (data?.data && Array.isArray(data.data)) {
    providers = data.data;
  }
  else {
    console.warn('Unexpected providers response structure:', data);
    return [];
  }

  if (!Array.isArray(providers) || providers.length === 0) {
    console.warn('No providers found in response');
    return [];
  }

  return providers.map((doc: any) => ({
    $id: doc.$id || doc.id || Math.random().toString(),
    name: doc.name || '',
    address: doc.address || '',
    state: doc.state || ''
  }));
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'name' | 'address' | 'state'>('name');
  const [page, setPage] = useState(1);

  const categories = [
    { label: 'Provider Name', value: 'name' },
    { label: 'Address', value: 'address' },
    { label: 'State', value: 'state' },
  ];

  const headers = ['Provider Name', 'Address', 'State'];

  const ITEMS_PER_PAGE = 20;
  const PAGE_WINDOW = 8;


  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load providers.');
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    const q = search.toLowerCase();
    return providers.filter((p) => {
      if (selectedCategory === 'name') return p.name.toLowerCase().includes(q);
      if (selectedCategory === 'address') return p.address.toLowerCase().includes(q);
      if (selectedCategory === 'state') return (p.state?.toLowerCase().includes(q) ?? false);
      return true;
    });
  }, [providers, search, selectedCategory]);

  const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);

  const paginationPages = useMemo(() => {
  const pages: number[] = [];

  let start = Math.max(1, page - Math.floor(PAGE_WINDOW / 2));
  let end = start + PAGE_WINDOW - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - PAGE_WINDOW + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}, [page, totalPages]);


  const paginatedProviders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProviders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProviders, page]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        behavior: "smooth",
        top: 0,
      })
    }
  }, [page]);

  return (
    <div className="p-4 mb-8 w-full lg:max-w-6xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row gap-4 mb-8 lg:w-[55%] lg:mx-auto">
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
            />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]">
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </Reveal>
      <Reveal>
        {loading ? (
          <div className="border border-gray-200 rounded-[10px] overflow-hidden">
            <table className="min-w-full">
              <thead className="text-[#FFFFFF] bg-[#49A5EF]">
                <tr className=''>
                  {headers.map((h) => (
                    <th key={h} className="text-[18px] px-6 py-6 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              </table>

              <div className="overflow-y-auto custom-scrollbar pb-4 max-h-120">
              <table className='min-w-full'>
              <tbody className=''>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <tr key={i} className="">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                    </td>
                    <td className="pl-6 pr-10 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ) : error ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className='flex justify-center h-64 mt-4'>
            <p>No providers found.</p>
          </div>
        ) : (
          <>
          <div className="border border-gray-200 rounded-[10px] overflow-hidden">
            {/* Header */}
            <table className="min-w-full">
              <thead className="bg-[#49A5EF] text-[#FFFFFF]">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="text-left text-[18px] px-6 py-6 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            <div ref={tableRef} className='max-h-120 lg:max-h-96 overflow-y-auto custom-scrollbar'>
            <table className='min-w-full'>
              <tbody>
                {paginatedProviders.map((p) => (
                  <tr key={p.$id} className="hover:bg-gray-50 text-[14px] uppercase">
                    <td className="px-6 py-3 w-[35%] border-b border-[#E5E7EB]">{p.name}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB] w-[45%]">{p.address}</td>
                    <td className="pl-6 pr-10 py-3 border-b border-[#E5E7EB] w-[20%]">{p.state ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
            {totalPages > 1 && (
  <div className="flex justify-center mt-4 lg:p-4 items-center gap-0.5 lg:gap-2">

    {paginationPages[0] > 1 && (
      <>
        <button
          onClick={() => setPage(1)}
          className="lg:px-3 px-2 py-1 text-sm md:text-base rounded-lg border bg-white"
        >
          1
        </button>
        {paginationPages[0] > 2 && <span>...</span>}
      </>
    )}

    {paginationPages.map((pNum) => (
      <button
        key={pNum}
        onClick={() => setPage(pNum)}
        className={`lg:px-3 px-2 text-sm md:text-base py-1 rounded-lg border ${
          pNum === page
            ? 'bg-[#49A5EF] text-white'
            : 'bg-white text-black'
        }`}
      >
        {pNum}
      </button>
    ))}

    {paginationPages[paginationPages.length - 1] < totalPages && (
      <>
        {paginationPages[paginationPages.length - 1] < totalPages - 1 && (
          <span>...</span>
        )}
        <button
          onClick={() => setPage(totalPages)}
          className="lg:px-3 px-2 py-1 text-sm md:text-base rounded-lg border bg-white"
        >
          {totalPages}
        </button>
      </>
    )}

  </div>
)}
          </>
        )}
      </Reveal>
    
    <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #464646;
          border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #464646;
        }
      `}</style>
    </div>

  );
}