'use client';

import React, { useState, useEffect, useRef } from 'react';
import diagnosisData from '@/data/diagnosis-data.json';
import { MdAdd, MdDelete } from 'react-icons/md';

export interface TreatmentItem {
  id: string;
  itemCode: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaCodeFormData {
  providerName: string;
  hmoid: string;
  dateOfEncounter: string;
  careType: string;
  diagnosis: string[];
  treatmentItems: TreatmentItem[];
  requestedBy: string;
}

interface PaCodeFormProps {
  onSubmit: (formData: PaCodeFormData) => void;
  isSubmitting: boolean;
  submissionSuccess?: boolean;
}

const PaCodeForm: React.FC<PaCodeFormProps> = ({ onSubmit, isSubmitting, submissionSuccess }) => {
  const initialFormData: PaCodeFormData = {
    providerName: '',
    hmoid: '',
    dateOfEncounter: '',
    careType: '',
    diagnosis: [],
    treatmentItems: [
      {
        id: '1',
        itemCode: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      }
    ],
    requestedBy: '',
  };

  const [formData, setFormData] = useState<PaCodeFormData>(initialFormData);
  const [providerSearch, setProviderSearch] = useState('');
  const [providerSuggestions, setProviderSuggestions] = useState<Array<{ id?: string; name: string }>>([]);
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerShowSuggestions, setProviderShowSuggestions] = useState(false);
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const diagnosisTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textareaValue, setTextareaValue] = useState((initialFormData.diagnosis || []).join('\n'));
  const [caretPos, setCaretPos] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prefill requestedBy from admin profile on mount (client-side)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/profile', { credentials: 'include' });
        const data = await res.json().catch(() => null);
        const payload = data && data.success && data.data ? data.data : data || {};
        const first = payload.firstName || payload.first_name || payload.name || payload.fullName || '';
        const last = payload.lastName || payload.last_name || '';
        const full = [first, last].filter(Boolean).join(' ').trim();
        if (mounted && full) {
          setFormData(prev => prev.requestedBy ? prev : ({ ...prev, requestedBy: full }));
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Calculate total amount whenever treatment items change
  useEffect(() => {
    const total = formData.treatmentItems.reduce((sum, item) => sum + item.amount, 0);
    // Update the total display (we'll show this in the UI)
  }, [formData.treatmentItems]);

  // update diagnosis suggestions when user types in search box
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

  // keep textareaValue in sync when diagnosis array changes externally
  useEffect(() => {
    setTextareaValue((formData.diagnosis || []).join('\n'));
  }, [formData.diagnosis]);

  const validateField = (name: string, value: any) => {
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
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim())) {
          newErrors.diagnosis = 'Diagnosis is required';
        } else if (Array.isArray(value) && value.length > 5) {
          newErrors.diagnosis = 'You can select up to 5 diagnoses';
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
    if (name === 'diagnosisSearch') {
      setDiagnosisSearch(value);
      validateField('diagnosis', formData.diagnosis);
      setShowSuggestions(true);
      return;
    }

    // providerName search is managed separately; only set search text here
    if (name === 'providerName') {
      setProviderSearch(value);
      setProviderShowSuggestions(true);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // fetch provider suggestions when providerSearch changes (debounced)
  useEffect(() => {
    const term = (providerSearch || '').toString().trim();
    if (!term) {
      setProviderSuggestions([]);
      return;
    }
    let mounted = true;
    const id = setTimeout(async () => {
      setProviderLoading(true);
      try {
        const res = await fetch(`/api/admin/providers?search=${encodeURIComponent(term)}`, { credentials: 'include' });
        const payload = await res.json().catch(() => null);
        const data = payload?.data || payload || [];
        if (!mounted) return;
        let list: any[] = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray((data as any).items)) list = (data as any).items;
        else if (Array.isArray((data as any).data)) list = (data as any).data;
        else list = [];
        let suggestions = list.map((p: any) => ({ id: p.$id || p.id, name: p.name || p.displayName || p.providerName || '' })).filter((p: any) => p.name);
        // match similar to diagnosis: include term anywhere (case-insensitive)
        const termLower = term.toLowerCase();
        suggestions = suggestions.filter((s: any) => s.name.toLowerCase().includes(termLower)).slice(0, 10);
        setProviderSuggestions(suggestions);
        setProviderShowSuggestions(suggestions.length > 0);
      } catch (e) {
        if (!mounted) return;
        setProviderSuggestions([]);
      } finally {
        if (mounted) setProviderLoading(false);
      }
    }, 300);
    return () => { mounted = false; clearTimeout(id); };
  }, [providerSearch]);

  const handleDiagnosisTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const sel = e.target.selectionStart || 0;
    setTextareaValue(val);
    setCaretPos(sel);
    const lines = val.split(/\r?\n/);
    const before = val.slice(0, sel);
    const lineIndex = before.split(/\r?\n/).length - 1;
    setCurrentLineIndex(lineIndex);
    const currentLine = (lines[lineIndex] || '').trim();
    setDiagnosisSearch(currentLine);
    let normalized = lines.map((s) => s.trim()).filter(Boolean);
    // enforce max 5 diagnoses
    if (normalized.length > 5) {
      setErrors((err) => ({ ...err, diagnosis: 'You can select up to 5 diagnoses' }));
      normalized = normalized.slice(0, 5);
      const trimmedVal = normalized.join('\n');
      setTextareaValue(trimmedVal);
      // update caret position to end of trimmed content
      setCaretPos(trimmedVal.length);
      setTimeout(() => {
        const el = diagnosisTextareaRef.current;
        if (el) {
          el.selectionStart = el.selectionEnd = trimmedVal.length;
        }
      }, 0);
    } else {
      setErrors((err) => {
        const next = { ...err };
        delete next.diagnosis;
        return next;
      });
    }
    setFormData((prev) => ({ ...prev, diagnosis: normalized }));
    validateField('diagnosis', normalized);
    setShowSuggestions(true);
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const el = e.target as HTMLTextAreaElement;
    const sel = el.selectionStart || 0;
    setCaretPos(sel);
    const before = el.value.slice(0, sel);
    const lineIndex = before.split(/\r?\n/).length - 1;
    setCurrentLineIndex(lineIndex);
    const lines = el.value.split(/\r?\n/);
    setDiagnosisSearch((lines[lineIndex] || '').trim());
  };

  const insertSuggestion = (value: string) => {
    const lines = textareaValue.split(/\r?\n/);
    const idx = Math.max(0, Math.min(currentLineIndex, lines.length - 1));
    lines[idx] = value;
    // normalize and dedupe while preserving order
    let normalized = lines.map((s) => s.trim()).filter(Boolean);
    const seen = new Set<string>();
    normalized = normalized.filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });
    // enforce max 5
    if (normalized.length > 5) {
      setErrors((err) => ({ ...err, diagnosis: 'You can select up to 5 diagnoses' }));
      normalized = normalized.slice(0, 5);
    } else {
      setErrors((err) => {
        const next = { ...err };
        delete next.diagnosis;
        return next;
      });
    }
    const newVal = normalized.join('\n');
    setTextareaValue(newVal);
    setFormData((prev) => ({ ...prev, diagnosis: normalized }));
    setDiagnosisSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
    // focus and move caret to after inserted text (end of inserted line)
    setTimeout(() => {
      const el = diagnosisTextareaRef.current;
      if (el) {
        el.focus();
        const pos = newVal.length; 
        el.selectionStart = el.selectionEnd = pos;
        setCaretPos(pos);
      }
    }, 0);
  };

  const addDiagnosis = (value: string) => {
    if (!value) return;
    setFormData(prev => {
      const existing = Array.isArray(prev.diagnosis) ? prev.diagnosis : [];
      if (existing.includes(value)) return prev;
      if (existing.length >= 5) {
        setErrors(err => ({ ...err, diagnosis: 'You can select up to 5 diagnoses' }));
        return prev;
      }
      const updated = { ...prev, diagnosis: [...existing, value] };
      validateField('diagnosis', updated.diagnosis);
      return updated;
    });
    setDiagnosisSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeDiagnosis = (value: string) => {
    setFormData(prev => ({ ...prev, diagnosis: (prev.diagnosis || []).filter((d: string) => d !== value) }));
    validateField('diagnosis', (formData.diagnosis || []).filter((d: string) => d !== value));
  };

  const handleTreatmentItemChange = (id: string, field: keyof TreatmentItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      treatmentItems: prev.treatmentItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate amount when quantity or unitPrice changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = (updatedItem.quantity) * (updatedItem.unitPrice);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    validateField('hmoid', formData.hmoid);
    validateField('dateOfEncounter', formData.dateOfEncounter);
    validateField('careType', formData.careType);
    validateField('diagnosis', formData.diagnosis);
    validateField('requestedBy', formData.requestedBy);

    // Check treatment items
    const invalidItems = formData.treatmentItems.filter(
      item => !item.itemCode.trim() || item.quantity <= 0 || item.unitPrice <= 0
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
      const payload = { ...formData, providerName: (formData as any).providerName || '' } as any;
      onSubmit(payload);
    }
  };

  useEffect(() => {
    // run reset on any change to submissionSuccess (toggle from parent)
    if (typeof submissionSuccess !== 'undefined') {
      setIsSubmitted(true);
      setFormData(initialFormData);
      setErrors({});
      setDiagnosisSearch('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [submissionSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#ffffff] rounded-[15px] shadow-sm p-6">
      {/* Basic Information */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HMOID */}
          <div>
            <label htmlFor="providerName" className="block mb-2">
              Provider Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="providerName"
                name="providerName"
                value={providerSearch}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#49A5EF] ${
                  errors.hmoid ? 'border-red-500' : 'border-gray-300'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="Start typing provider name"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); } }}
                  onFocus={() => { if ((providerSearch || '').length >= 1 && providerSuggestions.length > 0) setProviderShowSuggestions(true); }}
                  onBlur={() => setTimeout(() => setProviderShowSuggestions(false), 120)}
              />
              {providerShowSuggestions && providerSuggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-auto border bg-white rounded shadow">
                  {providerSuggestions.map((p) => (
                    <div
                      key={p.id || p.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setProviderSearch(p.name);
                        setFormData(prev => ({ ...prev, providerName: p.name } as any));
                        // attach selected provider id if needed in future
                        setProviderShowSuggestions(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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

          {/* Diagnosis (textarea with suggestions) */}
        <div className="relative">
          <label htmlFor="diagnosis" className="block mb-2">
            Diagnosis
          </label>
          <div
            className={`w-full min-h-21 px-3 py-2 border rounded-lg focus-within:ring-1 focus-within:ring-[#49A5EF] text-sm ${
              errors.diagnosis ? 'border-red-500' : 'border-gray-300'
            } bg-white`}
            onClick={() => {
              const el = document.getElementById('diagnosis-input') as HTMLInputElement | null;
              el?.focus();
            }}
          >
            <div className="flex flex-wrap items-center gap-2">
              {(formData.diagnosis || []).map((d) => (
                <span key={d} className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full text-sm">
                  <span title={d} className="capitalize max-w-45 truncate block">{d}</span>
                  <button type="button" onClick={() => removeDiagnosis(d)} className="text-red-500">×</button>
                </span>
              ))}

              <input
                id="diagnosis-input"
                name="diagnosisSearch"
                value={diagnosisSearch}
                onChange={(e) => {
                  setDiagnosisSearch(e.target.value);
                  validateField('diagnosis', formData.diagnosis);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  // Prevent Enter from accepting freeform diagnosis entries or submitting the form.
                  if (e.key === 'Enter') {
                    e.preventDefault();
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

        <div className="overflow-auto p-4 space-y-2 max-h-90 custom-scrollbar">
          <table className="w-full border-collapse">
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
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.itemCode}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'itemCode', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="Enter item code"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'quantity', parseInt(e.target.value))}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'unitPrice', parseFloat(e.target.value))}
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