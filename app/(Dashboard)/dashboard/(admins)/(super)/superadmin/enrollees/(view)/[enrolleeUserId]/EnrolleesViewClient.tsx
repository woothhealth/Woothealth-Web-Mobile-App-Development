'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaUser } from 'react-icons/fa';
import { toast } from 'sonner';
import { type Enrollee } from '../../mockEnrollees';
import { FaX } from 'react-icons/fa6';
import { IoIosArrowBack, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import CreateCodeActionModal from '../../../users/createCodeActionModal';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import { useAdminBenefits } from '@/lib/adminBenefits';
import { useAdminPlans } from '@/lib/adminPlans';
import { updateAdminUser } from '@/lib/adminUser';

type EnrolleeFeed = {
  id: string;
  type: string;
  agentName?: string;
  description: string;
  createdAt: string;
  feedTimestamp?: string;
};

const FEED_TYPES = ['All', 'Reimbursement', 'Claim', 'Enrollment', 'General'] as const;

async function getEnrollee(enrolleeId: string): Promise<Enrollee | null> {
  if (!enrolleeId) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  // Try several common query param names the backend might accept
  const candidates = [
    `/api/admin/enrollees?enrolleeId=${encodeURIComponent(enrolleeId)}`,
    `/api/admin/enrollees?id=${encodeURIComponent(enrolleeId)}`,
    `/api/admin/enrollees?userId=${encodeURIComponent(enrolleeId)}`,
    `/api/admin/enrollees/${encodeURIComponent(enrolleeId)}`,
  ];

  try {
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (!res.ok) continue;
        const data = await res.json().catch(() => null);

        if (!data) continue;

        // If backend returns wrapper { success, data }
        if (data?.data) {
          // data.data can be an object or an array
          if (Array.isArray(data.data)) {
            const found = data.data.find((d: any) => d.userId === enrolleeId || d.$id === enrolleeId || d.id === enrolleeId);
            if (found) return found as Enrollee;
            // if only one element, return it
            if (data.data.length === 1) return data.data[0] as Enrollee;
            continue;
          }
          return data.data as Enrollee;
        }

        // If backend returns array or object directly
        if (Array.isArray(data)) {
          const found = data.find((d: any) => d.userId === enrolleeId || d.$id === enrolleeId || d.id === enrolleeId);
          if (found) return found as Enrollee;
          if (data.length === 1) return data[0] as Enrollee;
          continue;
        }

        if (typeof data === 'object') {
          // Might be the enrollee object itself
          if (data.userId === enrolleeId || data.$id === enrolleeId || data.id === enrolleeId) return data as Enrollee;
          // If object doesn't match, still return it as best-effort
          return data as Enrollee;
        }
      } catch (innerErr) {
        // continue trying other endpoints
        if ((innerErr as any).name === 'AbortError') throw innerErr;
        // ignore other errors and try next
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch enrollee:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default function EnrolleesViewClient() {
  const searchParams = useSearchParams();
  const enrolleeId = searchParams.get('id');
  const [enrollee, setEnrollee] = useState<Enrollee | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedFilter, setFeedFilter] = useState<string>('All');
  const [showCreateFeed, setShowCreateFeed] = useState(false);
  const [feedText, setFeedText] = useState('');
  const [agentName, setAgentName] = useState('');
  const [feedTimestamp, setFeedTimestamp] = useState('');
  const [feedType, setFeedType] = useState<'pa-code' | 'plan-purchase' | 'benefits' | 'declined-care' | 'general'>('general');
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
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      gender: '',
      phone: '',
      nationality: '',
      relationship: '',
    },
  ]);
  const [reimbursements, setReimbursements] = useState<any[]>([]);
  const [reimburseLoading, setReimburseLoading] = useState(false);
  const plansQuery = useAdminPlans();
  const [planOptions, setPlanOptions] = useState<string[]>(['Premium Care Plan', 'Standard Care Plan', 'Basic Care Plan', 'Family Care Plan']);

  useEffect(() => {
    const payload = (plansQuery.data && (plansQuery.data.data ?? plansQuery.data)) || null;
    if (!payload) return;
    let names: string[] = [];
    if (Array.isArray(payload)) {
      names = payload.map((p: any) => p.name).filter(Boolean);
    } else if (payload?.name) {
      names = [payload.name];
    }
    if (names.length > 0) setPlanOptions(names);
  }, [plansQuery.data]);

  const { data: benefitsRes } = useAdminBenefits();
  const [selectedPlan, setSelectedPlan] = useState('Premium Health Plan');
  const isActive = enrollee?.status?.toLowerCase() === 'active';
  const [editProfileDraft, setEditProfileDraft] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    status: 'active',
    plan: '',
    enrollmentDate: '',
    expiryDate: '',
    profile_pic: null,
    frequency: 'Yearly',
    autoBilling: 'No',
    dependants: 0,
    benefitBalance: '',
    userId: '',
  });

  useEffect(() => {
    if (!enrolleeId) {
      setEnrollee(null);
      setLoading(false);
      return;
    }

    const loadEnrollee = async () => {
      setLoading(true);
      const data = await getEnrollee(enrolleeId);
      if (data) {
        setEnrollee(data);
        void fetchFeedsForEnrollee(data.userId || data.$id || enrolleeId);
      } else {
        setEnrollee(null);
      }
      setLoading(false);
    };

    void loadEnrollee();
  }, [enrolleeId]);

  // Fetch feeds for enrollee from /api/admin/feedback
  async function fetchFeedsForEnrollee(id?: string | null) {
    if (!id) {
      setFeedHistory([]);
      return;
    }
    try {
      const route = `/api/admin/feedback?search=${encodeURIComponent(id)}`;
      const res = await fetch(route, { credentials: 'include' });
      if (!res.ok) {
        setFeedHistory([]);
        return;
      }
      const data = await res.json().catch(() => null);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const normalized = (list as any[]).map((f) => normalizeFeed(f));
      setFeedHistory(normalized);
    } catch (err) {
      console.error('Failed to fetch feeds for enrollee', id, err);
      setFeedHistory([]);
    }
  }

  function normalizeFeed(f: any): EnrolleeFeed {
    return {
      id: f.id || f.$id || f._id || `feed-${Date.now()}`,
      type: (f.type || f.feedType || f.category || 'general').toString().toLowerCase(),
      agentName: f.agentName || f.agent || f.createdBy || 'Admin User',
      description: f.description || f.note || f.message || '',
      feedTimestamp: f.feedTimestamp || f.createdAt || f.timestamp || new Date().toISOString().split('T')[0],
      createdAt: f.createdAt || f.feedTimestamp || new Date().toISOString(),
    };
  }

  useEffect(() => {
    if (!enrollee) return;
    setSelectedPlan(enrollee.plan || planOptions[0]);
    setEditProfileDraft({
      firstName: enrollee.firstName || '',
      lastName: enrollee.lastName || '',
      email: enrollee.email || '',
      phone: enrollee.phone || '',
      profile_pic: enrollee.profile_pic || null,
      address: enrollee.address || '',
      dateOfBirth: enrollee.dateOfBirth || '',
      gender: enrollee.gender || '',
      status: enrollee.status || 'active',
      plan: enrollee.plan || '',
      enrollmentDate: enrollee.$createdAt || '',
      expiryDate: enrollee.expiryDate || '',
      frequency: enrollee.frequency || 'Yearly',
      autoBilling: enrollee.autoBilling || 'No',
      dependants: enrollee.dependants ?? 0,
      benefitBalance: enrollee.benefitBalance || '',
      userId: enrollee.userId || '',
    });
  }, [enrollee, planOptions]);

  const actionButtons = [
    { label: 'Edit Profile', type: 'editProfile' as const },
    { label: 'Add Dependent', type: 'addDependent' as const },
    { label: 'Change Plan', type: 'changePlan' as const },
    { label: 'View Reimbursement', type: 'viewReimbursement' as const },
    { label: 'View Benefits', type: 'viewBenefits' as const },
    { label: 'Create PA Code', type: 'createPaCode' as const },
    { label: 'View Dependants', type: 'viewDependants' as const },
    {
      label: isActive ? 'Deactivate Profile' : 'Activate Profile',
      type: isActive ? 'deactivateProfile' : 'activateProfile',
    },
  ];

  // Visibility rules (mirror users ActionButtonsHandler)
  const adminUser = useAdminDashboardUser();
  const isActionVisible = (type: string) => {
    const plan = (enrollee?.plan || '').toString().trim();
    if (!plan) return false; // hide all if no plan
    const planLower = plan.toLowerCase();
    const adminRole = String(adminUser?.role || '').toLowerCase();

    // support both 'addDependent' and 'addDependants' naming
    if (type === 'addDependent' || type === 'addDependants' || type === 'viewDependants') {
      return planLower.includes('family');
    }

    if (type === 'verifyEnrollee') {
      return adminRole === 'business';
    }

    return true;
  };

  const visibleActionButtons = actionButtons.filter((b) => isActionVisible(b.type as string));

  const name = enrollee ? `${enrollee.firstName || ''} ${enrollee.lastName || ''}`.trim() : '';

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  const handleSaveProfile = () => {
    if (!enrollee) return;
    const performSave = async () => {
      try {
        setLoading(true);
        // Build minimal payload: include id and only changed, non-empty fields
        const id = enrollee.id || enrollee.$id || enrollee.userId || undefined;
        const userIdVal = enrollee.userId || enrollee.$id || enrollee.id || undefined;

        const draft = { ...editProfileDraft } as Record<string, any>;
        const original: Record<string, any> = { ...enrollee } as any;

        const mapOriginal = (key: string) => {
          if (key === 'enrollmentDate') return original.enrollmentDate || original.$createdAt || original.createdAt || original.$createdAt;
          if (key === 'userId') return original.userId || original.$id || original.id || original.userId;
          return original[key];
        };

        const payload: Record<string, any> = {};
        if (id) payload.id = id;
        if (userIdVal) payload.userId = userIdVal;

        Object.keys(draft).forEach((k) => {
          const v = draft[k];
          // strip empty strings
          if (typeof v === 'string' && v.trim() === '') return;
          if (v === null || v === undefined) return;

          const orig = mapOriginal(k);
          // Normalize for comparison
          const a = typeof v === 'string' ? v.trim() : v;
          const b = typeof orig === 'string' ? String(orig).trim() : orig;

          // Normalize gender to backend-expected values
          const normalizeGender = (g: any) => {
            if (g === null || g === undefined) return g;
            const s = String(g).toLowerCase().trim();
            if (s === 'male' || s === 'm') return 'male';
            if (s === 'female' || s === 'f') return 'female';
            if (s === 'non-binary' || s === 'nonbinary' || s === 'non binary' || s === 'nb') return 'non-binary';
            if (s === 'other' || s === 'others') return 'others';
            return s;
          };

          // For numeric comparisons
          if (typeof a === 'number' || typeof b === 'number') {
            if (Number(a) === Number(b)) return;
            payload[k] = a;
            return;
          }

          // Map date-of-birth to backend field if changed
          if (k === 'dateOfBirth') {
            if (!a || a === b) return;
            payload['dateOfBirth'] = a;
            return;
          }

          if (k === 'gender') {
            const norm = normalizeGender(a);
            if (!norm || norm === b) return;
            payload[k] = norm;
            return;
          }

          if (a === b) return;
          payload[k] = a;
        });

        // If no changes besides IDs, skip network call
        const changedKeys = Object.keys(payload).filter((x) => x !== 'id' && x !== 'userId');
        if (changedKeys.length === 0) {
          toast('No changes detected');
          handleClosePopup();
          return;
        }

        const method = payload.id ? 'PUT' : 'POST';

        try {
          const response = await fetch('/api/admin/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
          });

          if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error('PUT /api/admin/user failed', response.status, text);
            let parsed: any = {};
            try { parsed = JSON.parse(text); } catch {}
            throw new Error(parsed?.message || parsed?.error || `Failed to update profile (${response.status})`);
          }

          let parsed: any = {};
          try { parsed = await response.json(); } catch { parsed = {}; }
          const updatedUser = { ...enrollee, ...editProfileDraft } as any;
          // prefer backend returned data if available
          const resolved = parsed?.data ?? parsed ?? updatedUser;
          setEnrollee((current) => ({ ...current!, ...(resolved || updatedUser) }));
        } catch (e: any) {
          throw e;
        }
        toast.success('Profile updated successfully.');
        handleClosePopup();
      } catch (e: any) {
        console.error('Failed to save enrollee via admin user POST', e);
        toast.error(e?.message || 'Failed to save profile');
      } finally {
        setLoading(false);
      }
    };

    void performSave();
  };

  const handleAddDependent = () => {
    const invalid = dependantsForm.some((item) => !item.firstName || !item.lastName || !item.dateOfBirth || !item.relationship);
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
        firstName: '',
        lastName: '',
        dateOfBirth: '',
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
        firstName: '',
        lastName: '',
        dateOfBirth: '',
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

  // PA code creation routed to shared modal (CreateCodeActionModal)
  const handleCreatePaCode = () => {
    // noop: modal handles creation
  };

  const handleDeactivateProfile = async () => {
    if (!enrollee) return;
    try {
      setLoading(true);
      const id = enrollee.id || enrollee.$id || enrollee.userId;
      const payload = { id, status: 'inactive' } as Record<string, any>;

      try {
        const updated = await updateAdminUser(payload);
        const resolved = (updated || { status: 'inactive' });
        setEnrollee((current) => ({ ...current!, ...resolved }));
      } catch (e: any) {
        throw e;
      }
      toast.success('Profile deactivated.');
      handleClosePopup();
    } catch (e: any) {
      toast.error(e?.message || 'Error deactivating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateProfile = async () => {
    if (!enrollee) return;
    try {
      setLoading(true);
      const id = enrollee.id || enrollee.$id || enrollee.userId;
      const payload = { id, status: 'active' } as Record<string, any>;

      try {
        const updated = await updateAdminUser(payload);
        const resolved = (updated || { status: 'active' });
        setEnrollee((current) => ({ ...current!, ...resolved }));
      } catch (e: any) {
        throw e;
      }
      toast.success('Profile activated.');
      handleClosePopup();
    } catch (e: any) {
      toast.error(e?.message || 'Error activating profile');
    } finally {
      setLoading(false);
    }
  };

  const currentPlanLabel = enrollee?.plan || 'No plan selected';
  const currentPlanActiveSince = enrollee?.enrollmentDate || '—';

  const filteredFeeds = useMemo(() => {
    if (feedFilter === 'All') return feedHistory;
    return feedHistory.filter((f) => f.type === feedFilter.toLowerCase());
  }, [feedHistory, feedFilter]);

  const initials = enrollee
    ? `${enrollee.firstName || ''} ${enrollee.lastName || ''}`.trim().split(' ').map((n) => n[0]).join('') : '';

  const statusColors: Record<string, string> = {
    'active': 'bg-[#D1FAE5] text-[#10B981]',
    'inactive': 'bg-[#FEE2E2] text-[#EF4444]'
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const paymentHistory = [
    {
      coverStartDate: enrollee?.coverStartDate,
      coverEndDate: enrollee?.coverEndDate,
      plan: enrollee?.plan,
    },
    {
      coverStartDate: enrollee?.coverStartDate,
      coverEndDate: enrollee?.coverEndDate,
      plan: enrollee?.plan,
    }
  ];

  const handleAddFeed = async () => {
    if (!feedText.trim()) {
      toast.error('Please enter a feed description.');
      return;
    }

    try {
      const payload = {
        userId: enrollee?.userId || enrollee?.$id || enrollee?.id,
        type: feedType,
        agentName: agentName || 'Admin User',
        description: feedText.trim(),
        feedTimestamp: feedTimestamp || new Date().toISOString(),
      } as Record<string, any>;

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
      const created = parsed?.data ?? parsed ?? null;
      const normalized = normalizeFeed(created || payload);
      setFeedHistory((current) => [normalized, ...current]);
      setFeedText('');
      setFeedType('general');
      setAgentName('');
      setFeedTimestamp('');
      setShowCreateFeed(false);
      toast.success('Feed added successfully.');
    } catch (err: any) {
      console.error('Failed to create feed', err);
      toast.error(err?.message || 'Failed to create feed');
    }
  };

  // Fetch reimbursements when popup opens
  useEffect(() => {
    if (activePopup !== 'viewReimbursement') return;
    (async () => {
      try {
        setReimburseLoading(true);
        const route = `/api/admin/reimbursement?search=${encodeURIComponent(enrollee?.userId || '')}`;
        const res = await fetch(route, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch reimbursements');
        const data = await res.json().catch(() => null);
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setReimbursements(list);
      } catch (err) {
        console.error('Error fetching reimbursements for enrollee', enrollee?.userId, err);
        setReimbursements([]);
      } finally {
        setReimburseLoading(false);
      }
    })();
  }, [activePopup, enrollee?.userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          className="inline-flex items-center gap-2 rounded-full border border-border p-3 text-slate-700 hover:bg-slate-50"
        >
          <IoIosArrowBack size={20} />
        </Link>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-4">
        {/* Left Column: Enrollee Data */}
        <div className="space-y-4 rounded-[10px] bg-white p-6 shadow-sm">
          <div className='flex justify-center items-center flex-col space-y-2 h-fit'>
          <div className='h-20 w-20 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
            {initials}
          </div>
          <h1 className="text-3xl font-semibold text-slate-900">{name}</h1>
          <div className='flex items-center space-x-2 text-sm'>
            <p className="bg-[#49A5EF] text-[#ffffff] py-1 px-4 rounded-[5px] uppercase">{enrollee.plan}</p>
            <p className={`px-4 py-1 rounded-[5px] ${statusColors[enrollee.status] || ''}`}>
              {enrollee.status}
            </p>
          </div>
        </div>
          <div className="flex flex-col space-y-2]">
            <DetailCard label="Number of Dependants" value={enrollee.dependants?.toString() || '0'} />
            <DetailCard label="HMO ID" value={enrollee.userId || 'N/A'} />
            <DetailCard label="Email" value={enrollee.email || 'N/A'} />
            <DetailCard label="Phone" value={enrollee.phone || 'N/A'} />
            <DetailCard label="Home Address" value={enrollee.address || 'N/A'} />
            <DetailCard label="Date of Birth" value={formatDate(enrollee.dateOfBirth) || 'N/A'} />
            <DetailCard label="Gender" value={enrollee.gender || 'N/A'} />
            <DetailCard label="Status" value={enrollee.status || 'N/A'} />
            <DetailCard label="Cover Start Date" value={enrollee.enrollmentDate || 'N/A'} />
            <DetailCard label="Cover End Date" value={enrollee.expiryDate || 'N/A'} />
            <DetailCard label="Payment frequency" value={enrollee.frequency || 'Yearly'} />
            <DetailCard label="Auto-Billing Enabled" value={enrollee.autoBilling || 'No'} />
          </div>

          <div className="">
          <div className="flex flex-col w-full space-y-2">
            {visibleActionButtons.map((button) => (
              <button
                key={button.type}
                type="button"
                onClick={() => setActivePopup(button.type as any)}
                className={`px-3 py-2 text-center text-[17px] uppercase font-medium text-[#ffffff] ${button.type === 'deactivateProfile' ? 'bg-[#EF4444] hover:bg-[#FECACA]' : button.type === 'activateProfile' ? 'bg-[#10B981] hover:bg-[#D9D9D9]' : 'bg-[#49A5EF]'} rounded-[10px] focus:outline-none`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
        </div>

        <div className='space-y-4 lg:space-y-16'>
        {/* Right Column: Recent Feed */}
        <div className="space-y-4 rounded-[10px] bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Feed</h2>
            <button
              type="button"
              onClick={() => setShowCreateFeed(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#10B981]/90"
            >
              <FaPlus size={12} />
              Add Feed
            </button>
          </div>

          {/* Filter */}
          <div>
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
            <p className="text-sm text-slate-500 mt-2">Showing {filteredFeeds.length} feed(s)</p>
            <div className="mt-3 space-y-3">
              {filteredFeeds.length === 0 ? (
                <p className="text-sm text-slate-500">No feeds available for this enrollee.</p>
              ) : (
                filteredFeeds.map((f) => (
                  <div key={f.id} className="rounded-lg border border-[#E5E7EB] p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">{f.type}</div>
                      <div className="text-xs text-slate-500">{formatDate(f.feedTimestamp || f.createdAt)}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-700">{f.description}</div>
                    <div className="mt-2 text-xs text-slate-500 uppercase">{f.agentName}</div>
                  </div>
                ))
              )}
            </div>
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

      {/* Create Feed Modal */}
      {showCreateFeed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Add Feed</h2>
              <FaX onClick={() => setShowCreateFeed(false)} className="cursor-pointer" size={22}/>
            </div>

            <div className="">
              <div className="flex flex-col items-center space-y-1 mt-4">
                {initials && (
                  <div className='h-16 w-16 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-xl border-2 border-[#D9D9D9]'>
                    {initials}
                  </div>
                )}
                <h2 className="text-xl font-semibold uppercase">{name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-[11px] rounded-[5px] bg-[#49A5EF] text-white`}>
                    {currentPlanLabel}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-[5px] ${statusColors[enrollee.status] || ''}`}>
                    {enrollee.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Feed Type</span>
                <select
                  value={feedType}
                  onChange={(e) => setFeedType(e.target.value as any)}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="general">General Inquiry</option>
                  <option value="pa-code">PA Code</option>
                  <option value="plan-purchase">Plan Purchase</option>
                  <option value="general">Benefits</option>
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
          <div className='absolute inset-0 cursor-pointer' onClick={handleClosePopup} />
          <div className="w-full max-w-3xl h-full rounded-[15px] bg-white p-6 shadow-xl overflow-y-auto z-20 custom-scrollbar">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Edit Profile</h2>
                <p className="text-sm text-slate-600">Update enrollee details using the enrollee form layout.</p>
              </div>
              <FaX onClick={handleClosePopup} className="cursor-pointer" size={22}/>
            </div>
              <div className='flex flex-col items-center space-y-1 text-[#959595] mt-4'>
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="client-logo-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {(e : any) => setEditProfileDraft((prev) => ({ ...prev, name: e.target.value }))};
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="client-logo-upload" className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-border bg-slate-50 text-sm hover:bg-slate-100 overflow-hidden">
                  {editProfileDraft.profile_pic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editProfileDraft.profile_pic} alt="client" className="h-full w-full object-cover" />
                  ) : (
                    <FaUser size={24} />
                  )}
                </label>
                <p className="mt-1">Upload Picture</p>
              </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">First Name</span>
                <input
                  value={editProfileDraft.firstName}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Last Name</span>
                <input
                  value={editProfileDraft.lastName}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Email</span>
                <input
                  type="email"
                  value={editProfileDraft.email}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Phone</span>
                <input
                  value={editProfileDraft.phone}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">HMO ID</span>
                <input
                  value={editProfileDraft.userId}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, userId: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Address</span>
                <input
                  value={editProfileDraft.address}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Date of Birth</span>
                <input
                  type="date"
                  value={editProfileDraft.dateOfBirth}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Gender</span>
                <select
                  value={editProfileDraft.gender}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Enrollment Date</span>
                <input
                  type="date"
                  value={editProfileDraft.enrollmentDate}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, enrollmentDate: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Expiry Date</span>
                <input
                  type="date"
                  value={editProfileDraft.expiryDate}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Payment Frequency</span>
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
                <span className="text-[15px] font-semibold">Auto-Billing</span>
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
                <span className="text-[15px] font-semibold">Dependants</span>
                <input
                  type="number"
                  min={0}
                  value={editProfileDraft.dependants}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, dependants: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[15px] font-semibold">Benefit Balance</span>
                <input
                  value={editProfileDraft.benefitBalance}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, benefitBalance: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
            </div>
            <div className="mt-6 flex w-full">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="rounded-[15px] bg-[#49A5EF] px-5 py-2 text-[15px] font-semibold w-full text-white hover:bg-[#3d8ed8]"
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
                      <span className="text-sm font-medium text-slate-700">First Name</span>
                      <input value={item.firstName} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, firstName: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Last Name</span>
                      <input value={item.lastName} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, lastName: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Date of Birth</span>
                      <input type="date" value={item.dateOfBirth} onChange={(e) => setDependantsForm((current) => current.map((entry, idx) => idx === index ? { ...entry, dateOfBirth: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
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
            <div onClick={handleClosePopup} className="absolute inset-0 cursor-pointer" />
          <div className="w-full h-fit md:w-3xl rounded-[15px] bg-white p-6 shadow-xl z-10 relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Change Plan</h2>
              </div>
              <FaX onClick={handleClosePopup} className="cursor-pointer" size={22}/>
            </div>
            <div className="mt-2 grid gap-2 md:gap-6 lg:grid-cols-2 bg-primary text-[#ffffff] rounded-[10px]">
              <div className="p-5">
                <p className="text-sm">Current Plan</p>
                <h3 className="text-xl font-semiboldmt-2">{currentPlanLabel}</h3>
                <p className="mt-4 text-xs space-x-2">Active since <span>{formatDate(currentPlanActiveSince)}</span></p>
              </div>
              <div className="p-5">
                <label className="space-y-2">
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full rounded-[15px] px-4 py-3 text-sm focus:border-0 focus:outline-none focus:ring-0 bg-[#ffffff] text-gray-900"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={handleChangePlan} className="mt-6 w-full rounded-[10px] bg-[#10B981] px-5 py-3 text-sm font-semibold text-white hover:bg-[#10B981]/90">
                  Change Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'viewReimbursement' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div onClick={handleClosePopup} className="absolute inset-0 cursor-pointer" />
            <div className="w-full md:w-xl h-fit rounded-[15px] bg-white p-3 md:p-6 shadow-xl z-10 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Reimbursements</h2>
                </div>
                <FaX onClick={handleClosePopup} className="cursor-pointer" size={22}/>
              </div>
              <div className="mt-6 space-y-4 overflow-y-auto max-h-[90%] custom-scrollbar">
                {reimburseLoading ? (
                  <p className="text-sm text-slate-500">Loading reimbursements...</p>
                ) : reimbursements.length === 0 ? (
                  <p className="text-sm text-slate-500">No reimbursements found for this user.</p>
                ) : (
                  reimbursements.map((item: any) => {
                    const id = item.id || item.$id || item._id || 'N/A';
                    const date = item.date || item.date_of_service || item.serviceDate || item.createdAt || '';
                    const providersName = item.providersName || item.providerName || item.provider || item.providers_name || 'N/A';
                    const service = item.service || item.description || 'N/A';
                    const amount = item.amount || item.total || item.charge || 'N/A';
                    const status = item.status || item.state || 'N/A';
                    const submitted = item.submitted || item.submitted_at || item.createdAt || '';
                    const supportedDocs = item.supportedDocs || item.docs || [];
                    return (
                      <div key={id} className="rounded-2xl border border-[#E5E7EB] p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{id}</p>
                            <p className="text-sm text-slate-500">Date of service {date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#E5E7EB40] px-3 md:px-6 py-2 rounded-[10px] text-xs text-gray-500'>
                          <div className='flex flex-col space-y-1'>
                            <p>Providers</p>
                            <span className="text-slate-700">{providersName}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <p>Service</p>
                            <span className="text-slate-700">{service}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <p>Amount</p>
                            <span className="text-slate-700">{amount}</span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <p>Submitted Date</p>
                            <span className="text-slate-700">{submitted}</span>
                          </div>
                        </div>
                        <div className="space-y-2 flex flex-col w-full">
                          <p className="text-sm text-slate-500">Supported Documents ({supportedDocs.length})</p>
                          <div className="flex w-full gap-2">
                            {supportedDocs.map((doc: any, index: number) => (
                              <div key={index} className=" rounded-[10px] px-6 py-2 bg-[#E5E7EB40] flex items-center justify-center text-sm text-slate-700">
                                {doc}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
      )}

      {activePopup === 'viewBenefits' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-[15px] bg-white p-6 shadow-xl h-full">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-900">View Benefits</h2>
              <FaX onClick={handleClosePopup} className="cursor-pointer" size={22}/>
            </div>
            <div className='flex justify-center items-center flex-col space-y-2 h-fit border-b pb-4 border-border'>
              <div className='h-24 w-24 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
                {initials}
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 capitalize">{enrollee.firstName} {enrollee.lastName}</h1>
              <div className='flex items-center space-x-2 text-bese capitalize text-[#ffffff]'>
                <p className="bg-[#49A5EF] py-1 px-4 rounded-[5px]">{enrollee.plan || "No Plan found"}</p>
                <p className={`px-4 py-1 rounded-[5px] ${statusColors[enrollee.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                  {enrollee.status || 'N/A'}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mt-4">Plan Benefits</h2>
              <div className='h-60 overflow-y-auto custom-scrollbar mt-2'>
                {(() => {
                  const benefitsList: string[] = [];

                  // try to resolve plan id from plansQuery
                  const plansPayload = (plansQuery.data && (plansQuery.data.data ?? plansQuery.data)) || [];
                  const planObj = Array.isArray(plansPayload)
                  ? plansPayload.find((p: any) => p.name === (enrollee.plan || ''))
                  : plansPayload?.name === (enrollee.plan || '') ? plansPayload : null;

                  const benefitsPayload = Array.isArray(benefitsRes?.data) ? benefitsRes.data : Array.isArray(benefitsRes) ? benefitsRes : [];
                  const matched = benefitsPayload.find((b: any) => {
                    if (!b) return false;
                      return b.plan_id === planObj?.$id || b.$id === planObj?.$id || b.plan_name === (enrollee.plan || '');
                  });

                  if (matched && Array.isArray(matched.benefits)) {
                    benefitsList.push(...matched.benefits.filter(Boolean));
                  }

                  if (benefitsList.length === 0) {
                    return <p className="text-sm text-slate-500">No benefits available.</p>;
                  }

                  return (
                    <ul className="mt-2 text-sm text-slate-700 space-y-2">
                      {benefitsList.map((benefit, index) => (
                        <li key={index} className="list-none bg-[#F8F9FA] px-3 py-1 rounded-[5px] flex items-center">
                          <span className='bg-green-100 text-green-800 p-1 rounded-full mr-2'>
                            <IoMdCheckmarkCircleOutline className="inline-flex" />   
                          </span>
                            {benefit}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'createPaCode' && (
        <CreateCodeActionModal user={enrollee as any} onClose={handleClosePopup} onCreated={() => { /* could refetch */ }} />
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
              <FaX onClick={handleClosePopup} className="cursor-pointer" size={22}/>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Number of dependants</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">0</p>
              </div>
              <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <p className="text-sm text-slate-500">Dependants list</p>
                <p className="mt-2 text-sm text-slate-700">No detailed dependant records are available.</p>
              </div>
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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border px-4 py-1 md:py-2">
      <span className="font-semibold md:w-1/3">{label}</span>
      <span className="w-fit md:text-end text-[15px] md:text-base">{value}</span>
    </div>
  );
}
