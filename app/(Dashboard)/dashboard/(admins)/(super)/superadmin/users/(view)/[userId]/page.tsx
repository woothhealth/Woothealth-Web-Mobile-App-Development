'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ActionButtonsHandler from '../../ActionButtonsHandler';
import { IoIosArrowBack } from 'react-icons/io';

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
  dependant?: string | null;
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
  paymentFrequency?: string | null;
  autoBilling?: boolean | null;
  homeAddress?: string | null;
  $id: string;
  benefits?: string;
  coverStartDate?: string | null;
  coverEndDate?: string | null;
  $sequence: number;
  $createdAt: string;
  $updatedAt: string;
  paymentAmount?: string | null;
  paymentStatus?: string | null;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

async function getUser(userId: string): Promise<User | null> {
  try {
    // Try fetching with userId parameter first
    let response = await fetch(`/api/admin/user?id=${encodeURIComponent(userId)}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle if API returns array - search for matching userId
    if (data.success && Array.isArray(data.data)) {
      const foundUser = data.data.find(
        (user: User) => user.userId === userId || user.$id === userId
      );
      if (foundUser) {
        return foundUser;
      }
      return null;
    }

    // Handle if API returns single user object
    if (data.success && data.data && !Array.isArray(data.data)) {
      return data.data;
    }

    return null;
  } catch (error) {
    return null;
  }
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border px-4 py-1 md:py-2">
      <span className="font-semibold md:w-1/3">{label}</span>
      <span className="w-fit md:text-end text-[15px] md:text-base">{value}</span>
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = ['All', 'System', 'Status'];

  const toggleFilterMenu = () => setIsFilterOpen((prev) => !prev);
  const selectFilter = (option: string) => {
    setSelectedFilter(option);
    setIsFilterOpen(false);
  };

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
    'active': 'bg-[#10B981]',
    'inactive': 'bg-[#EF4444]',
    'suspended': 'bg-[#F59E0B]',
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const formatWord = (word: string) => {
    return word
      .split(/(?=[A-Z])|[_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  const filteredActivities = [
    {
      type: 'System',
      title: 'Reimbursement',
      date: user.$createdAt,
      description: 'Manual reimbursement submission reminder for this enrollee Profile',
    },
    {
      type: 'Status',
      title: 'Account Update',
      date: user.$updatedAt,
      description: `Status changed to ${user.status} for this enrollee Profile`,
    },
  ].filter(activity => selectedFilter === 'All' || activity.type === selectedFilter);

  const paymentHistory = [
    {
      coverStartDate: user.coverStartDate,
      coverEndDate: user.coverEndDate,
      plan: user.plan,
    },
    {
      coverStartDate: user.coverStartDate,
      coverEndDate: user.coverEndDate,
      plan: user.plan,
    }
  ];


  return (
    <section className="space-y-4 md:space-y-6 px-2 md:p-6">
      <Link
        href="/dashboard/superadmin/users"
        className="inline-flex items-center gap-2 rounded-full border border-border p-3 hover:bg-slate-50"
      >
        <IoIosArrowBack size={20} />
      </Link>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] space-y-4 lg:space-y-0 space-x-0 lg:space-x-4">
        {/* Left Column: User Data */}
        <div className="space-y-4 rounded-[10px] bg-white md:px-6 px-2 py-6 shadow-md">
          <div className='flex justify-center items-center flex-col space-y-2 h-fit'>
            <div className='h-24 w-24 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
              {initials}
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">{user.firstName} {user.lastName}</h1>
            <div className='flex items-center space-x-2 text-bese capitalize text-[#ffffff]'>
              <p className="bg-[#49A5EF] py-1 px-4 rounded-[5px]">{user.plan || "No Plan found"}</p>
              <p className={`px-4 py-1 rounded-[5px] ${statusColors[user.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                {user.status || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <DetailCard label="Number of Dependants" value={user.dependant || 'N/A'} />
            <DetailCard label="HMO ID" value={user.userId || 'N/A'} />
            <DetailCard label="Email" value={user.email || 'N/A'} />
            <DetailCard label="Phone Number" value={user.phone || 'N/A'} />
            <DetailCard label="Plan" value={formatWord(user.plan || 'N/A')} />
            <DetailCard label="Home Address" value={formatWord(user.homeAddress || 'N/A')} />
            <DetailCard label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'} />
            <DetailCard label="Gender" value={formatWord(user.gender || 'N/A')} />
            <DetailCard label="Status" value={user.status || 'N/A'} />
            <DetailCard label="Cover Start Date" value={user.coverStartDate ? new Date(user.coverStartDate).toLocaleDateString() : 'N/A'} />
            <DetailCard label="Cover End Date" value={user.coverEndDate ? new Date(user.coverEndDate).toLocaleDateString() : 'N/A'} />
            <DetailCard label="Payment Frequency" value={formatWord(user.paymentFrequency || 'N/A')} />
            <DetailCard label="Auto-Billing Enabled" value={formatWord(user.autoBilling ? 'Yes' : 'No')} />
          </div>

          <div className="">
            <ActionButtonsHandler user={user} onUserUpdate={handleUserUpdate} />
          </div>
        </div>

        {/* Right Column: Recent Activity/Feed */}
        <div className='space-y-4 lg:space-y-16'>
          {/* Feed */}
        <div className="space-y-4 rounded-[10px] bg-white p-4 shadow-md h-fit">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-slate-900">Most Recent Feeds</h2>
            <div
              onClick={() => {
                // Handle add activity
                console.log('Add activity clicked');
              }}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#10B981]/90 cursor-pointer"
            >
              Create Feed
            </div>
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

          <div className="flex flex-col space-y-4">
            {filteredActivities.length === 0 && (
              <p className="text-sm text-slate-500">No activities found for the selected filter.</p>
            )}
            {filteredActivities.map((activity, index) => (
              <div key={index} className="rounded-[10px] border border-border p-4">
                <div className="flex flex-col gap-3">
                  <div className="font-semibold border-b border-border">{activity.title}</div>
                  <div className="">
                    <p className="text-sm text-slate-700">{activity.description}</p>
                    <div className='bg-primary text-[#ffffff] mt-3 flex items-center justify-center gap-2 rounded-[5px] py-2 w-full text-xs font-semibold hover:bg-primary/90 cursor-pointer'>
                      Open Feed
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Payment History */}
          <div className="space-y-2 rounded-[10px] bg-white p-4 shadow-md h-fit">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-base font-semibold text-slate-900">Payment History</h2>
              <div
                onClick={() => {
                  // Handle add activity
                  console.log('Add activity clicked');
                }}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 cursor-pointer"
              >
                View All
              </div>
            </div>

                  <div>
                    {paymentHistory.length === 0 ? (
                      <p className="text-sm text-slate-500">No payment history available.</p>
                    ) : (
                      <div className="space-y-2 flex flex-col">
                        {paymentHistory.map((payment, index) => (
                          <div key={index} className="flex flex-col border-2 text-sm border-border rounded-[10px]">
                            <div className='flex space-x-2 p-2 border-b border-border'>
                              <p className="">{payment.coverEndDate || 'N/A'}</p>
                              <p className="">- {payment.coverEndDate || 'N/A'}</p>
                            </div>
                            <div className='p-2 space-y-2'>
                              <p className="">{payment.plan || 'N/A'}</p>
                              <div className='bg-primary text-[#ffffff] flex items-center justify-center gap-2 rounded-[5px] text-sm py-1 w-full font-semibold hover:bg-primary/90 cursor-pointer'>
                                Open Invoice
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
        </div>
      </div>
    </section>
  );
}