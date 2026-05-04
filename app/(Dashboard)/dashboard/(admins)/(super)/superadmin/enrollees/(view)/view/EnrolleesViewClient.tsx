'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { mockEnrollees, type Enrollee } from '../../mockEnrollees';
import { mockEnrolleeFeedData, type EnrolleeFeed } from '../../mockFeeds';
import { color } from 'motion/react';
import { FaX } from 'react-icons/fa6';

const FEED_TYPES = ['All', 'Reimbursement', 'Claim', 'Enrollment', 'General'] as const;

async function getEnrollee(enrolleeId: string): Promise<Enrollee | null> {
  if (!enrolleeId) {
    return null;
  }

  try {
    const res = await fetch(`/api/admin/enrollees?enrolleeId=${encodeURIComponent(enrolleeId)}`, { cache: 'no-store' });
    if (!res.ok) return null;

    const data = await res.json();

    let enrollee: any = null;

    // Handle the admin/enrollees response format
    if (data?.data) {
      enrollee = data.data;
    } else if (data) {
      enrollee = data;
    }

    return enrollee;
  } catch (error) {
    console.error('Failed to fetch enrollee:', error);
    return null;
  }
}

export default function EnrolleesViewClient() {
  const searchParams = useSearchParams();
  const enrolleeId = searchParams.get('id');
  const [enrollee, setEnrollee] = useState<Enrollee | null>(null);
  const [feedFilter, setFeedFilter] = useState<string>('All');
  const [showCreateFeed, setShowCreateFeed] = useState(false);
  const [feedText, setFeedText] = useState('');
  const [feedType, setFeedType] = useState<'reimbursement' | 'claim' | 'enrollment' | 'general'>('general');
  const [feedHistory, setFeedHistory] = useState<EnrolleeFeed[]>([]);
  const [activePopup, setActivePopup] = useState<
    | 'editProfile'
    | 'addDependent'
    | 'changePlan'
    | 'viewReimbursement'
    | 'viewBenefits'
    | 'createPaCode'
    | 'deactivateProfile'
    | 'viewDependants'
    | 'activateProfile'
    | null
  >(null);
  const [dependantsForm, setDependantsForm] = useState([
    {
      title: 'Dependant 1',
      name: '',
      dob: '',
      email: '',
      gender: '',
      phone: '',
      nationality: '',
      relationship: '',
    },
  ]);
  const [paCode, setPaCode] = useState('');
  const [paNote, setPaNote] = useState('');
  const [planOptions] = useState(["Premium Health Plan", "Family Health Plan", "Basic Health Plan", "Silver Health Plan"]);
  const [selectedPlan, setSelectedPlan] = useState('Premium Health Plan');
  const [editProfileDraft, setEditProfileDraft] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    status: 'active',
    plan: '',
    enrollmentDate: '',
    expiryDate: '',
    frequency: 'Yearly',
    autoBilling: 'No',
    dependants: 0,
    benefitBalance: '',
    hmoId: '',
  });

  useEffect(() => {
    if (!enrolleeId) {
      setEnrollee(null);
      return;
    }

    const loadEnrollee = async () => {
      const data = await getEnrollee(enrolleeId);
      if (data) {
        setEnrollee(data);
        setFeedHistory(mockEnrolleeFeedData[enrolleeId] || []);
      }
    };

    loadEnrollee();
  }, [enrolleeId]);

  useEffect(() => {
    if (!enrollee) return;
    setSelectedPlan(enrollee.plan || planOptions[0]);
    setEditProfileDraft({
      name: enrollee.name || '',
      email: enrollee.email || '',
      phone: enrollee.phone || '',
      address: enrollee.address || '',
      dob: enrollee.dob || '',
      gender: enrollee.gender || '',
      status: enrollee.status || 'active',
      plan: enrollee.plan || '',
      enrollmentDate: enrollee.enrollmentDate || '',
      expiryDate: enrollee.expiryDate || '',
      frequency: enrollee.frequency || 'Yearly',
      autoBilling: enrollee.autoBilling || 'No',
      dependants: enrollee.dependants ?? 0,
      benefitBalance: enrollee.benefitBalance || '',
      hmoId: enrollee.hmoId || '',
    });
  }, [enrollee, planOptions]);

  const actionButtons = [
    { label: 'Edit Profile', type: 'editProfile' as const },
    { label: 'Add Dependent', type: 'addDependent' as const },
    { label: 'Change Plan', type: 'changePlan' as const },
    { label: 'View Reimbursement', type: 'viewReimbursement' as const },
    { label: 'View Benefits', type: 'viewBenefits' as const },
    { label: 'Create PA Code', type: 'createPaCode' as const },
    { label: 'Deactivate Profile', type: 'deactivateProfile' as const },
    { label: 'View Dependants', type: 'viewDependants' as const },
    { label: 'Activate Profile', type: 'activateProfile' as const },
  ];

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  const handleSaveProfile = () => {
    if (!enrollee) return;
    setEnrollee((current) => ({
      ...current!,
      ...editProfileDraft,
    }));
    toast.success('Profile updated successfully.');
    handleClosePopup();
  };

  const handleAddDependent = () => {
    const invalid = dependantsForm.some((item) => !item.name || !item.dob || !item.relationship);
    if (invalid) {
      toast.error('Please complete the required dependant fields.');
      return;
    }
    setEnrollee((current) => {
      if (!current) return current;
      return {
        ...current,
        dependants: (current.dependants ?? 0) + dependantsForm.length,
      };
    });
    toast.success(`Added ${dependantsForm.length} dependant(s).`);
    setDependantsForm([
      {
        title: 'Dependant 1',
        name: '',
        dob: '',
        email: '',
        gender: '',
        phone: '',
        nationality: '',
        relationship: '',
      },
    ]);
    handleClosePopup();
  };

  const handleAddDependantField = () => {
    setDependantsForm((current) => [
      ...current,
      {
        title: `Dependant ${current.length + 1}`,
        name: '',
        dob: '',
        email: '',
        gender: '',
        phone: '',
        nationality: '',
        relationship: '',
      },
    ]);
  };

  const handleChangePlan = () => {
    if (!enrollee) return;
    setEnrollee((current) => ({
      ...current!,
      plan: selectedPlan,
    }));
    toast.success('Plan changed successfully.');
    handleClosePopup();
  };

  const handleCreatePaCode = () => {
    if (!paCode.trim()) {
      toast.error('Enter a PA code before creating.');
      return;
    }
    toast.success(`PA code ${paCode} created successfully.`);
    setPaCode('');
    setPaNote('');
    handleClosePopup();
  };

  const handleDeactivateProfile = () => {
    setEnrollee((current) => ({
      ...current!,
      status: 'inactive',
    }));
    toast.success('Profile deactivated.');
    handleClosePopup();
  };

  const handleActivateProfile = () => {
    setEnrollee((current) => ({
      ...current!,
      status: 'active',
    }));
    toast.success('Profile activated.');
    handleClosePopup();
  };

  const formatPlanTitle = (title: string) => title;

  const currentPlanLabel = enrollee?.plan || 'No plan selected';
  const currentPlanActiveSince = enrollee?.enrollmentDate || '—';

  const filteredFeeds = useMemo(() => {
    if (feedFilter === 'All') return feedHistory;
    return feedHistory.filter((f) => f.type === feedFilter.toLowerCase());
  }, [feedHistory, feedFilter]);

  const initials = enrollee
    ? enrollee.name
        .split(' ')
        .map((n) => n[0])
        .join('')
    : '';

  const statusColors: Record<string, string> = {
    'active': 'bg-[#D1FAE5] text-[#10B981]',
    'inactive': 'bg-[#FEE2E2] text-[#EF4444]'
  };

  const handleAddFeed = () => {
    if (!feedText.trim()) {
      toast.error('Please enter a feed description.');
      return;
    }

    const newFeed: EnrolleeFeed = {
      id: `feed-${Date.now()}`,
      type: feedType,
      description: feedText.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setFeedHistory((current) => [newFeed, ...current]);
    setFeedText('');
    setFeedType('general');
    setShowCreateFeed(false);
    toast.success('Feed added successfully.');
  };

  if (!enrollee) {
    return (
      <div className="p-6 rounded-3xl bg-white shadow-sm">
        <div className="text-center py-10">
          <p className="text-slate-500">Enrollee not found.</p>
          <Link
            href="/dashboard/superadmin/enrollees"
            className="inline-flex items-center gap-2 mt-4 text-[#49A5EF] hover:text-[#3d8ed8]"
          >
            <FaArrowLeft />
            Back to Enrollees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <Link
          href="/dashboard/superadmin/enrollees"
          className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          <FaArrowLeft />
          Back to Enrollees
        </Link>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Column: Enrollee Data */}
        <div className="space-y-4 rounded-[10px] bg-white p-6 shadow-sm">
          <div className='flex justify-center items-center flex-col space-y-2 h-fit'>
          <div className='h-20 w-20 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
            {initials}
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">{enrollee.name}</h1>
          <div className='flex items-center space-x-2 text-sm'>
            <p className="bg-[#49A5EF] text-[#ffffff] py-1 px-4 rounded-[5px]">Family Plan</p>
            <p className={`px-4 py-1 rounded-[5px] ${statusColors[enrollee.status] || ''}`}>
              {enrollee.status}
            </p>
          </div>
        </div>
          <div className="flex flex-col space-y-2]">
            <DetailCard label="Number of Dependants" value={enrollee.dependants?.toString() || '0'} />
            <DetailCard label="HMO ID" value={enrollee.hmoId || '—'} />
            <DetailCard label="Email" value={enrollee.email || '—'} />
            <DetailCard label="Phone" value={enrollee.phone || '—'} />
            <DetailCard label="Home Address" value={enrollee.address || '—'} />
            <DetailCard label="Date of Birth" value={enrollee.dob || '—'} />
            <DetailCard label="Gender" value={enrollee.gender || '—'} />
            <DetailCard label="Status" value={enrollee.status || '—'} />
            <DetailCard label="Cover Start Date" value={enrollee.enrollmentDate || '—'} />
            <DetailCard label="Cover End Date" value={enrollee.expiryDate || '—'} />
            <DetailCard label="Payment frequency" value={enrollee.frequency || 'Yearly'} />
            <DetailCard label="Auto-Billing Enabled" value={enrollee.autoBilling || 'No'} />
          </div>

          <div className="">
          <div className="flex flex-col w-full space-y-2">
            {actionButtons.map((button) => (
              <button
                key={button.type}
                type="button"
                onClick={() => setActivePopup(button.type)}
                className={`px-3 py-3 text-center text-[17px] uppercase font-medium text-[#ffffff] ${button.type === 'deactivateProfile' ? 'bg-[#EF4444] hover:bg-[#FECACA]' : button.type === 'activateProfile' ? 'bg-[#10B981] hover:bg-[#D9D9D9]' : 'bg-[#49A5EF]'} rounded-[10px] focus:outline-none`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
        </div>

        {/* Right Column: Recent Feed */}
        <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Feed</h2>
            <button
              type="button"
              onClick={() => setShowCreateFeed(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#49A5EF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3d8ed8]"
            >
              <FaPlus size={12} />
              Add Feed
            </button>
          </div>

          {/* Filter */}
          <select
            value={feedFilter}
            onChange={(e) => setFeedFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          >
            {FEED_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Feed List */}
          {/* <div className="max-h-96 space-y-3 overflow-y-auto">
            {filteredFeeds.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No feeds found.</p>
            ) : (
              filteredFeeds.map((feed) => (
                <div key={feed.id} className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#2563EB] capitalize">
                          {feed.type}
                        </span>
                        <span className="text-xs text-slate-500">{feed.createdAt}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{feed.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs text-slate-700 hover:bg-white"
                  >
                    Open Feed
                  </button>
                </div>
              ))
            )}
          </div> */}
        </div>
      </div>

      {/* Create Feed Modal */}
      {showCreateFeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Add Feed</h2>
            <p className="mt-1 text-sm text-slate-600">Create a new feed entry for this enrollee.</p>

            <div className="mt-6 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Feed Type</span>
                <select
                  value={feedType}
                  onChange={(e) => setFeedType(e.target.value as any)}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="general">General</option>
                  <option value="reimbursement">Reimbursement</option>
                  <option value="claim">Claim</option>
                  <option value="enrollment">Enrollment</option>
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
                className="flex-1 rounded-2xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]"
              >
                Create Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'editProfile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-3xl h-full rounded-[15px] bg-white p-6 shadow-xl overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Edit Profile</h2>
                <p className="text-sm text-slate-600">Update enrollee details using the enrollee form layout.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  value={editProfileDraft.name}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={editProfileDraft.email}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input
                  value={editProfileDraft.phone}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">HMO ID</span>
                <input
                  value={editProfileDraft.hmoId}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, hmoId: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Address</span>
                <input
                  value={editProfileDraft.address}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Date of Birth</span>
                <input
                  type="date"
                  value={editProfileDraft.dob}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, dob: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Gender</span>
                <select
                  value={editProfileDraft.gender}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <select
                  value={editProfileDraft.status}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Plan</span>
                <select
                  value={editProfileDraft.plan}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, plan: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  {planOptions.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Enrollment Date</span>
                <input
                  type="date"
                  value={editProfileDraft.enrollmentDate}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, enrollmentDate: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Expiry Date</span>
                <input
                  type="date"
                  value={editProfileDraft.expiryDate}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Payment Frequency</span>
                <select
                  value={editProfileDraft.frequency}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, frequency: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Auto-Billing</span>
                <select
                  value={editProfileDraft.autoBilling}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, autoBilling: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Dependants</span>
                <input
                  type="number"
                  min={0}
                  value={editProfileDraft.dependants}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, dependants: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Benefit Balance</span>
                <input
                  value={editProfileDraft.benefitBalance}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, benefitBalance: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClosePopup}
                className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'addDependent' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full h-full max-w-3xl rounded-[15px] bg-white p-6 shadow-xl overflow-y-auto custom-scrollbar`">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Add Dependant</h2>
                <p className="text-sm text-slate-600">Add dependant details for this enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 space-y-6">
              {dependantsForm.map((item, index) => (
                <div key={item.title} className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">{item.title}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Name</span>
                      <input value={item.name} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, name: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Date of Birth</span>
                      <input type="date" value={item.dob} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, dob: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <input type="email" value={item.email} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, email: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Gender</span>
                      <select value={item.gender} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, gender: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Phone</span>
                      <input value={item.phone} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, phone: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Nationality</span>
                      <input value={item.nationality} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, nationality: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Relationship</span>
                      <input value={item.relationship} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, relationship: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={handleAddDependantField} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Add another dependant
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="button" onClick={handleAddDependent} className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]">
                  Save Dependant(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'changePlan' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full h-full max-w-3xl rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Change Plan</h2>
                <p className="text-sm text-slate-600">Review the current plan and select a new plan.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
                <p className="text-sm text-slate-500">Current Plan</p>
                <h3 className="text-xl font-semibold text-slate-900 mt-2">{currentPlanLabel}</h3>
                <p className="mt-4 text-sm text-slate-600">Active since</p>
                <p className="mt-1 text-base font-medium text-slate-900">{currentPlanActiveSince}</p>
              </div>
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Choose new plan</span>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={handleChangePlan} className="mt-6 w-full rounded-2xl bg-[#49A5EF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3d8ed8]">
                  Change Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'viewReimbursement' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">View Reimbursement</h2>
                <p className="text-sm text-slate-600">See reimbursement details linked to this enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Latest reimbursement</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">$1,250</p>
                <p className="mt-1 text-sm text-slate-600">Approved on 2025-03-18</p>
              </div>
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Pending reimbursement</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">$425</p>
                <p className="mt-1 text-sm text-slate-600">Submitted on 2025-04-01</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'viewBenefits' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">View Benefits</h2>
                <p className="text-sm text-slate-600">Review benefits available to this enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Annual Benefit Limit</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">$10,000</p>
              </div>
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Remaining Balance</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{enrollee.benefitBalance || '$0.00'}</p>
              </div>
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:col-span-2">
                <p className="text-sm text-slate-500">Coverage highlights</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>- Inpatient care</li>
                  <li>- Outpatient care</li>
                  <li>- Maternity support</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'createPaCode' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Create PA Code</h2>
                <p className="text-sm text-slate-600">Generate a prior authorization code for the enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">PA Code</span>
                <input value={paCode} onChange={(e) => setPaCode(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Notes</span>
                <textarea value={paNote} onChange={(e) => setPaNote(e.target.value)} rows={4} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none" />
              </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleCreatePaCode} className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]">
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'deactivateProfile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Deactivate Profile</h2>
                <p className="text-sm text-slate-600">This will deactivate the enrollee's profile.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 text-slate-700">
              <p>Are you sure you want to deactivate <span className="font-semibold">{enrollee.name}</span>?</p>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleDeactivateProfile} className="rounded-2xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'viewDependants' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">View Dependants</h2>
                <p className="text-sm text-slate-600">Review dependant information for this enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Number of dependants</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{enrollee.dependants ?? 0}</p>
              </div>
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Dependants list</p>
                <p className="mt-2 text-sm text-slate-700">No detailed dependant records are available in this demo view.</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'activateProfile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Activate Profile</h2>
                <p className="text-sm text-slate-600">Confirm activation status for this enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 text-slate-700">
              <p>Activate <span className="font-semibold">{enrollee.name}</span> as an active enrollee.</p>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleActivateProfile} className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]">
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#D9D9D9] p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 font-medium text-slate-900">{value}</p>
    </div>
  );
}
