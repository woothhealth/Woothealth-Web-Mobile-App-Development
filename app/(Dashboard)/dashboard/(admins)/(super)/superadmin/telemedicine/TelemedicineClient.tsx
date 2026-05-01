'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { FaEllipsisV, FaEye, FaEdit } from 'react-icons/fa';

type Telemedicine = {
  id: string;
  dateOfService: string;
  patient: string;
  hmoId: string;
  doctor: string;
  specialization: string;
  duration: string;
  status: 'completed' | 'ongoing' | 'scheduled';
};

const ITEMS_PER_PAGE = 20;

async function getTelemedicine(): Promise<Telemedicine[]> {
  const res = await fetch('/api/admin/telemedicine?page=1&limit=20', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch telemedicine');

  const data = await res.json();

  let telemedicine: any[] = [];

  // Handle the admin/telemedicine response format
  if (data?.data && Array.isArray(data.data)) {
    telemedicine = data.data;
  }
  else if (Array.isArray(data)) {
    telemedicine = data;
  }
  else {
    console.warn('Unexpected telemedicine response structure:', data);
    return [];
  }

  if (!Array.isArray(telemedicine) || telemedicine.length === 0) {
    console.warn('No telemedicine found in response');
    return [];
  }

  return telemedicine.map((doc: any) => ({
    id: doc.$id || doc.id || Math.random().toString(),
    dateOfService: doc.dateOfService || '',
    patient: doc.patient || '',
    hmoId: doc.hmoId || '',
    doctor: doc.doctor || '',
    specialization: doc.specialization || '',
    duration: doc.duration || '',
    status: doc.status || 'scheduled',
  }));
}

export default function TelemedicineClient() {
  const [telemedicine, setTelemedicine] = useState<Telemedicine[]>([]);
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'ongoing' | 'scheduled' | 'all'>('all');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Scheduled', value: 'scheduled' },
  ];

  const headers = ['Date of Service', 'Patient', 'HMO ID', 'Doctor', 'Specialization', 'Duration', 'Status', 'Action'];

  const filteredTelemedicine = useMemo(() => {
    let filtered = telemedicine;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    // Filter by search (patient, doctor, or specialization)
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.patient.toLowerCase().includes(q) ||
        item.doctor.toLowerCase().includes(q) ||
        item.specialization.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [telemedicine, search, selectedStatus]);

  const paginatedTelemedicine = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredTelemedicine.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTelemedicine, page]);

  const totalPages = Math.ceil(filteredTelemedicine.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadTelemedicine = async () => {
      setLoading(true);
      try {
        const data = await getTelemedicine();
        setTelemedicine(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load telemedicine.');
      } finally {
        setLoading(false);
      }
    };

    loadTelemedicine();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'ongoing': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading telemedicine</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 w-full">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center  md:w-[60%] md:mx-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by patient, doctor, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF] w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#ffffff] shadow-sm rounded-[10px] overflow-hidden md:w-[95%] mx-auto">
        {/* Header */}
        <div className="hidden md:block">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col style={{width: '12%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '10%'}} />
              <col style={{width: '12%'}} />
              <col style={{width: '9%'}} />
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#49A5EF]"></div>
                  <span className="ml-2">Loading telemedicine...</span>
                </div>
              </div>
            ) : paginatedTelemedicine.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No telemedicine found
              </div>
            ) : (
              <table className="min-w-full table-fixed">
                <thead className="border-b border-[#D9D9D9]">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="text-left text-sm px-2 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedTelemedicine.map((item: Telemedicine) => (
                    <tr key={item.id} className="text-sm divide-y divide-[#D9D9D9]">
                      <td className="px-2 py-2">{formatDate(item.dateOfService)}</td>
                      <td className="px-2 py-2">{item.patient}</td>
                      <td className="px-2 py-2">{item.hmoId}</td>
                      <td className="px-2 py-2">{item.doctor}</td>
                      <td className="px-2 py-2">{item.specialization}</td>
                      <td className="px-2 py-2">{item.duration}</td>
                      <td className="px-2 py-2">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-2 py-2 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <FaEllipsisV />
                        </button>
                        {openMenuId === item.id && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                            <Link
                              href={`/dashboard/superadmin/telemedicine/view?id=${item.id}`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEye /> View
                            </Link>
                            <Link
                              href={`/dashboard/superadmin/telemedicine/${item.id}/edit`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEdit /> Edit
                            </Link>
                          </div>
                        )}
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
                  <span className="ml-2">Loading telemedicine...</span>
                </div>
              </div>
            ) : paginatedTelemedicine.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No telemedicine found
              </div>
            ) : (
              <table className='min-w-full table-fixed'>
                <colgroup>
                  <col style={{width: '12%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '12%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '10%'}} />
                  <col style={{width: '12%'}} />
                  <col style={{width: '9%'}} />
                </colgroup>
                <tbody>
                  {paginatedTelemedicine.map((item: Telemedicine) => (
                    <tr key={item.id} className="hover:bg-gray-50 text-[15px] divide-y divide-[#D9D9D9]">
                      <td className="px-6 py-3">{formatDate(item.dateOfService)}</td>
                      <td className="px-6 py-3">{item.patient}</td>
                      <td className="px-6 py-3">{item.hmoId}</td>
                      <td className="px-6 py-3">{item.doctor}</td>
                      <td className="px-6 py-3">{item.specialization}</td>
                      <td className="px-6 py-3">{item.duration}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <FaEllipsisV />
                        </button>
                        {openMenuId === item.id && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                            <Link
                              href={`/dashboard/superadmin/telemedicine/view?id=${item.id}`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEye /> View
                            </Link>
                            <Link
                              href={`/dashboard/superadmin/telemedicine/${item.id}/edit`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEdit /> Edit
                            </Link>
                          </div>
                        )}
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