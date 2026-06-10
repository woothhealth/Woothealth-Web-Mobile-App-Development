'use client';

import React, { useState, useEffect, useRef } from 'react';
import diagnosisData from '@/data/diagnosis-data.json';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { PaCodeFormData, TreatmentItem } from './page';
import { useProviderProfiles } from '@/lib/providerUserProfile';

interface PaCodeFormProps {
  onSubmit: (formData: PaCodeFormData) => void;
  isSubmitting: boolean;
  providerType?: string;
  providerTier?: string;
}

const PaCodeForm: React.FC<PaCodeFormProps> = ({ onSubmit, isSubmitting, providerType, providerTier }) => {
  const [formData, setFormData] = useState<PaCodeFormData>({
    hmoid: '',
    dateOfEncounter: '',
    careType: '',
    diagnosis: '',
    treatmentItems: [
      {
        id: '1',
        item: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        itemCode: '',
      }
    ],
    requestedBy: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [diagnosisList, setDiagnosisList] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [tariffsLoading, setTariffsLoading] = useState(false);
  const { data: providerProfileResp, isLoading: providerProfileLoading } = useProviderProfiles();
  const providerProfile = providerProfileResp?.data || providerProfileResp;
  const [itemSearchMap, setItemSearchMap] = useState<Record<string, string>>({});
  const [itemSuggestionsMap, setItemSuggestionsMap] = useState<Record<string, any[]>>({});
  const [showItemSuggestionsMap, setShowItemSuggestionsMap] = useState<Record<string, boolean>>({});
  const [itemSuggestionsLoadingMap, setItemSuggestionsLoadingMap] = useState<Record<string, boolean>>({});

  // Calculate total amount whenever treatment items change
  useEffect(() => {
    const total = formData.treatmentItems.reduce((sum, item) => sum + item.amount, 0);
    // Update the total display (we'll show this in the UI)
  }, [formData.treatmentItems]);

  // Fetch tariffs for suggestions
  useEffect(() => {
    let mounted = true;
    const fetchTariffs = async () => {
      setTariffsLoading(true);
      try {
        const res = await fetch('/api/pr/tariff', { credentials: 'include' });
        const payload = await res.json().catch(() => null);
        const data = payload?.data || payload;

        const rawList: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
          ? data.data
          : [];

          const resolvedProviderType = (providerType || providerProfile?.type || providerProfile?.providerType || '').toString().trim().toLowerCase();
          const tierSourceRaw = (providerTier || providerProfile?.tier || providerProfile?.planTier || '').toString().trim();
          const resolvedTier = tierSourceRaw.replace(/^tier\s*/i, '').replace(/^price\s*/i, '').replace(/\s+/g, '').replace(/\+/g, 'Plus');

        const buildTierKeys = (t: string) => {
          if (!t) return [] as string[];
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

        const tierCandidates = buildTierKeys(resolvedTier);
        const nestedKeys = ['itemCode', 'prices', 'price', 'tiers', 'amounts', 'rates'];

        const findAmount = (t: any) => {
          if (!t) return null;
          for (const k of tierCandidates) {
            if (t[k] != null) return t[k];
          }
          for (const nk of nestedKeys) {
            const obj = t[nk];
            if (obj && typeof obj === 'object') {
              for (const k of tierCandidates) {
                if (obj[k] != null) return obj[k];
              }
              if (resolvedTier && obj[resolvedTier] != null) return obj[resolvedTier];
              const vals = Object.values(obj).filter((v) => v != null && (typeof v === 'number' || !Number.isNaN(Number(v))));
              if (vals.length > 0) return vals[0];
            }
          }
          if (t.amount != null) return t.amount;
          if (t.price != null) return t.price;
          const vals = Object.values(t).filter((v) => v != null && (typeof v === 'number' || !Number.isNaN(Number(v))));
          if (vals.length > 0) return vals[0];
          return null;
        };

        const items: any[] = rawList.map((t) => {
          const name = t.serviceName || t.service_name || t.procedureName || t.procedure_name || t.itemName || t.name || t.item_name || t.description || t.service || '';
          const code = t.code || t.item || t.serviceCode || t.procedureCode || '';
          const itemCode = t.itemCode || '';
          const amount = findAmount(t);
          const searchText = `${(name || '')} ${(code || '')} ${(itemCode || '')}`.toString().toLowerCase();
          return { name, code, itemCode, amount, raw: t, searchText };
        }).filter(i => i.name);

        // Filter by provider type (if available) and ensure amount exists
        const filtered = items.filter((i) => {
          const t = i.raw || {};
          const tProviderType = ((t.providerType || t.provider_type || t.type) || '').toString().trim().toLowerCase();
          if (resolvedProviderType && tProviderType && tProviderType !== resolvedProviderType) return false;
          return i.amount != null;
        });
        if (mounted) setTariffs(filtered);
      } catch (err) {
        if (!mounted) return;
        setTariffs([]);
      } finally {
        if (mounted) setTariffsLoading(false);
      }
    };

    fetchTariffs();
    return () => { mounted = false; };
  }, [providerType, providerTier, providerProfileResp]); // include provider meta as deps

  // update diagnosis suggestions when user types
  useEffect(() => {
    const term = (diagnosisSearch || '').toString().trim().toLowerCase();
    if (!term || term.length < 1) {
      setSuggestions([]);
      return;
    }
    try {
      const items = (diagnosisData as any[])
        .map((d) => (d.searchText || '').toString())
        .filter(Boolean)
        .map((raw) => {
          const parts = raw.split(/\s+/);
          const name = parts.length > 1 ? parts.slice(1).join(' ') : raw;
          return { raw, name };
        })
        .filter(({ raw, name }) => raw.toLowerCase().includes(term) || name.toLowerCase().includes(term));
      const uniq = Array.from(new Set(items.map((i) => i.name))).slice(0, 10);
      setSuggestions(uniq);
    } catch (err) {
      setSuggestions([]);
    }
  }, [diagnosisSearch]);

  // keep formData.diagnosis in sync with diagnosisList
  useEffect(() => {
    setFormData((prev) => ({ ...prev, diagnosis: diagnosisList.join('\n') }));
    // clear error when list valid
    if (diagnosisList.length <= 5) {
      setErrors((err) => {
        const next = { ...err };
        delete next.diagnosis;
        return next;
      });
    }
  }, [diagnosisList]);

  const validateField = (name: string, value: string | number) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'hmoid':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.hmoid = 'HMOID is required';
        } else {
          delete newErrors.hmoid;
        }
        break;
      case 'dateOfEncounter':
        if (!value) {
          newErrors.dateOfEncounter = 'Date of encounter is required';
        } else {
          delete newErrors.dateOfEncounter;
        }
        break;
      case 'careType':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.careType = 'Care type is required';
        } else {
          delete newErrors.careType;
        }
        break;
      case 'diagnosis':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.diagnosis = 'Diagnosis is required';
        } else {
          delete newErrors.diagnosis;
        }
        break;
      case 'requestedBy':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.requestedBy = 'Requested by is required';
        } else {
          delete newErrors.requestedBy;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'diagnosis') {
      // legacy single-line diagnosis input - keep in sync
      setFormData(prev => ({ ...prev, [name]: value }));
      setDiagnosisSearch(value);
      setShowSuggestions(true);
      validateField(name, value);
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleItemSearchChange = (id: string, value: string) => {
    setItemSearchMap(prev => ({ ...prev, [id]: value }));
    // update item live for display
    setFormData(prev => ({
      ...prev,
      treatmentItems: prev.treatmentItems.map(item => item.id === id ? { ...item, item: value } : item)
    }));

    if (!value || value.trim().length === 0) {
      setItemSuggestionsMap(prev => ({ ...prev, [id]: [] }));
      setShowItemSuggestionsMap(prev => ({ ...prev, [id]: false }));
      setItemSuggestionsLoadingMap(prev => ({ ...prev, [id]: false }));
      return;
    }

    // mark this row as loading suggestions
    setItemSuggestionsLoadingMap(prev => ({ ...prev, [id]: true }));

    const q = value.toLowerCase();
    if (tariffsLoading) {
      // wait for tariffs to load; suggestions will be populated in effect below
      setItemSuggestionsMap(prev => ({ ...prev, [id]: [] }));
      setShowItemSuggestionsMap(prev => ({ ...prev, [id]: true }));
      return;
    }

    const matches = tariffs.filter(t => (t.searchText || t.name || '').toString().toLowerCase().includes(q)).slice(0, 8);
    setItemSuggestionsMap(prev => ({ ...prev, [id]: matches }));
    setShowItemSuggestionsMap(prev => ({ ...prev, [id]: true }));
    setItemSuggestionsLoadingMap(prev => ({ ...prev, [id]: false }));
  };

  // When tariffs finish loading or change, recompute suggestions for any active search rows
  useEffect(() => {
    if (tariffsLoading) return;
    const activeIds = Object.keys(itemSearchMap || {});
    activeIds.forEach((id) => {
      const q = (itemSearchMap[id] || '').toString().trim().toLowerCase();
      if (!q) {
        setItemSuggestionsMap(prev => ({ ...prev, [id]: [] }));
        setItemSuggestionsLoadingMap(prev => ({ ...prev, [id]: false }));
        return;
      }
      const matches = tariffs.filter(t => (t.searchText || t.name || '').toString().toLowerCase().includes(q)).slice(0, 8);
      setItemSuggestionsMap(prev => ({ ...prev, [id]: matches }));
      setShowItemSuggestionsMap(prev => ({ ...prev, [id]: true }));

      // Autofill logic: exact name/code match or unique match
      const exact = matches.find(m => (m.name || '').toString().toLowerCase() === q || (m.code || '').toString().toLowerCase() === q);
      if (exact) {
        const price = Number(exact.amount) || 0;
        setFormData(prev => ({
          ...prev,
          treatmentItems: prev.treatmentItems.map(item => item.id === id ? { ...item, item: exact.name || item.item, itemCode: exact.itemCode || exact.code || item.itemCode || '', unitPrice: price, amount: (item.quantity || 1) * price } : item)
        }));
        setItemSuggestionsLoadingMap(prev => ({ ...prev, [id]: false }));
        return;
      }

      if (matches.length === 1) {
        const single = matches[0];
        const price = Number(single.amount) || 0;
        setFormData(prev => ({
          ...prev,
          treatmentItems: prev.treatmentItems.map(item => item.id === id ? { ...item, item: single.name || item.item, itemCode: single.itemCode || single.code || item.itemCode || '', unitPrice: price, amount: (item.quantity || 1) * price } : item)
        }));
      }

      setItemSuggestionsLoadingMap(prev => ({ ...prev, [id]: false }));
    });
  }, [tariffs, tariffsLoading]);

  const selectItemSuggestion = (id: string, suggestion: any) => {
    setFormData(prev => ({
      ...prev,
      treatmentItems: prev.treatmentItems.map(item => {
        if (item.id !== id) return item;
        const qty = item.quantity || 1;
        const unitPrice = Number(suggestion.amount) || 0;
        return { ...item, item: suggestion.name, itemCode: suggestion.itemCode || suggestion.code || item.itemCode || '', unitPrice, amount: unitPrice * qty };
      })
    }));
    setItemSearchMap(prev => ({ ...prev, [id]: '' }));
    setItemSuggestionsMap(prev => ({ ...prev, [id]: [] }));
    setShowItemSuggestionsMap(prev => ({ ...prev, [id]: false }));
  };

  const addDiagnosis = (value: string) => {
    if (!value) return;
    setDiagnosisSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    setDiagnosisList(prev => {
      const existing = prev || [];
      if (existing.includes(value)) return existing;
      if (existing.length >= 5) {
        setErrors(err => ({ ...err, diagnosis: 'You can select up to 5 diagnoses' }));
        return existing;
      }
      return [...existing, value];
    });
  };

  const removeDiagnosis = (value: string) => {
    setDiagnosisList(prev => prev.filter((d) => d !== value));
  };

  const handleTreatmentItemChange = (id: string, field: keyof TreatmentItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      treatmentItems: prev.treatmentItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate amount when quantity or unitPrice changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.unitPrice || 0);
          }

          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addTreatmentItem = () => {
    const newItem: TreatmentItem = {
      id: Date.now().toString(),
      item: '',
      itemCode: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };

    setFormData(prev => ({
      ...prev,
      treatmentItems: [...prev.treatmentItems, newItem]
    }));
  };

  const removeTreatmentItem = (id: string) => {
    if (formData.treatmentItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        treatmentItems: prev.treatmentItems.filter(item => item.id !== id)
      }));
    }
  };

  const calculateTotalAmount = () => {
    return formData.treatmentItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const formatUnitPrice = (price: number) => {
    return price > 0 ? `₦${price.toLocaleString()}` : '';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const fieldsToValidate = ['hmoid', 'dateOfEncounter', 'careType', 'diagnosis', 'requestedBy'];
    fieldsToValidate.forEach(field => validateField(field, formData[field as keyof PaCodeFormData] as string));

    // Check treatment items
    const invalidItems = formData.treatmentItems.filter(
      item => !item.item.trim() || item.quantity <= 0 || item.unitPrice <= 0
    );

    if (invalidItems.length > 0) {
      setErrors(prev => ({ ...prev, treatmentItems: 'Please fill in all treatment item fields with valid values' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.treatmentItems;
        return newErrors;
      });
    }

    // If no errors, submit
    if (Object.keys(errors).length === 0 && invalidItems.length === 0) {
      // Build backend-shaped payload
      const total = calculateTotalAmount();
      const treatmentItemsPayload = formData.treatmentItems.map((item) => ({
        id: item.id,
        item: item.item || '',
        itemCode: item.itemCode || '',
        description: item.item || '',
        quantity: item.quantity || 1,
        unitPrice: Number(item.unitPrice) || 0,
        amount: Number(item.amount) || ((item.quantity || 1) * (Number(item.unitPrice) || 0)),
      }));

      const tariffCode = (treatmentItemsPayload[0]?.item) || '';
      const tierSourceRaw = (providerTier || providerProfile?.tier || providerProfile?.planTier || '').toString().trim();
      const resolvedTier = tierSourceRaw.replace(/^tier\s*/i, '').replace(/^price\s*/i, '').replace(/\s+/g, '').replace(/\+/g, 'Plus') || '';
      const priceSample = (treatmentItemsPayload[0]?.unitPrice) || total || 0;

      const diagnosisField = `${formData.diagnosis || ''}\n\n[AUTHORIZATION REQUEST DETAILS]\nTariff Code: ${tariffCode}\nTier: ${resolvedTier}\nPrice: ${Number(priceSample).toFixed(2)}`;

      const payload = {
        authorizationCode: '',
        policyNumber: '',
        diagnosis: diagnosisField,
        providerName: providerProfile?.data?.name || providerProfile?.name || providerProfile?.providerName || '',
        createdDate: new Date().toISOString(),
        source: 'provider',
        patientId: formData.hmoid || '',
        providerId: providerProfile?.data?.providerId || providerProfile?.providerId || providerProfile?.id || '',
        providerTier: resolvedTier || providerTier || providerProfile?.tier || '',
        patientPlan: '',
        patientsBenefits: [],
        status: 'pending',
        bookingId: '',
        assignedAgent: formData.requestedBy || '',
        totalAmount: total,
        treatmentItems: treatmentItemsPayload,
        careType: formData.careType || null,
      };

      const finalPayload = {
        ...formData,
        // backend-oriented fields
        ...payload,
      };

      console.log('[PaCodeForm] submitting payload', finalPayload);
      onSubmit(finalPayload as PaCodeFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#ffffff] rounded-[15px] shadow-sm p-6">
      {/* Basic Information */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HMOID */}
          <div>
            <label htmlFor="hmoid" className="block mb-2">
              HMOID
            </label>
            <input
              type="text"
              id="hmoid"
              name="hmoid"
              value={formData.hmoid}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#49A5EF] ${
                errors.hmoid ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter HMOID"
            />
            {errors.hmoid && <p className="mt-1 text-sm text-red-600">{errors.hmoid}</p>}
          </div>

          {/* Date of Encounter */}
          <div>
            <label htmlFor="dateOfEncounter" className="block mb-2">
              Date of Encounter *
            </label>
            <input
              type="date"
              id="dateOfEncounter"
              name="dateOfEncounter"
              value={formData.dateOfEncounter}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#49A5EF] ${
                errors.dateOfEncounter ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {errors.dateOfEncounter && <p className="mt-1 text-sm text-red-600">{errors.dateOfEncounter}</p>}
          </div>

          {/* Care Type */}
          <div>
            <label htmlFor="careType" className="block mb-2">
              Care Type *
            </label>
            <select
              id="careType"
              name="careType"
              value={formData.careType}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#49A5EF] ${
                errors.careType ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">Select care type</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Surgical">Surgical</option>
              <option value="Medical">Medical</option>
              <option value="Diagnostic">Diagnostic</option>
            </select>
            {errors.careType && <p className="mt-1 text-sm text-red-600">{errors.careType}</p>}
          </div>

          {/* Diagnosis */}
        <div className="relative">
          <label htmlFor="diagnosis" className="block mb-2">
            Diagnosis *
          </label>
          <div
            className={`w-full min-h-21 px-3 py-2 border rounded-lg focus-within:ring-1 focus-within:ring-[#49A5EF] text-sm ${
              errors.diagnosis ? 'border-red-500' : 'border-gray-300'
            } bg-white`}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex flex-wrap items-center gap-2">
              {diagnosisList.map((d) => (
                <span key={d} className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-sm">
                  <span title={d} className="capitalize max-w-55 truncate block">{d}</span>
                  <button type="button" onClick={() => removeDiagnosis(d)} className="text-red-500">×</button>
                </span>
              ))}

              <input
                ref={inputRef}
                id="diagnosis-input"
                name="diagnosis"
                value={diagnosisSearch}
                onChange={(e) => {
                  setDiagnosisSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (diagnosisSearch.trim()) addDiagnosis(diagnosisSearch.trim());
                  }
                }}
                disabled={isSubmitting}
                className="flex-1 min-w-30 px-1 py-2 outline-none text-sm"
                placeholder="Type to search diagnosis"
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                onFocus={() => { if ((diagnosisSearch || '').length >= 1) setShowSuggestions(true); }}
              />
            </div>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute mt-2 max-h-44 w-full overflow-auto border border-gray-200 rounded bg-white shadow z-50">
              {suggestions.map((s) => (
                <div
                  key={s}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addDiagnosis(s);
                  }}
                  className="px-3 capitalize py-2 hover:bg-gray-100 cursor-pointer text-[15px]"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
          {errors.diagnosis && <p className="mt-1 text-sm text-red-600">{errors.diagnosis}</p>}
        </div>
        </div>
      </div>

      {/* Treatment Description & Services Rendered */}
      <div className="border border-[#D9D9D9] rounded-[15px]">
        <div className="p-4 border-b border-[#D9D9D9]">
          <h2 className="text-lg font-semibold">Treatment Description & Services Rendered</h2>
        </div>

        <div className="overflow-auto p-4 space-y-2 h-fit custom-scrollbar">
          <table className="w-full border-collapse">
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-[#D9D9D9]">
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Item</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Quantity</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Unit Price</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Amount</th>
                <th className="px-4 py-3 text-center text-[15px] font-semibold border-b border-[#D9D9D9]">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.treatmentItems.map((item, index) => (
                <tr key={item.id} className="divide-y divide-[#D9D9D9] text-sm">
                  <td className="px-4 py-3 relative">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => handleItemSearchChange(item.id, e.target.value)}
                      onBlur={() => setTimeout(() => setShowItemSuggestionsMap(prev => ({ ...prev, [item.id]: false })), 120)}
                      onFocus={() => { if ((itemSearchMap[item.id] || item.item || '').toString().length >= 1) setShowItemSuggestionsMap(prev => ({ ...prev, [item.id]: true })); }}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="Enter item"
                    />
                    {showItemSuggestionsMap[item.id] && (itemSuggestionsLoadingMap[item.id] || (Array.isArray(itemSuggestionsMap[item.id]) && itemSuggestionsMap[item.id].length > 0)) && (
                      <div className="absolute left-0 right-0 mt-1 z-50 max-h-48 w-full overflow-auto bg-white border border-gray-200 rounded shadow">
                        {itemSuggestionsLoadingMap[item.id] ? (
                          <div className="px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Loading...
                          </div>
                        ) : (Array.isArray(itemSuggestionsMap[item.id]) && itemSuggestionsMap[item.id].length > 0) ? (
                          itemSuggestionsMap[item.id].map((s) => (
                            <div
                              key={s.name + (s.code || '')}
                              onMouseDown={(e) => { e.preventDefault(); selectItemSuggestion(item.id, s); }}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              <div className="font-medium">{s.name}</div>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-600">No matches</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-700"
                    />
                  </td>
                  <td className="px-4 py-3 text-center border-b border-[#D9D9D9]">
                    {formData.treatmentItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTreatmentItem(item.id)}
                        disabled={isSubmitting}
                        className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addTreatmentItem}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-2 py-1 text-xs bg-transparent hover:bg-blue-200 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed border rounded-[10px] border-[#D9D9D9]"
          >
            <MdAdd size={20} />
            Add Item
          </button>
          {errors.treatmentItems && <p className="mt-4 text-sm text-red-600">{errors.treatmentItems}</p>}
        </div>

        {/* Total Billed Amount */}
        <div className="flex justify-end border-t border-[#D9D9D9] p-4">
          <div className="px-4 py-3 rounded-[15px] border border-[#D9D9D9] flex items-center space-x-4">
            <h2 className="text-sm text-gray-600">Total Billed Amount</h2>
            <div className="text-xl font-bold border border-[#D9D9D9] rounded-[10px] px-2 py-1">
              ₦{calculateTotalAmount().toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

       {/* Requested By */}
          <div>
            <label htmlFor="requestedBy" className="block mb-2">
              Requested By *
            </label>
            <input
              type="text"
              id="requestedBy"
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#49A5EF] ${
                errors.requestedBy ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter requester name"
            />
            {errors.requestedBy && <p className="mt-1 text-sm text-red-600">{errors.requestedBy}</p>}
          </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#49A5EF] text-white font-semibold rounded-lg hover:bg-[#49A5EF]/90 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Request PA Code'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaCodeForm;