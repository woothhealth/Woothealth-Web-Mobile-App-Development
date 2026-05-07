'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaPlus, FaChevronDown, FaEllipsisV, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import DeleteConfirmModal from '../DeleteConfirmModal';

export type Provider = {
  $id: string;
  sn?: number;
  name: string;
  address: string;
  state?: string;
  email?: string[] | string;
  phone?: string[] | string;
  type?: string;
  tier?: string;
  remark?: string;
  hasLogin?: boolean;
  city?: string;
  specialization?: string;
  providerCode?: string;
  providerTariff?: string[];
  customTariff?: boolean;
  local_govt?: string;
  lat?: number;
  long?: number;
  status?: string; // Added for status column
  contactPerson?: string; // For edit/add
  licenseNumber?: string; // For edit/add
  mappedPlans?: string[]; // For edit/add
  onboardingDate?: string; // For view
  nhiaNumber?: string; // For view
  wootId?: string; // For view
  adminOfficer?: string; // For view
  $createdAt?: string;
  $updatedAt?: string;
};

async function getProviders(): Promise<Provider[]> {
  const res = await fetch('/api/admin/providers?page=1&limit=20', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch providers');

  const data = await res.json();

  let providers: any[] = [];

  // Handle the admin/providers response format with nested data.providers
  if (data?.data?.providers && Array.isArray(data.data.providers)) {
    providers = data.data.providers;
  }
  else if (data?.providers && Array.isArray(data.providers)) {
    providers = data.providers;
  }
  else if (Array.isArray(data?.data)) {
    providers = data.data;
  }
  else if (Array.isArray(data)) {
    providers = data;
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
    sn: doc.sn,
    name: doc.name || '',
    address: doc.address || '',
    state: doc.state || '',
    email: doc.email || [],
    phone: doc.phone || [],
    type: doc.type || '',
    tier: doc.tier || '',
    remark: doc.remark || '',
    hasLogin: doc.hasLogin || false,
    city: doc.city || '',
    specialization: doc.specialization || '',
    providerCode: doc.providerCode || '',
    providerTariff: doc.providerTariff || [],
    customTariff: doc.customTariff || false,
    local_govt: doc.local_govt || '',
    lat: doc.lat,
    long: doc.long,
    status: doc.status || (doc.hasLogin ? 'Active' : 'Inactive'), // Default status based on hasLogin
    contactPerson: doc.contactPerson || '',
    licenseNumber: doc.licenseNumber || '',
    mappedPlans: doc.mappedPlans || [],
    onboardingDate: doc.$createdAt ? new Date(doc.$createdAt).toLocaleDateString() : '',
    nhiaNumber: doc.nhiaNumber || '',
    wootId: doc.wootId || doc.$id,
    adminOfficer: doc.adminOfficer || '',
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
  }));
}

export default function ProvidersClient({ filterStatus }: { filterStatus?: string } = {}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedCategory, setSelectedCategory] = useState<'name' | 'address' | 'state' | 'type' | 'email' | 'status'>('name');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Provider | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const categories = [
    { label: 'Name', value: 'name' },
    { label: 'Address', value: 'address' },
    { label: 'Type', value: 'type' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'status' },
  ];

  const headers = ['Name', 'Address', 'Email', 'Type', 'Status', 'Action'];

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
    let filtered = providers.filter((p) => {
      if (selectedCategory === 'name') return p.name.toLowerCase().includes(q);
      if (selectedCategory === 'address') return p.address.toLowerCase().includes(q);
      if (selectedCategory === 'type') return (p.type?.toLowerCase().includes(q) ?? false);
      if (selectedCategory === 'email') return (Array.isArray(p.email) ? p.email.join(' ').toLowerCase().includes(q) : (p.email?.toLowerCase().includes(q) ?? false));
      if (selectedCategory === 'status') return (p.status?.toLowerCase().includes(q) ?? false);
      return true;
    });
    if (filterStatus) {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    return filtered;
  }, [providers, search, selectedCategory, filterStatus, statusFilter]);

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
  }, [search, selectedCategory, statusFilter]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollTo({
        behavior: "smooth",
        top: 0,
      })
    }
  }, [page]);

  const handleAddProvider = async (providerData: Omit<Provider, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerData),
      });
      if (!res.ok) throw new Error('Failed to add provider');
      const response = await res.json();
      const newProvider = response.data || response;
      setProviders((prev) => [newProvider, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add provider');
    }
  };

  const handleEditProvider = async (providerData: Omit<Provider, '$id' | '$createdAt' | '$updatedAt'>) => {
    if (!editingProvider) return;
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProvider.$id, ...providerData }),
      });
      if (!res.ok) throw new Error('Failed to update provider');
      const response = await res.json();
      const updatedProvider = response.data || response;
      setProviders((prev) => prev.map((p) => (p.$id === editingProvider.$id ? updatedProvider : p)));
      setIsEditModalOpen(false);
      setEditingProvider(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update provider');
    }
  };

  const handleDeleteProvider = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/providers?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete provider');
      setProviders((prev) => prev.filter((p) => p.$id !== id));
      toast.success('Provider deleted successfully.');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete provider. Please try again.');
    }
  };

  const statusColor = <T extends string>(status: T): string => {
    switch (status) {
      case 'Active':
        return 'bg-[#10B9811A] text-[#10B981]';
      case 'Inactive':
        return 'bg-[#EF44441A] text-[#EF4444]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 mb-8 w-full">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-8 lg:w-[85%] lg:mx-auto">
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
          />

          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
              className="w-full min-w-[170px] bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#49A5EF] transition"
            >
              <span className="text-sm text-slate-700">
                {categories.find((c) => c.value === selectedCategory)?.label || 'Select category'}
              </span>
              <FaChevronDown className={`text-slate-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg overflow-hidden">
                {categories.map((cat) => (
                  <div
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value as any);
                      setShowCategoryDropdown(false);
                    }}
                    className={`rounded-[10px] cursor-pointer w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-[#F8F9FA] transition ${selectedCategory === cat.value ? 'bg-[#E5E7EB]' : ''}`}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setShowStatusDropdown((prev) => !prev)}
              className="w-full min-w-[170px] bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg px-4 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#49A5EF] transition"
            >
              <span className="text-sm text-slate-700">
                {statusFilter === 'All' ? 'All Statuses' : statusFilter}
              </span>
              <FaChevronDown className={`text-slate-500 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg overflow-hidden">
                {['All', 'Active', 'Inactive'].map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as 'All' | 'Active' | 'Inactive');
                      setShowStatusDropdown(false);
                    }}
                    className={`rounded-[10px] cursor-pointer w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-[#F8F9FA] transition ${statusFilter === status ? 'bg-[#E5E7EB]' : ''}`}
                  >
                    {status === 'All' ? 'All Statuses' : status}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#49A5EF] px-4 py-2 w-fit text-sm font-semibold text-white hover:bg-[#41a3f3]"
          >
            <FaPlus /> Add New
          </button>
        </div>
        {loading ? (
          <div className="bg-[#FFFFFF] shadow-sm rounded-[10px] overflow-hidden custom-scrollbar h-96 md:h-full">
            <table className="min-w-full table-fixed">
              <colgroup>
                <col style={{ width: '18%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '26%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '6%' }} />
              </colgroup>
              <thead className="border-b border-[#D9D9D9] sticky top-0 z-10 bg-[#ffffff]">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="text-[18px] px-4 py-4 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              </table>

              <div className="overflow-y-auto custom-scrollbar pb-4 max-h-96">
              <table className='min-w-full table-fixed'>
                <colgroup>
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '26%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '6%' }} />
                </colgroup>
              <tbody>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <tr key={i} className="border-b border-[#E5E7EB]">
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div></td>
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
          <div className="rounded-[10px] bg-white shadow-sm h-96 md:h-120 overflow-y-auto custom-scrollbar">
            <table className="min-w-full table-fixed divide-y divide-[#D9D9D9] text-[16px]">
              <colgroup>
                <col style={{ width: '18%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '26%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '6%' }} />
              </colgroup>
              <thead className="border-b border-[#D9D9D9] sticky top-0 z-10">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="text-left px-4 py-4 font-semibold text-[18px] bg-[#ffffff]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9] bg-white">
                {paginatedProviders.map((p) => (
                  <tr key={p.$id} className="hover:bg-slate-50 text-[16px]">
                    <td className="px-4 py-4 text-slate-900 wrap-break-word">{p.name}</td>
                    <td className="px-4 py-4 text-slate-600 wrap-break-word">{p.address}</td>
                    <td className="px-4 py-4 text-slate-600 wrap-break-word">{Array.isArray(p.email) ? p.email.join(', ') : p.email}</td>
                    <td className="px-4 py-4 text-slate-600 wrap-break-word">{p.type ?? '-'}</td>
                    <td className={`px-4 py-4 wrap-break-word}`}>
                      <span className={`${statusColor(p.status || '-')} rounded-full p-2 text-[13px]`}>{p.status ?? '-'}</span>
                    </td>
                    <td className="px-4 py-4 relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === p.$id ? null : p.$id)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <FaEllipsisV />
                      </button>
                      {openMenuId === p.$id && (
                        <div className="absolute right-0 top-full z-10 w-32 rounded-lg border border-slate-200 bg-white shadow-lg">
                          <Link
                            href={`/dashboard/superadmin/providers/${p.$id}`}
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <FaEye /> View
                          </Link>
                          <button
                            onClick={async () => {
                              // Fetch individual provider data for edit
                              try {
                                const response = await fetch(`/api/admin/providers?id=${p.$id}`, { credentials: 'include' });
                                if (response.ok) {
                                  const data = await response.json();
                                  if (data.success && data.data) {
                                    setEditingProvider(data.data);
                                  } else {
                                    setEditingProvider(p); // fallback to list data
                                  }
                                } else {
                                  setEditingProvider(p); // fallback to list data
                                }
                              } catch (error) {
                                setEditingProvider(p); // fallback to list data
                              }
                              setIsEditModalOpen(true);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(p);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div ref={tableRef} />
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

      {isAddModalOpen && (
        <ProviderModal
          provider={null}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProvider}
        />
      )}

      {isEditModalOpen && editingProvider && (
        <ProviderModal
          provider={editingProvider}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProvider(null);
          }}
          onSave={handleEditProvider}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete provider"
          description={
            <>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </>
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteProvider(deleteTarget.$id)}
        />
      )}
    
    <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
        table {
          table-layout: fixed;
        }
        table td {
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          white-space: normal;
        }
      `}</style>
    </div>

  );
}

interface ProviderModalProps {
  provider: Provider | null;
  onClose: () => void;
  onSave: (providerData: Omit<Provider, '$id' | '$createdAt' | '$updatedAt'>) => void;
}

function ProviderModal({ provider, onClose, onSave }: ProviderModalProps) {
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    address: provider?.address || '',
    type: provider?.type || '',
    email: Array.isArray(provider?.email) ? provider.email.join(', ') : provider?.email || '',
    phone: Array.isArray(provider?.phone) ? provider.phone.join(', ') : provider?.phone || '',
    contactPerson: provider?.contactPerson || '',
    licenseNumber: provider?.licenseNumber || '',
    mappedPlans: Array.isArray(provider?.mappedPlans) ? provider.mappedPlans.join(', ') : '',
    status: provider?.status || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Provider name is required';
    if (!formData.address.trim()) nextErrors.address = 'Address is required';
    if (!formData.type.trim()) nextErrors.type = 'Type is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      email: formData.email.split(',').map(e => e.trim()),
      phone: formData.phone.split(',').map(p => p.trim()),
      mappedPlans: formData.mappedPlans.split(',').map(p => p.trim()),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{provider ? 'Edit Provider' : 'Add New Provider'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Provider Name" error={errors.name}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Address" error={errors.address}>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Type" error={errors.type}>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Email">
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email1@example.com, email2@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Phone">
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="phone1, phone2"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Contact Person">
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="License Number">
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Mapped Plans">
              <input
                type="text"
                value={formData.mappedPlans}
                onChange={(e) => setFormData({ ...formData, mappedPlans: e.target.value })}
                placeholder="plan1, plan2"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              />
            </Field>
            <Field label="Status">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#49A5EF] px-4 py-2 text-white hover:bg-[#41a3f3]"
            >
              {provider ? 'Update' : 'Add'} Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function DeleteConfirm({ provider, onCancel, onConfirm }: { provider: Provider; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Delete Provider</h2>
        <p className="mt-3 text-slate-600">
          Are you sure you want to delete <strong>{provider.name}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}