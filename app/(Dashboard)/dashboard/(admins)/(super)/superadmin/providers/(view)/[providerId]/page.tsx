'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ProviderActionButtonsHandler from '../../ProviderActionButtonsHandler';

interface Provider {
  $id: string;
  sn?: number;
  name: string;
  address?: string;
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
      setLoading(false);
    };

    fetchProvider();
  }, [providerId]);

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
              {provider.name?.charAt(0).toUpperCase() || 'P'}
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
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button
              type="button"
              onClick={() => {
                // Handle add activity
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#49A5EF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3d8ed8]"
            >
              Add Activity
            </button>
          </div>

          {/* Activity List Placeholder */}
          <div className="max-h-96 space-y-3 overflow-y-auto">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#2563EB]">
                      System
                    </span>
                    <span className="text-xs text-slate-500">
                      {provider.$createdAt ? new Date(provider.$createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">Provider account created</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#2563EB]">
                      Status
                    </span>
                    <span className="text-xs text-slate-500">
                      {provider.$updatedAt ? new Date(provider.$updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">Provider status: {provider.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}