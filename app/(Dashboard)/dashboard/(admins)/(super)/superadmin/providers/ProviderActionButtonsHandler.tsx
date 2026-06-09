'use client';

import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { toast } from 'sonner';
import AddTariffModal from '../tariff/AddTariffModal';

interface Provider {
  $id: string;
  name: string;
  address?: string;
  state?: string;
  email?: string[] | string;
  phone?: string[] | string;
  type?: string;
  tier?: string;
  remark?: string;
  local_govt?: string;
  specialization?: string;
  providerCode?: string;
  providerTariff?: string[];
  profile_pic?: string;
  customTariff?: boolean;
  contactPerson?: string;
  licenseNumber?: string;
  nhiaNumber?: string;
  wootId?: string;
  adminOfficer?: string;
  status?: string;
}

interface ProviderActionButtonsHandlerProps {
  provider: Provider;
  onProviderUpdate: (updatedProvider: Provider) => void;
}

type PopupType =
  | 'editProfile'
  | 'uploadTariff'
  | 'viewTariff'
  | 'suspendProvider'
  | 'deactivateProvider'
  | 'activateProvider'
  | null;

export const ProviderActionButtonsHandler: React.FC<ProviderActionButtonsHandlerProps> = ({ provider, onProviderUpdate }) => {
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const [editProfileDraft, setEditProfileDraft] = useState({
    name: provider.name || '',
    address: provider.address || '',
    email: Array.isArray(provider.email) ? provider.email.join(', ') : provider.email || '',
    phone: Array.isArray(provider.phone) ? provider.phone.join(', ') : provider.phone || '',
    state: provider.state || '',
    profile_pic: provider.profile_pic || '',
    local_govt: provider.local_govt || '',
    type: provider.type || '',
    tier: provider.tier || '',
    remark: provider.remark || '',
    providerCode: provider.providerCode || '',
    contactPerson: provider.contactPerson || '',
    licenseNumber: provider.licenseNumber || '',
    nhiaNumber: provider.nhiaNumber || '',
    wootId: provider.wootId || '',
    adminOfficer: provider.adminOfficer || '',
  });

  const [suspendReason, setSuspendReason] = useState('');

  const [tariffs, setTariffs] = useState<any[]>([]);
  const [tariffsLoading, setTariffsLoading] = useState(false);
  const [tariffsError, setTariffsError] = useState('');

  const formatAmount = (amt: any) => {
    if (amt == null) return 'N/A';
    if (typeof amt === 'number') return `₦${amt.toLocaleString()}`;
    const num = Number(amt);
    if (isNaN(num)) return amt;
    return `₦${num.toLocaleString()}`;
  };

  useEffect(() => {
    setEditProfileDraft({
      name: provider.name || '',
      address: provider.address || '',
      email: Array.isArray(provider.email) ? provider.email.join(', ') : provider.email || '',
      phone: Array.isArray(provider.phone) ? provider.phone.join(', ') : provider.phone || '',
      state: provider.state || '',
      local_govt: provider.local_govt || '',
      type: provider.type || '',
      tier: provider.tier || '',
      profile_pic: provider.profile_pic || '',
      remark: provider.remark || '',
      providerCode: provider.providerCode || '',
      contactPerson: provider.contactPerson || '',
      licenseNumber: provider.licenseNumber || '',
      nhiaNumber: provider.nhiaNumber || '',
      wootId: provider.wootId || '',
      adminOfficer: provider.adminOfficer || '',
    });
  }, [provider]);

  useEffect(() => {
    if (activePopup !== 'viewTariff') return;
    let mounted = true;
    const fetchTariffs = async () => {
      setTariffsLoading(true);
      setTariffsError('');
      try {
        const res = await fetch(`/api/admin/tariff?providerId=${encodeURIComponent(provider.$id)}`, { credentials: 'include' });
        const payload = await res.json().catch(() => null);
        const data = payload?.data || payload;
        if (!res.ok) throw new Error(payload?.error || 'Failed to fetch tariffs');
        if (!mounted) return;

        // Normalize provider info for matching
        const providerTypeNormalized = (provider.type || '').toString().trim().toLowerCase();
        const providerTierRaw = (provider.tier || '').toString().trim();
        const providerTier = providerTierRaw.replace(/^tier\s*/i, '').replace(/^price\s*/i, '');

        const tierCandidates = [
          `tier${providerTier}`,
          `tier${providerTier.toLowerCase()}`,
          `tier${providerTier.toUpperCase()}`,
          `price${providerTier}`,
          `price${providerTier.toLowerCase()}`,
          `price${providerTier.toUpperCase()}`,
          providerTier,
          providerTier.toLowerCase(),
          providerTier.toUpperCase(),
        ].filter(Boolean);

        const extractAmount = (t: any) => {
          if (!t) return null;
          for (const k of tierCandidates) {
            if (t[k] != null) return t[k];
          }
          const nestedKeys = ['prices', 'price', 'tiers', 'amounts', 'rates'];
          for (const nk of nestedKeys) {
            const obj = t[nk];
            if (obj && typeof obj === 'object') {
              for (const k of tierCandidates) {
                if (obj[k] != null) return obj[k];
              }
              // if object contains numeric values only, try first numeric
              const vals = Object.values(obj).filter((v) => v != null && (typeof v === 'number' || !Number.isNaN(Number(v))));
              if (vals.length > 0) return vals[0];
            }
          }
          if (t.amount != null) return t.amount;
          if (t.price != null) return t.price;
          return null;
        };

        let rawList: any[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (Array.isArray((data as any).items)) rawList = (data as any).items;
        else if (Array.isArray((data as any).data)) rawList = (data as any).data;
        else rawList = [];

        // Filter tariffs by providerType match and presence of a tier-specific amount
        const filtered = rawList.filter((t) => {
          const tProviderType = ((t.providerType || t.provider_type || t.type) || '').toString().trim().toLowerCase();
          if (!tProviderType || !providerTypeNormalized) return false;
          if (tProviderType !== providerTypeNormalized) return false;
          const amt = extractAmount(t);
          return amt != null;
        });

        setTariffs(filtered);
      } catch (err: any) {
        if (!mounted) return;
        setTariffsError(err?.message || 'Failed to load tariffs');
      } finally {
        if (mounted) setTariffsLoading(false);
      }
    };
    fetchTariffs();
    return () => {
      mounted = false;
    };
  }, [activePopup, provider.$id]);

  const isActive = provider.status?.toLowerCase() === 'active';
  const isSuspended = provider.status?.toLowerCase() === 'suspended';

  const resetErrors = () => {
    setFormErrors({});
    setGeneralError('');
  };

  const updateProvider = async (payload: Partial<Provider>) => {
    const res = await fetch('/api/admin/providers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: provider.$id, ...payload }),
      credentials: 'include',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to update provider');
    }

    const result = await res.json();
    return result.data || result;
  };

  const handleSaveProfile = async () => {
    resetErrors();
    const errors: Record<string, string> = {};

    if (!editProfileDraft.name.trim()) {
      errors.name = 'Provider name is required.';
    }
    if (!editProfileDraft.email.trim()) {
      errors.email = 'Email is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateProvider({
        name: editProfileDraft.name.trim(),
        address: editProfileDraft.address.trim(),
        email: editProfileDraft.email.split(',').map((item) => item.trim()),
        phone: editProfileDraft.phone.split(',').map((item) => item.trim()),
        profile_pic: editProfileDraft.profile_pic,
        state: editProfileDraft.state.trim(),
        local_govt: editProfileDraft.local_govt.trim(),
        type: editProfileDraft.type.trim(),
        tier: editProfileDraft.tier.trim(),
        remark: editProfileDraft.remark.trim(),
        providerCode: editProfileDraft.providerCode.trim(),
        contactPerson: editProfileDraft.contactPerson.trim(),
        licenseNumber: editProfileDraft.licenseNumber.trim(),
        nhiaNumber: editProfileDraft.nhiaNumber.trim(),
        wootId: editProfileDraft.wootId.trim(),
        adminOfficer: editProfileDraft.adminOfficer.trim(),
      });
      onProviderUpdate(updated as Provider);
      toast.success('Provider profile updated successfully.');
      setActivePopup(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save provider profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload tariff handled via AddTariffModal

  const handleSuspendProvider = async () => {
    resetErrors();
    if (!suspendReason.trim()) {
      setFormErrors({ reason: 'Please provide a reason for suspension.' });
      return;
    }

    setIsLoading(true);
    try {
      const updated = await updateProvider({ status: 'Suspended', remark: suspendReason.trim() });
      onProviderUpdate(updated as Provider);
      toast.success('Provider suspended successfully.');
      setSuspendReason('');
      setActivePopup(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to suspend provider.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async () => {
    setIsLoading(true);
    try {
      const newStatus = isActive ? 'Inactive' : 'Active';
      const updated = await updateProvider({ status: newStatus });
      onProviderUpdate(updated as Provider);
      toast.success(`Provider ${isActive ? 'deactivated' : 'activated'} successfully.`);
      setActivePopup(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${isActive ? 'deactivate' : 'activate'} provider.`);
    } finally {
      setIsLoading(false);
    }
  };

  const actionButtons = [
    { label: 'Edit Profile', type: 'editProfile' as const },
    { label: 'Upload Tariff', type: 'uploadTariff' as const },
    { label: 'View Tariff', type: 'viewTariff' as const },
    { label: 'Suspend Provider', type: 'suspendProvider' as const },
    {
      label: isActive ? 'Deactivate Provider' : 'Activate Provider',
      type: isActive ? 'deactivateProvider' as const : 'activateProvider' as const,
    },
  ];

  const renderPopup = () => {
    switch (activePopup) {
      case 'editProfile':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-3xl h-fit rounded-[15px] bg-white p-6 shadow-xl overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Edit Provider Profile</h2>
                  <p className="text-sm text-slate-600">Update provider details using the form below.</p>
                </div>
                <FaX onClick={() => setActivePopup(null)} className="cursor-pointer" size={22} />
              </div>
              <div className='flex flex-col items-center space-y-1 text-[#959595]'>
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
                  <span className="font-medium text-slate-700">Provider Name</span>
                  <input
                    value={editProfileDraft.name}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                  {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Email</span>
                  <input
                    type="email"
                    value={editProfileDraft.email}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                  {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Phone</span>
                  <input
                    value={editProfileDraft.phone}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                  {formErrors.phone && <p className="text-xs text-red-600">{formErrors.phone}</p>}
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Provider Type</span>
                  <input
                    value={editProfileDraft.type}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Tier</span>
                  <input
                    value={editProfileDraft.tier}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, tier: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Address</span>
                  <input
                    value={editProfileDraft.address}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">State</span>
                  <input
                    value={editProfileDraft.state}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, state: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Local Government</span>
                  <input
                    value={editProfileDraft.local_govt}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, local_govt: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Contact Person</span>
                  <input
                    value={editProfileDraft.contactPerson}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Provider Code</span>
                  <input
                    value={editProfileDraft.providerCode}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, providerCode: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">NHIA Number</span>
                  <input
                    value={editProfileDraft.nhiaNumber}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, nhiaNumber: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">License Number</span>
                  <input
                    value={editProfileDraft.licenseNumber}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="font-medium text-slate-700">Remark</span>
                  <textarea
                    value={editProfileDraft.remark}
                    onChange={(e) => setEditProfileDraft((prev) => ({ ...prev, remark: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none"
                  />
                </label>
              </div>
              {generalError && <p className="mt-4 text-sm text-red-600">{generalError}</p>}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setActivePopup(null)}
                  className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'uploadTariff':
        return (
          <AddTariffModal
            isOpen={true}
            onClose={() => setActivePopup(null)}
            providerName={provider.name}
            providerType={provider.type}
            onTariffAdded={async () => {
              setActivePopup(null);
              // Refresh provider from server and update parent
              try {
                const res = await fetch(`/api/admin/providers?providerId=${encodeURIComponent(provider.$id)}`, { credentials: 'include' });
                if (res.ok) {
                  const payload = await res.json().catch(() => null);
                  const updated = payload?.data || payload;
                  if (updated) onProviderUpdate(updated as Provider);
                }
              } catch (e) {
                // ignore refresh errors
              }
            }}
          />
        );

      case 'viewTariff':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-xl rounded-[15px] bg-white p-6 shadow-xl h-fit">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">View Tariff</h2>
                <FaX onClick={() => setActivePopup(null)} className="cursor-pointer" size={22} />
              </div>
              <div className="mt-6 max-h-100 overflow-auto custom-scrollbar">
                {tariffsLoading ? (
                  <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <p className="text-sm text-slate-500">Loading tariffs...</p>
                  </div>
                ) : tariffsError ? (
                  <div className="rounded-3xl border border-[#E5E7EB] bg-[#FFF0F0] p-4">
                    <p className="text-sm text-red-600">{tariffsError}</p>
                  </div>
                ) : tariffs && tariffs.length > 0 ? (
                  <div className="overflow-x-auto rounded-[15px] border border-[#E5E7EB] bg-white">
                    <table className="w-full table-auto text-left">
                      <thead className="bg-[#F8FAFC] border-b border-border text-[17px]">
                        <tr>
                          <th className="px-4 py-3">Tariff Code</th>
                          <th className="px-4 py-3">Service Name</th>
                          <th className="px-4 py-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tariffs.map((tariff: any, index: number) => {
                          const providerTierRaw = (provider.tier || '').toString();
                          // Normalize tier like 'Tier D' -> 'D', 'A Plus' -> 'APlus', 'tierA' -> 'A'
                          const normalizedTier = providerTierRaw.replace(/^\s*tier\s*/i, '').replace(/\s+/g, '').replace(/\+/g, 'Plus');

                          const buildTierKeys = (t: string) => {
                            if (!t) return [];
                            const keys = new Set<string>();
                            keys.add(t);
                            keys.add(t.toLowerCase());
                            keys.add(t.toUpperCase());
                            keys.add(`tier${t}`);
                            keys.add(`tier${t.toLowerCase()}`);
                            keys.add(`tier${t.toUpperCase()}`);
                            keys.add(`price${t}`);
                            keys.add(`price${t.toLowerCase()}`);
                            keys.add(`price${t.toUpperCase()}`);
                            return Array.from(keys).filter(Boolean);
                          };

                          const tierCandidates = buildTierKeys(normalizedTier);

                          const nestedKeys = ['prices', 'price', 'tiers', 'amounts', 'rates'];

                          const findAmount = (t: any) => {
                            if (!t) return null;
                            // try exact tier keys first
                            for (const k of tierCandidates) {
                              if (t[k] != null) return t[k];
                            }
                            // then check nested objects for those exact keys
                            for (const nk of nestedKeys) {
                              const obj = t[nk];
                              if (obj && typeof obj === 'object') {
                                for (const k of tierCandidates) {
                                  if (obj[k] != null) return obj[k];
                                }
                                if (normalizedTier && obj[normalizedTier] != null) return obj[normalizedTier];
                              }
                            }
                            // fallbacks
                            if (t.amount != null) return t.amount;
                            if (t.price != null) return t.price;
                            // try first numeric value in object
                            const vals = Object.values(t).filter((v) => v != null && (typeof v === 'number' || !Number.isNaN(Number(v))));
                            if (vals.length > 0) return vals[0];
                            return null;
                          };

                          const code = tariff.code || tariff.tariffCode || tariff.paCode || tariff.codeId || tariff.id || '';
                          const serviceName = tariff.name || tariff.service || tariff.description || tariff.serviceName || '';
                          const amountRaw = findAmount(tariff);
                          const amount = amountRaw == null ? 'N/A' : amountRaw;

                          return (
                            <tr key={index} className="even:bg-[#FBFDFF] divide-y divide-border">
                              <td className="px-4 py-3 text-sm text-slate-700 align-top">{code}</td>
                              <td className="px-4 py-3 text-sm text-slate-700 align-top">{serviceName}</td>
                              <td className="px-4 py-3 text-sm font-semibold text-slate-900 border-b border-border">{formatAmount(amount)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                    <p className="text-sm text-slate-500">No tariff information available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'suspendProvider':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Suspend Provider</h2>
                  <p className="text-sm text-slate-600">Provide suspension details below.</p>
                </div>
                <FaX onClick={() => setActivePopup(null)} className="cursor-pointer" size={22} />
              </div>
              <div className="mt-6 space-y-4">
                <label className="space-y-2">
                  <span className="font-medium text-slate-700">Reason for suspension</span>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF] resize-none"
                  />
                  {formErrors.reason && <p className="text-xs text-red-600">{formErrors.reason}</p>}
                </label>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setActivePopup(null)}
                  className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSuspendProvider}
                  disabled={isLoading}
                  className="rounded-2xl bg-[#EF4444] px-5 py-2 text-sm font-semibold text-white hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Suspending...' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'deactivateProvider':
      case 'activateProvider':
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {activePopup === 'deactivateProvider' ? 'Deactivate Provider' : 'Activate Provider'}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {activePopup === 'deactivateProvider'
                      ? 'This will deactivate the provider account.'
                      : 'This will activate the provider account.'}
                  </p>
                </div>
                <FaX onClick={() => setActivePopup(null)} className="cursor-pointer" size={22} />
              </div>
              <div className="mt-6 text-slate-700">
                <p>
                  {activePopup === 'deactivateProvider'
                    ? 'Are you sure you want to deactivate this provider?'
                    : 'Activate this provider and restore access.'}
                </p>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setActivePopup(null)}
                  className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleToggleActive}
                  disabled={isLoading}
                  className={`rounded-2xl px-5 py-2 text-sm font-semibold text-white ${
                    activePopup === 'deactivateProvider' ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#49A5EF] hover:bg-[#3d8ed8]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (activePopup === 'deactivateProvider' ? 'Deactivating...' : 'Activating...') : activePopup === 'deactivateProvider' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        );

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
            onClick={() => {
              resetErrors();
              setActivePopup(button.type);
            }}
            className={`w-full px-3 py-2 text-center text-[17px] uppercase font-medium text-white rounded-[10px] transition ${
              button.type === 'deactivateProvider'
                ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                : button.type === 'activateProvider'
                ? 'bg-[#10B981] hover:bg-[#059669]'
                : button.type === 'suspendProvider'
                ? 'bg-[#F97316] hover:bg-[#EA580C]'
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

export default ProviderActionButtonsHandler;
