'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { LuUpload } from 'react-icons/lu';

type Provider = {
  $id: string;
  sn?: number;
  name: string;
  address: string;
  state?: string;
  email?: string;
};

const ITEMS_PER_PAGE = 20;

export default function Employee() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'name' | 'address' | 'state'>('name');
  const [page, setPage] = useState(1);

  const categories = [
    { label: 'Employee Name', value: 'name' },
    { label: 'Address', value: 'address' },
    { label: 'Plan', value: 'state' },
  ];

  const headers = ['Employee Name', 'Address', 'Plan'];

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);
      try {
        // const data = await getProviders();
        // setProviders(data);
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
  const paginatedProviders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProviders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProviders, page]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  return (
    <div className="p-4 pt-10 w-full lg:max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8 lg:w-[90%] lg:mx-auto">
          <input
            type="text"
            placeholder="Search Employees..."
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
          <button className='border rounded-[10px] w-fit px-6 border-[#E5E7EB]'>
            Export <LuUpload className="inline-block ml-1" />
          </button>
          <Link href={`/dashboard/business/employees/add`} className="bg-[#49A5EF] text-white px-4 py-2 rounded-[10px]">Add Employees</Link>
        </div>
        {loading ? (
          <div className="overflow-x-auto custom-scrollbar pb-4 h-120">
            <table className="min-w-full border border-gray-200 rounded-[10px] overflow-hidden">
              <tbody className='overflow-y-auto h-96'>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="pl-6 pr-10 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className='text-lg'>No Employee found.</p>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto custom-scrollbar pb-4 h-120">
            <table className="min-w-full border border-gray-200 rounded-[10px] overflow-hidden">
              <thead className="text-[#FFFFFF]">
                <tr className='bg-[#49A5EF]'>
                  {headers.map((h) => (
                    <th key={h} className="text-left text-[18px] px-6 py-6 border-b">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='overflow-y-auto h-96'>
                {paginatedProviders.map((p) => (
                  <tr key={p.$id} className="hover:bg-gray-50 text-[14px] uppercase text-[#000000]">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{p.name}</td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">{p.address}</td>
                    <td className="pl-6 pr-10 py-3 border-b border-[#E5E7EB]">{p.state ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`px-3 py-1 rounded-lg border ${
                      pNum === page ? 'bg-[#49A5EF] text-white' : 'bg-white text-black'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
    
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