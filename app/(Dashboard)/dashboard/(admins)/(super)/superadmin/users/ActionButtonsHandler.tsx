'use client';

import React, { useState } from 'react';
import { FaX, FaPlus } from 'react-icons/fa6';
import { toast } from 'sonner';
import type { User } from './types/user';
import { FaTimes } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

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

  const planOptions = ['Premium Care Plan', 'Standard Care Plan', 'Basic Care Plan', 'Family Care Plan'];

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
    status: user.status ?? 'inactive',
    hmoId: user.userId ?? '',
    address: '',
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

      // Update profile via API
      const response = await fetch(`/api/users/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProfileDraft),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
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

      // Update plan via API
      const response = await fetch(`/api/users/${user.userId}/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change plan');
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

      // POST PA code via API
      const response = await fetch('/api/pa-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          code: providerName,
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
    const updatedUser = { ...user, status: 'inactive' };
    onUserUpdate(updatedUser);
    toast.success('Profile deactivated.');
    handleClosePopup();
  };

  const handleActivateProfile = () => {
    const updatedUser = { ...user, status: 'active' };
    onUserUpdate(updatedUser);
    toast.success('Profile activated.');
    handleClosePopup();
  };

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

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

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

  const reimburseMock = [
    {
      id: '#RMB - 001',
      date: '12/10/2025',
      providersName: 'General Hospital',
      service: 'Consultation',
      amount: '#45,000',
      status: 'Approved',
      submitted: '17/10/2025',
      supportedDocs: ['doc1.jpg', 'doc2.jpg'],
    },
    {
      id: '#RMB - 002',
      date: '15/10/2025',
      providersName: 'City Medical Center',
      service: 'Surgery',
      amount: '#120,000',
      status: 'Pending',
      submitted: '20/10/2025',
      supportedDocs: ['doc3.jpg', 'doc4.jpg'],
    },
    {
      id: '#RMB - 003',
      date: '18/10/2025',
      providersName: 'National Health Clinic',
      service: 'Diagnostic Test',
      amount: '#25,000',
      status: 'Rejected',
      submitted: '22/10/2025',
      supportedDocs: ['doc5.jpg', 'doc6.jpg'],
    }
  ];

  const benefitsData = ['Benefit 1', 'Benefit 2', 'Benefit 3'];

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
                <span className="font-semibold text-[15px]">Status</span>
                <select
                  value={editProfileDraft.status}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="font-semibold text-[15px]">Plan</span>
                <select
                  value={editProfileDraft.plan}
                  onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, plan: e.target.value }))}
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  {planOptions.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
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
            <div className="mt-2 grid gap-6 lg:grid-cols-2 bg-primary text-[#ffffff] rounded-[10px]">
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
                    <div className="w-full md:w-xl h-full rounded-[15px] bg-white p-6 shadow-xl z-10 relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-slate-900">Reimbursements</h2>
                        </div>
                        <FaTimes onClick={handleClosePopup} className="cursor-pointer" size={22}/>
                      </div>
                      <div className="mt-6 space-y-4 overflow-y-auto h-[80%] custom-scrollbar">
                        {reimburseMock.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-[#E5E7EB] p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{item.id}</p>
                                <p className="text-sm text-slate-500">Date of service{item.date}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#E5E7EB40] px-6 py-2 rounded-[10px] text-xs text-gray-500'>
                              <div className='flex flex-col space-y-1'>
                                <p>Providers</p>
                                <span className="text-slate-700">{item.providersName}</span>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <p>Service</p>
                                <span className="text-slate-700">{item.service}</span>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <p>Amount</p>
                                <span className="text-slate-700">{item.amount}</span>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <p>Submitted Date</p>
                                <span className="text-slate-700">{item.submitted}</span>
                              </div>
                            </div>
                            <div className="space-y-2 flex flex-col">
                              <p className="text-sm text-slate-500">Supported Documents ({item.supportedDocs.length})</p>
                              <div className="flex w-full gap-2">
                                {item.supportedDocs.map((doc, index) => (
                                  <div key={index} className=" rounded-[10px] px-6 py-2 bg-[#E5E7EB40] flex items-center justify-center text-sm text-slate-700">
                                    {doc}
                                  </div>
                                ))}
                              </div>
                          </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
        )

      case 'createPaCode':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full md:w-lg h-fit rounded-[15px] bg-white p-6 shadow-xl space-y-4 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-900">Create PA Code</h2>
              <FaTimes onClick={handleClosePopup} className="cursor-pointer" size={22}/>
            </div>
            <form>
              <div className="space-y-4">
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Providers Name</span>
                  <input value={providerName} onChange={(e) => setProviderName(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" placeholder="Enter providers name" />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Request</span>
                  <textarea value={paRequest} onChange={(e) => setPaRequest(e.target.value)} rows={4} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none" placeholder="Enter request" />
                </label>
              </div>
              <div className="mt-6 space-y-4">
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Agent Name</span>
                  <input value={agentName} onChange={(e) => setAgentName(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" placeholder="Enter agent name" />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Time</span>
                  <input type="date" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]" />
                </label>
              </div>
            </form>
            <button type="button" onClick={handleCreatePaCode} className="rounded-2xl bg-[#49A5EF] px-5 py-3 mt-3 font-semibold w-full text-white hover:bg-[#3d8ed8]">
              Create Code
            </button>
          </div>
        </div>
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
                        <h1 className="text-2xl font-semibold text-slate-900">{user.firstName} {user.lastName}</h1>
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
                          {benefitsData.length > 0 ? (
                            <ul className="mt-2 text-sm text-slate-700 space-y-2">
                              {benefitsData.map((benefit, index) => (
                                <li key={index} className="list-none bg-[#F8F9FA] px-3 py-1 rounded-[5px] flex items-center">
                                  <span className='bg-green-100 text-green-800 p-1 rounded-full mr-2'>
                                    <IoMdCheckmarkCircleOutline className="inline-flex" />
                                  </span>
                                    {benefit}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-500">No benefits available.</p>
                          )}
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
                        <FaX onClick={handleClosePopup} className="" size={22}/>
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
                <button type="button" onClick={handleActivateProfile} className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]">
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
                <FaX onClick={handleClosePopup} className="" size={22}/>
              </div>
              <div className="mt-6 space-y-2">
                <div className="rounded-[15px] bg-[#F8FAFC] py-2 px-4 flex justify-between">
                  <p className="text-sm">Enrollee Name</p>
                  <p className="text-lg font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
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
        {actionButtons.map((button) => (
          <button
            key={button.type}
            type="button"
            onClick={() => setActivePopup(button.type)}
            className={`w-full px-3 py-3 text-center text-[17px] uppercase font-medium text-white rounded-[10px] transition ${
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
