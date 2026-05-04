'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { toast } from 'sonner';
import { mockPaCodes, type PaCode } from '../mockPaCodes';

const ITEMS_PER_PAGE = 20;

async function getPaCodes(page: number = 1, limit: number = ITEMS_PER_PAGE): Promise<{ data: PaCode[], error?: string }> {
  try {
    const res = await fetch(`/api/admin/pa-codes?page=${page}&limit=${limit}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      return { data: [], error: `Server error: ${res.status}` };
    }

    const data = await res.json();
    let paCodes: any[] = [];

    // Handle the admin/pa-codes response format
    if (data?.data && Array.isArray(data.data)) {
      paCodes = data.data;
    }
    else if (Array.isArray(data)) {
      paCodes = data;
    }
    else {
      console.warn('Unexpected pa-codes response structure:', data);
      return { data: [], error: 'Invalid response format' };
    }

    if (!Array.isArray(paCodes) || paCodes.length === 0) {
      console.warn('No pa-codes found in response');
      return { data: [] };
    }

    const mapped = paCodes.map((doc: any) => ({
      id: doc.$id || doc.id || `pacode-${Date.now()}`,
      authorizationCode: doc.authorizationCode || '',
      createdDate: doc.createdDate || '',
      providerName: doc.providerName || '',
      patientId: doc.patientId || '',
      status: (doc.status || 'under review') as 'approved' | 'under review' | 'declined',
    }));

    return { data: mapped };
  } catch (error) {
    console.error('Error fetching pa-codes:', error);
    const message = error instanceof Error ? error.message : 'Network error';
    return { data: [], error: message };
  }
}

export default function PaCodesClient() {
  const [paCodes, setPaCodes] = useState<PaCode[]>([]);
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usedMockData, setUsedMockData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'under review' | 'declined' | 'all'>('all');
  const [page, setPage] = useState(1);

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Approved', value: 'approved' },
    { label: 'Under Review', value: 'under review' },
    { label: 'Declined', value: 'declined' },
  ];

  const headers = ['Date of Service', 'HMO ID', 'PA Code', 'Provider', 'Status', 'Action'];

  const filteredPaCodes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return paCodes.filter((paCode) => {
      const matchesStatus = selectedStatus === 'all' || paCode.status === selectedStatus;
      const matchesQuery = !normalizedQuery || [
        paCode.authorizationCode,
        paCode.providerName,
        paCode.patientId,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [paCodes, selectedStatus, searchQuery]);

  const paginatedPaCodes = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredPaCodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPaCodes, page]);

  const totalPages = Math.ceil(filteredPaCodes.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const loadPaCodes = async () => {
      setLoading(true);
      setError('');
      setUsedMockData(false);

      try {
        const { data, error: fetchError } = await getPaCodes(page, ITEMS_PER_PAGE);

        if (fetchError) {
          console.warn(`Fetch error: ${fetchError}. Using mock data as fallback.`);
          setPaCodes(mockPaCodes);
          setUsedMockData(true);
          toast.warning('Using demo data - API connection failed');
        } else if (data && data.length > 0) {
          setPaCodes(data);
        } else {
          console.log('No data from API, using mock data');
          setPaCodes(mockPaCodes);
          setUsedMockData(true);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load pa-codes. Using demo data.');
        setPaCodes(mockPaCodes);
        setUsedMockData(true);
        toast.error('Failed to load PA codes, showing demo data');
      } finally {
        setLoading(false);
      }
    };

    loadPaCodes();
  }, [page]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'under review': return 'text-yellow-600 bg-yellow-100';
      case 'declined': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (error && !usedMockData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading pa-codes</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#49A5EF] text-white rounded-md text-sm hover:bg-[#3d8ed8]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 px-2 md:px-0 w-full">
      {usedMockData && (
        <div className="mx-auto md:w-[95%] bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <span className="text-amber-700 text-sm font-medium">⚠️ Showing demo data - API unavailable. Check your connection.</span>
        </div>
      )}
      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-center w-full gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:w-[60%] md:mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search PA codes, provider, or patient"
            className="w-full md:w-[55%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] overflow-hidden w-full mx-auto bg-[#ffffff] shadow-sm">
        {/* Header */}
        <div className="hidden md:block">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col style={{width: '15%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '20%'}} />
              <col style={{width: '25%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '10%'}} />
            </colgroup>
            <thead className="border-b border-[#D9D9D9]">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="text-left text-[18px] px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div ref={tableRef} className='max-h-120 lg:max-h-96 overflow-y-auto custom-scrollbar'>
          {/* Mobile view */}
          <div className="md:hidden">
            {loading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-[#49A5EF]"></div>
                  <span className="ml-2">Loading pa-codes...</span>
                </div>
              </div>
            ) : paginatedPaCodes.length === 0 ? (
              <div className="p-4 text-center">
                No pa-codes found
              </div>
            ) : (
              <table className="min-w-full table-fixed">
                <thead className="border-b border-[#D9D9D9]">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="text-left text-base px-2 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedPaCodes.map((paCode: PaCode) => (
                    <tr key={paCode.id} className="text-sm divide-y divide-[#D9D9D9]">
                      <td className="px-2 py-2">{formatDate(paCode.createdDate)}</td>
                      <td className="px-2 py-2">{paCode.patientId}</td>
                      <td className="px-2 py-2">{paCode.authorizationCode}</td>
                      <td className="px-2 py-2">{paCode.providerName}</td>
                      <td className="px-2 py-2">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(paCode.status)}`}>
                          {paCode.status.charAt(0).toUpperCase() + paCode.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <Link
                          href={`/dashboard/superadmin/pa-code/view?id=${encodeURIComponent(paCode.id)}`}
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3 py-1 text-sm text-[#49A5EF] hover:bg-blue-50 rounded"
                        >
                          <FaEye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Desktop view */}
          <div className="hidden md:block">
            {loading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#49A5EF]"></div>
                  <span className="ml-2">Loading pa-codes...</span>
                </div>
              </div>
            ) : paginatedPaCodes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No pa-codes found
              </div>
            ) : (
              <table className='min-w-full table-fixed'>
                <colgroup>
                  <col style={{width: '15%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '20%'}} />
                  <col style={{width: '25%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '10%'}} />
                </colgroup>
                <tbody>
                  {paginatedPaCodes.map((paCode: PaCode) => (
                    <tr key={paCode.id} className="hover:bg-gray-50 text-[15px] divide-y divide-[#D9D9D9]">
                      <td className="px-6 py-3">{formatDate(paCode.createdDate)}</td>
                      <td className="px-6 py-3">{paCode.patientId}</td>
                      <td className="px-6 py-3">{paCode.authorizationCode}</td>
                      <td className="px-6 py-3">{paCode.providerName}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(paCode.status)}`}>
                          {paCode.status.charAt(0).toUpperCase() + paCode.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/dashboard/superadmin/pa-code/view?id=${encodeURIComponent(paCode.id)}`}
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3 py-1 text-sm text-[#49A5EF] hover:bg-blue-50 rounded"
                        >
                          <FaEye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 lg:p-4 items-center gap-0.5 lg:gap-2 md:w-[90%] mx-auto">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00000032;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}