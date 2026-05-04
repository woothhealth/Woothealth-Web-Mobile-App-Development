'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface User {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  userId: string;
  role: string;
  specialization: string;
  availability: boolean;
  plan: string | null;
  latitude: string;
  longitude: string;
  profile_pic: string;
  businessId: string | null;
  status: string | null;
  department: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  enrolleeNumber: string | null;
  policyNumber: string | null;
  otherNames: string | null;
  relationship: string | null;
  providerCode: string | null;
  providerName: string | null;
  providerState: string | null;
  preExistingCond: string | null;
  passportUrl: string | null;
  nakasoft_id: string | null;
  source: string | null;
  fcmToken: string | null;
  $id: string;
  $sequence: number;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

async function getUser(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/admin/user?id=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // The API returns data as a single user object when fetching by userId
    if (data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#D9D9D9] px-4 py-3">
      <span className="font-medium">{label}</span>
      <span className="">{value}</span>
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      const userData = await getUser(userId);
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();

  const statusColors: Record<string, string> = {
    'active': 'bg-[#D1FAE5] text-[#10B981]',
    'inactive': 'bg-[#FEE2E2] text-[#EF4444]',
  };

  const actionButtons = [
    { label: 'Edit Profile', type: 'editProfile' },
    { label: 'View Dependants', type: 'viewDependants' },
    { label: 'Change Plan', type: 'changePlan' },
    { label: 'View Benefits', type: 'viewBenefits' },
    { label: 'Create PA Code', type: 'createPaCode' },
    { label: user.status === 'active' ? 'Deactivate Profile' : 'Activate Profile', type: user.status === 'active' ? 'deactivateProfile' : 'activateProfile' },
  ];

  return (
    <section className="space-y-6 p-6">
      <Link
        href="/dashboard/superadmin/users"
        className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
      >
        <FaArrowLeft />
        Back to Users
      </Link>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Column: User Data */}
        <div className="space-y-4 rounded-[10px] bg-white p-6 shadow-sm">
          <div className='flex justify-center items-center flex-col space-y-2 h-fit'>
            <div className='h-20 w-20 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
              {initials}
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">{user.firstName} {user.lastName}</h1>
            <div className='flex items-center space-x-2 text-sm'>
              <p className="bg-[#49A5EF] text-[#ffffff] py-1 px-4 rounded-[5px]">{user.role}</p>
              <p className={`px-4 py-1 rounded-[5px] ${statusColors[user.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                {user.status || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <DetailCard label="User ID" value={user.userId} />
            <DetailCard label="Email" value={user.email} />
            <DetailCard label="Phone" value={user.phone} />
            <DetailCard label="Role" value={user.role} />
            <DetailCard label="Department" value={user.department || '—'} />
            <DetailCard label="Specialization" value={user.specialization || '—'} />
            <DetailCard label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'} />
            <DetailCard label="Gender" value={user.gender || '—'} />
            <DetailCard label="Plan" value={user.plan || '—'} />
            <DetailCard label="Enrollee Number" value={user.enrolleeNumber || '—'} />
            <DetailCard label="Policy Number" value={user.policyNumber || '—'} />
            <DetailCard label="Provider Name" value={user.providerName || '—'} />
            <DetailCard label="Business ID" value={user.businessId || '—'} />
          </div>

          <div className="">
            <div className="flex flex-col w-full space-y-2">
              {actionButtons.map((button) => (
                <button
                  key={button.type}
                  type="button"
                  onClick={() => {
                    // Handle button clicks here
                    console.log(`Clicked: ${button.type}`);
                  }}
                  className={`px-3 py-3 text-center text-[17px] uppercase font-medium text-[#ffffff] ${button.type === 'deactivateProfile' ? 'bg-[#EF4444] hover:bg-[#FECACA]' : button.type === 'activateProfile' ? 'bg-[#10B981] hover:bg-[#D9D9D9]' : 'bg-[#49A5EF]'} rounded-[10px] focus:outline-none`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity/Feed */}
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button
              type="button"
              onClick={() => {
                // Handle add activity
                console.log('Add activity clicked');
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
                      {new Date(user.$createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">User account created</p>
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
                      {new Date(user.$updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">Account status: {user.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
