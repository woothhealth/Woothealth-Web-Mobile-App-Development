'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';
import ProviderActionButtonsHandler from '../../ProviderActionButtonsHandler';

interface Provider {
  $id: string;
  sn?: number;
  name: string;
  address?: string;
  state?: string;
  profile_pic?: string;
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
  status?: string;
  contactPerson?: string;
  licenseNumber?: string;
  mappedPlans?: string[];
  onboardingDate?: string;
  nhiaNumber?: string;
  wootId?: string;
  adminOfficer?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

async function getProvider(providerId: string): Promise<Provider | null> {
  try {
    const response = await fetch(`/api/admin/providers?id=${encodeURIComponent(providerId)}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle different response structures
    if (data.success) {
      // Check if data.data.providers is an array (like bulk fetch)
      if (data.data && data.data.providers && Array.isArray(data.data.providers)) {
        const foundProvider = data.data.providers.find((p: Provider) => p.$id === providerId);
        if (foundProvider) {
          return foundProvider;
        }
        // If not found by $id, try the first one (assuming single provider response)
        if (data.data.providers.length === 1) {
          return data.data.providers[0];
        }
      }
      // Check if data.data is an array
      else if (Array.isArray(data.data)) {
        const foundProvider = data.data.find((p: Provider) => p.$id === providerId);
        if (foundProvider) {
          return foundProvider;
        }
        // If not found, try the first one
        if (data.data.length === 1) {
          return data.data[0];
        }
      }
      // Check if data.data is a single provider object
      else if (data.data && typeof data.data === 'object' && data.data.$id) {
        return data.data;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex md:items-center flex-col md:flex-row md:justify-between border-b border-[#D9D9D9] px-2 md:px-4 py-2">
      <span className="md:w-1/3 font-semibold">{label}</span>
      <span className="w-fit md:text-end text-sm md:text-base">{value}</span>
    </div>
  );
}

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.providerId as string;
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = ['All', 'System', 'Status'];
  const [showCreateFeed, setShowCreateFeed] = useState(false);
  const [feedText, setFeedText] = useState('');
  const [agentName, setAgentName] = useState('');
  const [feedTimestamp, setFeedTimestamp] = useState('');
  const [feedType, setFeedType] = useState('general');
  const [feedHistory, setFeedHistory] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedSubmitting, setFeedSubmitting] = useState(false);

  const handleProviderUpdate = (updatedProvider: Provider) => {
    setProvider(updatedProvider);
  };

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      setLoading(true);
      const providerData = await getProvider(providerId);
      setProvider(providerData);
      if (providerData) void fetchFeedsForProvider(providerData.$id || providerId);
      setLoading(false);
    };

    fetchProvider();
  }, [providerId]);

  const toggleFilterMenu = () => setIsFilterOpen((prev) => !prev);
  const selectFilter = (option: string) => {
    setSelectedFilter(option);
    setIsFilterOpen(false);
  };

  async function fetchFeedsForProvider(id?: string | null) {
    if (!id) {
      setFeedHistory([]);
      return;
    }
    try {
      setFeedLoading(true);
      const route = `/api/admin/feedback?search=${encodeURIComponent(id)}`;
      const res = await fetch(route, { credentials: 'include' });
      if (!res.ok) {
        setFeedHistory([]);
        setFeedLoading(false);
        return;
      }
      const data = await res.json().catch(() => null);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const normalized = (list as any[]).map((f) => normalizeFeed(f));
      setFeedHistory(normalized);
      setFeedLoading(false);
    } catch (err) {
      console.error('Failed to fetch feeds for provider', id, err);
      setFeedHistory([]);
      setFeedLoading(false);
    }
  }

  function normalizeFeed(f: any) {
    return {
      id: f.id || f.$id || f._id || `feed-${Date.now()}`,
      type: (f.type || f.feedType || 'general').toString().toLowerCase(),
      agentName: f.agentName || f.agent || 'Admin User',
      description: f.description || f.note || f.message || '',
      feedTimestamp: f.feedTimestamp || f.createdAt || new Date().toISOString(),
      createdAt: f.createdAt || f.feedTimestamp || new Date().toISOString(),
    };
  }

  const filteredFeeds = feedHistory.filter((f) => selectedFilter === 'All' || (f.type || '').toString().toLowerCase() === selectedFilter.toLowerCase());

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleAddFeed = async () => {
    if (!feedText.trim()) return;
    setFeedSubmitting(true);
    try {
      const payload = {
        userId: provider?.$id || providerId,
        type: feedType,
        agentName: agentName || 'Admin User',
        description: feedText.trim(),
        feedTimestamp: feedTimestamp || new Date().toISOString(),
      };
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let parsed: any = {};
        try { parsed = JSON.parse(text); } catch {}
        throw new Error(parsed?.message || parsed?.error || `Failed to create feed (${res.status})`);
      }
      const parsed = await res.json().catch(() => null);
      const created = parsed?.data ?? parsed ?? payload;
      setFeedHistory((current) => [normalizeFeed(created), ...current]);
      setFeedText('');
      setFeedType('general');
      setAgentName('');
      setFeedTimestamp('');
      setShowCreateFeed(false);
      toast.success('Feed added successfully.');
    } catch (err) {
      console.error('Failed to create feed', err);
    } finally {
      setFeedSubmitting(false);
    }
  };

  const initials = (provider?.name || '').split(' ').map((s) => s.charAt(0)).slice(0,2).join('').toUpperCase();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">Provider not found.</p>
          <Link
            href=".."
            className="mt-6 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to providers
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    'Active': 'bg-[#D1FAE5] text-[#10B981]',
    'Inactive': 'bg-[#FEE2E2] text-[#EF4444]',
  };

  const emailDisplay = Array.isArray(provider.email) ? provider.email.join(', ') : (provider.email as string) || '—';
  const phoneDisplay = Array.isArray(provider.phone) ? provider.phone.join(', ') : (provider.phone as string) || '—';
  const profilePicDisplay = provider.profile_pic || '—';

  return (
    <section className="space-y-4 md:space-y-6 px-2 md:p-6">
      <Link
        href="/dashboard/superadmin/providers"
        className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
      >
        <FaArrowLeft />
        Back to Providers
      </Link>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
        {/* Left Column: Provider Data */}
        <div className="space-y-4 rounded-[10px] bg-white md:px-4 px-2 py-6 shadow-sm">
          <div className='flex justify-center items-center flex-col space-y-2 h-fit text-center border-b border-[#D9D9D9] pb-6'>
            <div className='h-20 w-20 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
              {provider.name?.charAt(0).toUpperCase() || profilePicDisplay || 'P'}
            </div>
            <h1 className="text-3xl font-semibold">{provider.name}</h1>
            <div className='flex items-center space-x-2 text-sm'>
              <p className="bg-[#49A5EF] text-[#ffffff] py-1 px-4 rounded-[5px]">{provider.type}</p>
              <p className={`px-4 py-1 rounded-[5px] ${statusColors[provider.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                {provider.status || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <DetailCard label="Admin Officer" value={provider.adminOfficer || '—'} />
            <DetailCard label="Email Address" value={emailDisplay} />
            <DetailCard label="Phone Number" value={phoneDisplay} />
            <DetailCard label="Provider Tier" value={provider.tier || '—'} />
            <DetailCard label="NHIA Number" value={provider.nhiaNumber || '—'} />
            <DetailCard label="WOOT ID" value={provider.$id || '—'} />
            <DetailCard label="Type" value={provider.type || '—'} />
            <DetailCard label="State" value={provider.state || '—'} />
            <DetailCard label="Onboarding Date" value={provider.onboardingDate || '—'} />
            <DetailCard label="Status" value={provider.status || '—'} />
            <DetailCard label="Mapped Plans" value={provider.remark || '—'} />
          </div>

          <div className="">
            <ProviderActionButtonsHandler provider={provider} onProviderUpdate={handleProviderUpdate} />
          </div>
        </div>

        {/* Right Column: Recent Activity/Feed */}
        <div className='space-y-4 lg:space-y-16'>
          {/* Feed */}
        <div className="space-y-4 rounded-[10px] bg-white p-4 shadow-md h-fit">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-slate-900">Most Recent Feeds</h2>
            <button
              type="button"
              onClick={() => setShowCreateFeed(true)}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#10B981]/90"
            >
              Create Feed
            </button>
          </div>

          <div className='flex space-x-2 w-full'>
            <p className='w-full font-semibold'>Filter By</p>
            <div className='relative w-full'>
              <div
                onClick={toggleFilterMenu}
                className="flex items-center w-full justify-between rounded-[5px] border border-border px-3 py-1 text-sm font-medium text-slate-700 hover:bg-gray-100"
              >
                {selectedFilter}
                <IoIosArrowBack
                  size={12}
                  className={`transform transition-transform ${isFilterOpen ? 'rotate-90' : 'rotate-270'}`}
                />
              </div>
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-1 flex flex-col space-y-1 rounded-[10px] border border-border w-full bg-white shadow-lg">
                  {filterOptions.map((option) => (
                    <div
                      key={option}
                      className={`w-full text-left px-4 py-2 text-sm font-medium rounded-[10px] ${
                        selectedFilter === option
                          ? 'bg-[#49A5EF] text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => selectFilter(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {feedLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : filteredFeeds.length === 0 ? (
              <p className="text-sm text-slate-500">No feeds available for this provider.</p>
            ) : (
              filteredFeeds.map((f: any) => (
                <div key={f.id} className="rounded-lg border border-[#E5E7EB] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold uppercase">{f.type}</div>
                    <div className="text-xs text-slate-500">{formatDate(f.feedTimestamp || f.createdAt)}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">{f.description}</div>
                  <div className="mt-2 text-xs text-slate-500 capitalize">{f.agentName}</div>
                </div>
              ))
            )}
          </div>

          {/* Create Feed Modal */}
          {showCreateFeed && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
              <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Add Feed</h2>
                  <div onClick={() => setShowCreateFeed(false)} className="cursor-pointer"><IoIosArrowBack /></div>
                </div>

                  <div className="mt-4">
                  <div className="flex flex-col items-center space-y-1">
                    {initials && (
                      <div className='h-16 w-16 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-xl border-2 border-[#D9D9D9]'>
                        {initials}
                      </div>
                    )}
                    <h2 className="text-xl font-semibold uppercase">{provider.name}</h2>
                    <div className="flex items-center space-x-2 text-white">
                      <span className={`px-2 py-1 text-[11px] rounded-[5px] bg-[#49A5EF]`}>
                        {provider.type || 'No Type'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-[5px] ${statusColors[provider.status || ''] || ''}`}>
                        {provider.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Feed Type</span>
                    <select
                      value={feedType}
                      onChange={(e) => setFeedType(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="pa-code">PA Code</option>
                      <option value="plan-purchase">Plan Purchase</option>
                      <option value="benefits">Benefits</option>
                      <option value="declined-care">Denied Care</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Description</span>
                    <textarea
                      value={feedText}
                      onChange={(e) => setFeedText(e.target.value)}
                      rows={4}
                      placeholder="Enter feed description..."
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none"
                    />
                  </label>
                </div>

                <div className='grid grid-cols-2 gap-4 mt-4'>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Agent Name</span>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Time and Date stamp</span>
                    <input
                      type="datetime-local"
                      value={feedTimestamp}
                      onChange={(e) => setFeedTimestamp(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                    />
                  </label>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateFeed(false)}
                    className="flex-1 rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddFeed}
                    disabled={feedSubmitting}
                    className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold text-white ${feedSubmitting ? 'bg-gray-300' : 'bg-[#49A5EF] hover:bg-[#3d8ed8]'}`}
                  >
                    {feedSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Feed'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}