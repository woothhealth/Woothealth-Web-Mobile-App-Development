'use client';

import React, { useState, useEffect } from 'react';
import { FaX, FaPlus } from 'react-icons/fa6';
import { toast } from 'sonner';
import type { User } from './types/user';
import { FaTimes, FaUser } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useAdminPlans } from '@/lib/adminPlans';
import { useAdminBenefits } from '@/lib/adminBenefits';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import CreateCodeActionModal from './createCodeActionModal';

interface ActionButtonsHandlerProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

export const ActionButtonsHandler: React.FC<ActionButtonsHandlerProps> = ({ user, onUserUpdate }) => {
  const [activePopup, setActivePopup] = useState<
    | 'editProfile'
    | 'addDependants'
    | 'changePlan'
    | 'viewBenefits'
    | 'createPaCode'
    | 'deactivateProfile'
    | 'activateProfile'
    | 'viewReimbursement'
    | 'viewDependants'
    | 'verifyEnrollee'
    | null
  >(null);

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

  const statusColors: Record<string, string> = {
    'active': 'bg-[#10B981]',
    'inactive': 'bg-[#EF4444]',
    'suspended': 'bg-[#F59E0B]',
  };

  const [editProfileDraft, setEditProfileDraft] = useState({
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profile_pic: user.profile_pic,
    status: user.status ?? 'inactive',
    hmoId: user.userId ?? '',
    address: user.address ?? '',
    dob: user.dateOfBirth ?? '',
    gender: user.gender ?? '',
    plan: user.plan ?? 'Premium Care Plan',
    enrollmentDate: '',
    expiryDate: '',
    frequency: 'Yearly',
    autoBilling: 'No',
    dependants: 0,
    benefitBalance: '',
  });

  const [selectedPlan, setSelectedPlan] = useState(user.plan || 'Premium Care Plan');
  const [providerName, setProviderName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [timeframe, setTimeframe] = useState('Last 30 days');
  const [paRequest, setPaRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reimbursements, setReimbursements] = useState<any[]>([]);
  const [reimburseLoading, setReimburseLoading] = useState(false);
  const { data: benefitsRes } = useAdminBenefits();

  interface DependantForm {
    title: string;
    name: string;
    dob: string;
    email: string;
    gender: string;
    phone: string;
    nationality: string;
    relationship: string;
  }

  const [dependantsForm, setDependantsForm] = useState<DependantForm[]>([
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

  const handleClosePopup = () => setActivePopup(null);

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!editProfileDraft.name || !editProfileDraft.email) {
        toast.error('Name and Email are required.');
        setIsLoading(false);
        return;
      }

      // Build minimal payload: include id/userId and only changed, non-empty fields
      const id = user.userId || user.$id || (user as any).id;
      const draft = { ...editProfileDraft } as Record<string, any>;
      const original = { ...user } as Record<string, any>;

      const mapOriginal = (key: string) => {
        if (key === 'dob') return original.dateOfBirth || original.dob || '';
        if (key === 'hmoId' || key === 'userId') return original.userId || original.$id || original.id || '';
        return original[key];
      };

      const normalizeGender = (g: any) => {
        if (g === null || g === undefined) return g;
        const s = String(g).toLowerCase().trim();
        if (s === 'male' || s === 'm') return 'male';
        if (s === 'female' || s === 'f') return 'female';
        if (s === 'non-binary' || s === 'nonbinary' || s === 'non binary' || s === 'nb') return 'non-binary';
        if (s === 'other' || s === 'others') return 'others';
        return s;
      };

      const payload: Record<string, any> = {};
      if (id) payload.id = id;
      if (user.userId) payload.userId = user.userId;

      Object.keys(draft).forEach((k) => {
        const v = draft[k];
        // strip empty strings
        if (typeof v === 'string' && v.trim() === '') return;
        if (v === null || v === undefined) return;

        const orig = mapOriginal(k);
        const a = typeof v === 'string' ? v.trim() : v;
        const b = typeof orig === 'string' ? String(orig).trim() : orig;

        if (k === 'dependants' || typeof a === 'number' || typeof b === 'number') {
          if (Number(a) === Number(b)) return;
          payload[k] = a;
          return;
        }

        if (k === 'dob') {
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

      const changedKeys = Object.keys(payload).filter((x) => x !== 'id' && x !== 'userId');
      if (changedKeys.length === 0) {
        toast('No changes detected');
        handleClosePopup();
        return;
      }

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

      const updatedUser = { ...user, ...editProfileDraft };
      onUserUpdate(updatedUser);
      toast.success('Profile updated successfully.');
      handleClosePopup();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlan = async () => {
    try {
      setIsLoading(true);
      // Update plan via admin API (send minimal payload and log failures)
      const payload = { id: user.userId, userId: user.userId, plan: selectedPlan };
      const response = await fetch('/api/admin/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('PUT /api/admin/user change plan failed', response.status, text);
        let parsed: any = {};
        try { parsed = JSON.parse(text); } catch {}
        throw new Error(parsed?.message || parsed?.error || `Failed to change plan (${response.status})`);
      }

      const updatedUser = { ...user, plan: selectedPlan };
      onUserUpdate(updatedUser);
      toast.success('Plan changed successfully.');
      handleClosePopup();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error changing plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePaCode = async () => {
    try {
      setIsLoading(true);
      
      if (!providerName.trim()) {
        toast.error('Enter a provider name before creating.');
        setIsLoading(false);
        return;
      }
      if (!paRequest.trim()) {
        toast.error('Enter a PA request before creating.');
        setIsLoading(false);
        return;
      }

      // POST PA code via admin API (derive userId from selected user)
      const response = await fetch('/api/admin/pa-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          providerName: providerName,
          note: paRequest,
          agentName: agentName,
          timeframe: timeframe,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create PA code');
      }

      toast.success(`PA code created successfully.`);
      setProviderName('');
      setPaRequest('');
      handleClosePopup();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating PA code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateProfile = () => {
    (async () => {
      try {
        setIsLoading(true);
        const payload = { id: user.userId, userId: user.userId, status: 'inactive' };
        const res = await fetch('/api/admin/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('PUT /api/admin/user deactivate failed', res.status, text);
          let parsed: any = {};
          try { parsed = JSON.parse(text); } catch {}
          throw new Error(parsed?.message || parsed?.error || `Failed to deactivate (${res.status})`);
        }
        const updatedUser = { ...user, status: 'inactive' };
        onUserUpdate(updatedUser);
        toast.success('Profile deactivated.');
        handleClosePopup();
      } catch (e: any) {
        toast.error(e?.message || 'Error deactivating profile');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleActivateProfile = () => {
    (async () => {
      try {
        setIsLoading(true);
        const payload = { id: user.userId, userId: user.userId, status: 'active' };
        const res = await fetch('/api/admin/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('PUT /api/admin/user activate failed', res.status, text);
          let parsed: any = {};
          try { parsed = JSON.parse(text); } catch {}
          throw new Error(parsed?.message || parsed?.error || `Failed to activate (${res.status})`);
        }
        const updatedUser = { ...user, status: 'active' };
        onUserUpdate(updatedUser);
        toast.success('Profile activated.');
        handleClosePopup();
      } catch (e: any) {
        toast.error(e?.message || 'Error activating profile');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  // Load reimbursements for this user when viewReimbursement popup opens
  useEffect(() => {
    if (activePopup !== 'viewReimbursement') return;
    (async () => {
      try {
        setReimburseLoading(true);
        const route = `/api/admin/reimbursement?search=${encodeURIComponent(user.userId || '')}`;
        const res = await fetch(route, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch reimbursements');
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setReimbursements(list);
      } catch (err) {
        console.error('Error fetching reimbursements for user', user.userId, err);
        setReimbursements([]);
      } finally {
        setReimburseLoading(false);
      }
    })();
  }, [activePopup, user.userId]);

  const handleAddDependantField = () => {
    const newDependant: DependantForm = {
      title: `Dependant ${dependantsForm.length + 1}`,
      name: '',
      dob: '',
      email: '',
      gender: '',
      phone: '',
      nationality: '',
      relationship: '',
    };
    setDependantsForm((prev) => [...prev, newDependant]);
  };

  const handleAddDependent = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      for (const dependant of dependantsForm) {
        if (!dependant.name || !dependant.email || !dependant.dob) {
          toast.error('Please fill in required fields (Name, Email, DOB).');
          setIsLoading(false);
          return;
        }
      }

      // POST to dependant endpoint
      const response = await fetch('/api/dependants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          dependants: dependantsForm,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add dependants');
      }

      toast.success('Dependant(s) added successfully.');
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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error adding dependant');
    } finally {
      setIsLoading(false);
    }
  };

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const isActive = user.status?.toLowerCase() === 'active';

  const currentPlanLabel = user.plan || 'Premium Care Plan';
  const currentPlanActiveSince = user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'N/A';

  const actionButtons: Array<{
    label: string;
    type:
      | 'editProfile'
      | 'addDependants'
      | 'changePlan'
      | 'viewBenefits'
      | 'createPaCode'
      | 'deactivateProfile'
      | 'activateProfile'
      | 'viewReimbursement'
      | 'viewDependants'
      | 'verifyEnrollee';
  }> = [
    { label: 'Edit Profile', type: 'editProfile' },
    { label: 'Add Dependent', type: 'addDependants' },
    { label: 'Change Plan', type: 'changePlan' },
    { label: 'View Reimbursement', type: 'viewReimbursement' },
    { label: 'View Benefits', type: 'viewBenefits' },
    { label: 'Create PA Code', type: 'createPaCode' },
    { label: 'View Dependants', type: 'viewDependants' },
    { label: 'Verify Enrollee', type: 'verifyEnrollee' },
    {
      label: isActive ? 'Deactivate Profile' : 'Activate Profile',
      type: isActive ? 'deactivateProfile' : 'activateProfile',
    },
  ];

  // Admin user (the current admin viewing the dashboard)
  const adminUser = useAdminDashboardUser();

  // Visibility rules for each action button.
  // - No actions visible when the enrollee has no plan
  // - Dependant-related actions only for plans containing 'family'
  // - 'verifyEnrollee' only visible to admin users with role 'business'
  const isActionVisible = (type: string) => {
    const plan = (user.plan || '').toString().trim();
    if (!plan) return false; // requirement: all actions hidden if user has no plan

    const planLower = plan.toLowerCase();
    const adminRole = String(adminUser?.role || '').toLowerCase();

    if (type === 'addDependants' || type === 'viewDependants') {
      return planLower.includes('family');
    }

    if (type === 'verifyEnrollee') {
      return adminRole === 'business';
    }

    // default: visible when user has a plan
    return true;
  };

  const visibleActionButtons = actionButtons.filter((b) => isActionVisible(b.type));

  const renderPopup = () => {
    switch (activePopup) {
      case 'editProfile':
        return (
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
              <div className='flex flex-col items-center space-y-1 text-[#959595] col-span-2'>
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
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Name</span>
                <input
                  value={editProfileDraft.name}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Email</span>
                <input
                  type="email"
                  value={editProfileDraft.email}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Phone</span>
                <input
                  value={editProfileDraft.phone}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">HMO ID</span>
                <input
                  value={editProfileDraft.hmoId}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, hmoId: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Role</span>
                <input
                  value={editProfileDraft.role}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Address</span>
                <input
                  value={editProfileDraft.address}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Date of Birth</span>
                <input
                  type="date"
                  value={editProfileDraft.dob}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, dob: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Gender</span>
                <select
                  value={editProfileDraft.gender}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Enrollment Date</span>
                <input
                  type="date"
                  value={editProfileDraft.enrollmentDate}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, enrollmentDate: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Expiry Date</span>
                <input
                  type="date"
                  value={editProfileDraft.expiryDate}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Payment Frequency</span>
                <select
                  value={editProfileDraft.frequency}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, frequency: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="Yearly">Yearly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Auto-Billing</span>
                <select
                  value={editProfileDraft.autoBilling}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, autoBilling: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Dependants</span>
                <input
                  type="number"
                  min={0}
                  value={editProfileDraft.dependants}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, dependants: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Benefit Balance</span>
                <input
                  value={editProfileDraft.benefitBalance}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, benefitBalance: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>
            </div>
            <div className="mt-6 flex w-full">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="rounded-2xl bg-[#49A5EF] px-5 py-3 text-[17px] font-semibold w-full text-white hover:bg-[#3d8ed8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
        );

      case 'changePlan':
        return (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div onClick={handleClosePopup} className="absolute inset-0 cursor-pointer" />
          <div className="w-full h-fit md:w-3xl rounded-[15px] bg-white p-6 shadow-xl z-10 relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Change Plan</h2>
              </div>
              <FaTimes onClick={handleClosePopup} className="cursor-pointer" size={22}/>
            </div>
            <div className="mt-2 grid gap-2 md:gap-6 lg:grid-cols-2 bg-primary text-[#ffffff] rounded-[10px]">
              <div className="p-5">
                <p className="text-sm">Current Plan</p>
                <h3 className="text-xl font-semiboldmt-2">{currentPlanLabel}</h3>
                <p className="mt-4 text-xs space-x-2">Active since <span>{currentPlanActiveSince}</span></p>
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
        );

      case 'viewReimbursement':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div onClick={handleClosePopup} className="absolute inset-0 cursor-pointer" />
                    <div className="w-full md:w-xl h-fit rounded-[15px] bg-white p-3 md:p-6 shadow-xl z-10 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-slate-900">Reimbursements</h2>
                        </div>
                        <FaTimes onClick={handleClosePopup} className="cursor-pointer" size={22}/>
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
        )

      case 'createPaCode':
        return (
          <>
            {/* Use the shared create PA code modal component */}
            <CreateCodeActionModal user={user} onClose={handleClosePopup} onCreated={() => { /* noop, could refetch lists */ }} />
          </>
        );

      case 'viewBenefits':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-xl rounded-[15px] bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">View Benefits</h2>
                <FaTimes onClick={handleClosePopup} className="cursor-pointer" size={22}/>
              </div>
              <div className='flex justify-center items-center flex-col space-y-2 h-fit border-b pb-4 border-border'>
                <div className='h-24 w-24 rounded-full bg-[#E5E7EB] flex items-center justify-center font-semibold text-3xl border-4 border-[#D9D9D9]'>
                  {initials}
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 capitalize">{user.firstName} {user.lastName}</h1>
                <div className='flex items-center space-x-2 text-bese capitalize text-[#ffffff]'>
                  <p className="bg-[#49A5EF] py-1 px-4 rounded-[5px]">{user.plan || "No Plan found"}</p>
                  <p className={`px-4 py-1 rounded-[5px] ${statusColors[user.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                    {user.status || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mt-4">Plan Benefits</h2>
                <div>
                  {(() => {
                    const benefitsList: string[] = [];

                    // try to resolve plan id from plansQuery
                    const plansPayload = (plansQuery.data && (plansQuery.data.data ?? plansQuery.data)) || [];
                    const planObj = Array.isArray(plansPayload) ? plansPayload.find((p: any) => p.name === (user.plan || ''))
                    : plansPayload?.name === (user.plan || '') ? plansPayload : null;

                    const benefitsPayload = Array.isArray(benefitsRes?.data) ? benefitsRes.data : Array.isArray(benefitsRes) ? benefitsRes : [];
                    const matched = benefitsPayload.find((b: any) => {
                      if (!b) return false;
                      return b.plan_id === planObj?.$id || b.$id === planObj?.$id || b.plan_name === (user.plan || '');
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
        );

      case 'addDependants':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full h-full max-w-3xl rounded-[15px] bg-white p-6 shadow-xl overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Add Dependant</h2>
                <p className="text-sm text-slate-600">Add dependant details for this enrollee.</p>
              </div>
              <FaX onClick={handleClosePopup} className="" size={22}/>
            </div>
            <div className="mt-6 space-y-6">
              {dependantsForm.map((item: DependantForm, index: number) => (
                <div key={item.title} className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">{item.title}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Name</span>
                      <input value={item.name} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, name: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Date of Birth</span>
                      <input type="date" value={item.dob} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, dob: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Email</span>
                      <input type="email" value={item.email} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, email: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Gender</span>
                      <select value={item.gender} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, gender: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Phone</span>
                      <input value={item.phone} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, phone: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Nationality</span>
                      <input value={item.nationality} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, nationality: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Relationship</span>
                      <input value={item.relationship} onChange={(e) => setDependantsForm((current: DependantForm[]) => current.map((entry: DependantForm, idx: number) => idx === index ? { ...entry, relationship: e.target.value } : entry))} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
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
                <button type="button" onClick={handleAddDependent} disabled={isLoading} className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8] disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Saving...' : 'Save Dependant(s)'}
                </button>
              </div>
            </div>
          </div>
        </div>
        );

      case 'viewDependants':
        return (
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
        )

      case 'deactivateProfile':
        return (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
                    <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
                      <h2 className="text-xl text-center font-semibold text-slate-900">Deactivate ID {user.userId} Profile?</h2>
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
        )

      case 'activateProfile':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">  
              <h2 className="text-xl text-center font-semibold text-slate-900">Activate ID {user.userId} Profile?</h2>
              <div className="mt-6 flex gap-3 justify-end">
                <button type="button" onClick={handleClosePopup} className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="button" onClick={handleActivateProfile} className="rounded-2xl bg-[#10B981] px-5 py-2 text-sm font-semibold text-white hover:bg-[#059669]">
                  Activate
                </button>
              </div>
            </div>
          </div>
        )

      case 'verifyEnrollee':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Verify Enrollee</h2>
                </div>
                <FaX onClick={handleClosePopup} className="cursor-pointer" size={22}/>
              </div>
              <div className="mt-6 space-y-2">
                <div className="rounded-[15px] bg-[#F8FAFC] py-2 px-4 flex justify-between">
                  <p className="text-sm">Enrollee Name</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{user.firstName} {user.lastName}</p>
                </div>
                <div className="rounded-[15px] bg-[#F8FAFC] py-2 px-4 flex justify-between">
                  <p className="text-sm">Status</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{user.status || 'Inactive'}</p>
                </div>
                <div className="rounded-[15px] flex justify-between bg-[#F8FAFC] py-2 px-4">
                  <p className="text-sm">Verification Status</p>
                  <p className="text-lg font-semibold text-green-600">Verified</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-2">
        {visibleActionButtons.map((button) => (
          <button
            key={button.type}
            type="button"
            onClick={() => setActivePopup(button.type)}
            className={`w-full px-3 py-2 text-center text-[17px] uppercase font-medium text-white rounded-[10px] transition ${
              button.type === 'deactivateProfile'
                ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                : button.type === 'activateProfile'
                  ? 'bg-[#10B981] hover:bg-[#059669]'
                  : 'bg-[#49A5EF] hover:bg-[#3d8ed8]'
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {renderPopup()}
    </>
  );
};

export default ActionButtonsHandler;