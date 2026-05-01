import Link from 'next/link';
import { cookies } from 'next/headers';

interface UserViewPageProps {
  searchParams: Promise<{
    userId?: string;
  }>;
}

async function getUser(id: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`/api/admin/user?userId=${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();

    // Handle different response formats from backend vs mock
    let user;
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      // Mock format: { data: [user], ... }
      user = data.data[0];
    } else if (data.data && !Array.isArray(data.data)) {
      // Backend format: { data: user } (single user object)
      user = data.data;
    } else if (data.user) {
      // Backend format: { user: {...} }
      user = data.user;
    } else if (data.id || data.firstName || data.$id) {
      // Direct user object
      user = data;
    } else {
      return null;
    }

    return {
      id: user.$id || user.id,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.fullName || 'Unknown User',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status === 'active' ? 'Active' : 'Suspended',
      dependants: user.dependants || 0,
      hmoId: user.userId || user.hmoId || '',
      plan: user.plan || 'N/A',
      homeAddress: user.homeAddress || '',
      dob: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other',
      coverStartDate: user.coverStartDate || '',
      coverEndDate: user.coverEndDate || '',
      paymentFrequency: user.paymentFrequency || 'Monthly',
      autoBillingEnabled: user.autoBillingEnabled || false,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export default async function UserViewPage({ searchParams }: UserViewPageProps) {
  const { userId } = await searchParams;
  const user = userId ? await getUser(userId) : null;

  if (!user) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">User not found.</p>
          <Link
            href="/dashboard/superadmin/users"
            className="mt-6 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to users
          </Link>
        </div>
      </div>
    );
  }

  const profileRows = [
    { label: 'Number of dependants', value: `${user.dependants}` },
    { label: 'HMO ID', value: user.hmoId },
    { label: 'Email', value: user.email },
    { label: 'Phone number', value: user.phone },
    { label: 'Plan', value: user.plan },
    { label: 'Home address', value: user.homeAddress },
    { label: 'Date of birth', value: user.dob },
    { label: 'Gender', value: user.gender },
    { label: 'Status', value: user.status },
    { label: 'Cover start date', value: user.coverStartDate },
    { label: 'Cover end date', value: user.coverEndDate },
    { label: 'Payment frequency', value: user.paymentFrequency },
    { label: 'Auto billing enabled', value: user.autoBillingEnabled ? 'Yes' : 'No' },
  ];

  return (
    <div className="p-4 mb-8 w-full lg:max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user.fullName}</h1>
            <p className="mt-1 text-sm text-slate-600">Member profile details for the selected user.</p>
          </div>
          <Link
            href="/dashboard/superadmin/users"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to users
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {profileRows.map((row) => (
            <div key={row.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{row.label}</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}