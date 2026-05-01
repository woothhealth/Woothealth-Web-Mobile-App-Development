import Link from 'next/link';
import { usersMock } from '../mock-users';

interface UserProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params;
  const user = usersMock.find((record) => record.id === userId);

  if (!user) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">User not found.</p>
          <Link
            href=".."
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
            href=".."
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
