'use client'

import React from "react";
import { useEffect, useMemo, useState } from "react";
import { getProviders } from '@/lib/provider';

type Provider = {
  $id: string;
  name: string;
  specialization: string;
  address: string;
  state?: string;
};

const ITEMS_PER_PAGE = 20;

const Providers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    "Provider Name",
    "Address",
    "State"
  ];

  const header = [
    "Provider Name",
    "Address",
    "State"
  ]

  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    try {
      setLoading(true);
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      setProviders([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 🔍 Search logic (frontend-only)
  const filteredProviders = useMemo(() => {
    const q = search.toLowerCase();
    return providers.filter((p) =>
      (p.name?.toLowerCase().includes(q) ||
      p.specialization?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q))
    );
  }, [providers, search]);

  // 📄 Pagination logic
  const totalPages = Math.ceil(
    filteredProviders.length / ITEMS_PER_PAGE
  );

  const paginatedProviders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProviders.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredProviders, page]);

  // Reset page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <section className='py-4 md:p-4 md:my-4'>
      <section className='flex items-center flex-col py-8 text-[#120052] text-center space-y-2 md:px-4'>
            <h2 className='text-[28px] md:text-[35px] font-bold'>Find Quality Healthcare Near You</h2>
            <p className='text-[17px] md:text-lg md:w-172'>Search thousands of trusted hospitals, Pharmacy, Dental Clinics, Diagnostic Centers and Wellness &Therapy Facilities across Nigeria.</p>
        </section>
      {/* Search and Filter */}
      <section className="pb-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by provider name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-2 px-3 placeholder:text-[0.95rem] rounded-xl bg-[#F8F9FA] outline-[#E5E7EB] w-full sm:w-64 outline-1"
              />
            </div>
            <div className='flex gap-3'>
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 appearance-none py-2 px-3 placeholder:text-[0.95rem] rounded-xl bg-[#F8F9FA] outline-[#E5E7EB] outline-1"
              >
                <option value="all">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 placeholder:text-[0.95rem] rounded-xl bg-[#F8F9FA] outline-[#E5E7EB] outline-1 w-full sm:w-48 appearance-none"
              >
                <option value="all">All</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            </div>
            <button value='submit' className='btn rounded-sm px-16 py-2'>
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="md:w-[85%] mx-auto">
        <table className='grid grid-cols-3 rounded-t-2xl bg-[#49A5EF] md:items-start items-center md:px-6'>
          {header.map((head, index) => {
            return (<thead key={index} className='text-[#FFFFFF] py-3 text-lg'>
              <tr>
                <th>
                  {head}
                </th>
              </tr>
              </thead>)
          })}
        </table>
          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProviders.length === 0 ? (
            <div className="mt-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">No Provider Found</h3>
              <p className="text-muted-foreground">
                Try again Later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paginatedProviders.map((p) => (
                <React.Fragment key={p.$id}>
                  <tr className="border-b border-[#D9D9D9] text-[13px] md:text-[15px]">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.address}</td>
                    <td className="p-3">{p.state || p.specialization}</td>
                  </tr>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
      </section>
    </section>
  );
};

export default Providers;