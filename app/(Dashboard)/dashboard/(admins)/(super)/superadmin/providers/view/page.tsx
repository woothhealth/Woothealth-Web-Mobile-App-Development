import Link from 'next/link';
import ProviderViewClient from './ProviderViewClient';

interface ProviderViewPageProps {
  searchParams: Promise<{
    providerId?: string;
  }>;
}

async function getProvider(id: string): Promise<any> {
  const cookieStore = await require('next/headers').cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`/api/admin/providers?providerId=${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch provider');
  const data = await res.json();
  
  // Handle different response formats
  if (data.data && !Array.isArray(data.data)) {
    return data.data;
  } else if (data.data && Array.isArray(data.data)) {
    return data.data[0];
  }
  return data;
}

export default async function ProviderViewPage({ searchParams }: ProviderViewPageProps) {
  const { providerId } = await searchParams;
  const id = providerId;
  if (!id) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">Provider ID not provided.</p>
          <Link
            href="/dashboard/superadmin/providers"
            className="mt-6 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to providers
          </Link>
        </div>
      </div>
    );
  }

  let provider;
  try {
    provider = await getProvider(id);
  } catch (err) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">Provider not found.</p>
          <Link
            href="/dashboard/superadmin/providers"
            className="mt-6 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to providers
          </Link>
        </div>
      </div>
    );
  }

  // Map the provider data to match our interface
  const mappedProvider = {
    $id: provider.$id || provider.id,
    name: provider.name || '',
    address: provider.address || '',
    state: provider.state || '',
    email: provider.email || [],
    phone: provider.phone || [],
    type: provider.type || '',
    tier: provider.tier || '',
    remark: provider.remark || '',
    hasLogin: provider.hasLogin || false,
    city: provider.city || '',
    specialization: provider.specialization || '',
    providerCode: provider.providerCode || '',
    providerTariff: provider.providerTariff || [],
    customTariff: provider.customTariff || false,
    local_govt: provider.local_govt || '',
    lat: provider.lat,
    long: provider.long,
    status: provider.status || (provider.hasLogin ? 'Active' : 'Inactive'),
    contactPerson: provider.contactPerson || '',
    licenseNumber: provider.licenseNumber || '',
    mappedPlans: provider.mappedPlans || provider.providerTariff || [],
    onboardingDate: provider.$createdAt ? new Date(provider.$createdAt).toLocaleDateString() : '',
    nhiaNumber: provider.nhiaNumber || provider.providerCode || '',
    wootId: provider.wootId || provider.$id,
    adminOfficer: provider.adminOfficer || '',
    $createdAt: provider.$createdAt,
    $updatedAt: provider.$updatedAt,
  };

  return (
    <div className="p-4 mb-8 w-full lg:max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Provider profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{mappedProvider.name}</h1>
            <p className="mt-1 text-sm text-slate-600">Provider profile details for the selected provider.</p>
          </div>
          <Link
            href="/dashboard/superadmin/providers"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to providers
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Provider name</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.name}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Address</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.address}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Email</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{Array.isArray(mappedProvider.email) ? mappedProvider.email.join(', ') : mappedProvider.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Phone</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{Array.isArray(mappedProvider.phone) ? mappedProvider.phone.join(', ') : mappedProvider.phone}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Provider tier</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.tier}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">NHIA number</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.nhiaNumber}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Woot ID</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.wootId}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Type</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.type}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Onboarding date</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.onboardingDate}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Status</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{mappedProvider.status}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Mapped plans</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{Array.isArray(mappedProvider.mappedPlans) ? mappedProvider.mappedPlans.join(', ') : mappedProvider.mappedPlans}</p>
          </div>
        </div>
      </div>

      <ProviderViewClient provider={mappedProvider} />
    </div>
  );
}