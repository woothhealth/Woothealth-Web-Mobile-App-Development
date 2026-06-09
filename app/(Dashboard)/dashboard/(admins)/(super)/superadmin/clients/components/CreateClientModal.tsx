'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Client } from '../mock-clients';
import { FaTimes, FaUser } from 'react-icons/fa';
import { MdOutlineFileDownload } from 'react-icons/md';

interface CreateClientModalProps {
  onClose: () => void;
  onCreate?: (client: Omit<Client, 'id' | 'registrationDate'>) => void;
}

export function CreateClientModal({ onClose, onCreate }: CreateClientModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    status: 'Active' as Client['status'],
    clientType: 'Business' as Client['planType'],
    email: '',
    planType: 'Business' as Client['planType'],
    phone: '',
    registrationDate: new Date().toISOString().split('T')[0], // Default to today
    clientAddress: '',
    employees: 1,
    plan: '',
    enrollmentDate: '',
    expiryDate: '',
    autoBilling: 'Yes',
    nationality: '',
    profile_pic: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkPreview, setBulkPreview] = useState('');
  const [bulkUsers, setBulkUsers] = useState<any[] | null>(null);
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Client name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.registrationDate.trim()) newErrors.registrationDate = 'Registration date is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.clientAddress.trim()) newErrors.clientAddress = 'Client address is required';
    if (formData.employees <= 0) newErrors.employees = 'Number of employees must be a positive integer';
    if (!formData.plan.trim()) newErrors.plan = 'Plan is required';
    if (!formData.enrollmentDate.trim()) newErrors.enrollmentDate = 'Enrollment date is required';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }
    // debug: indicate submission started
    // eslint-disable-next-line no-console
    console.log('CreateClientModal.handleSubmit start', { bulkFile, formData });
    toast('Submitting...');
    setUploading(true);
    try {
      // Always create the client first (file upload is optional)
      const planType = (formData.planType || formData.clientType || '').toString().toLowerCase();
      const role = planType === 'business' ? 'business' : 'retail';

      // derive firstName/lastName from companyName if necessary
      let derivedFirst = (formData as any).firstName || '';
      let derivedLast = (formData as any).lastName || '';
      if (!derivedFirst && !derivedLast && formData.companyName && formData.companyName.includes(' ')) {
        const parts = formData.companyName.trim().split(/\s+/);
        derivedFirst = parts.shift() || '';
        derivedLast = parts.join(' ');
      }

      const payload: any = {
        companyName: formData.companyName,
        email: formData.email,
        password: (formData as any).password || generatePassword(),
        firstName: derivedFirst || formData.companyName || '',
        lastName: derivedLast || '',
        role,
        meta: {
          companyName: formData.companyName,
          phone: formData.phone,
          registrationDate: formData.registrationDate,
          clientAddress: formData.clientAddress,
          employees: formData.employees,
          plan: formData.plan,
          enrollmentDate: formData.enrollmentDate,
          expiryDate: formData.expiryDate,
          autoBilling: formData.autoBilling,
          nationality: formData.nationality,
        },
      };

      // create client
      // eslint-disable-next-line no-console
      console.log('Creating client payload', payload);
      const createRes = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const createText = await createRes.text();
      let createData: any = createText;
      try { createData = JSON.parse(createText); } catch (e) { /* not json */ }

      if (!createRes.ok || (createData && createData.success === false)) {
        console.error('Create client failed', createRes.status, createData || createText);

        // If 409 conflict (user exists), try to locate existing client by email and continue
        if (createRes.status === 409) {
          toast.error((createData && (createData.message || createData.error)) || 'User already exists. Attempting to locate existing client...');
          try {
            const listRes = await fetch('/api/admin/clients');
            const listText = await listRes.text();
            let listData: any = listText;
            try { listData = JSON.parse(listText); } catch (e) { /* not json */ }

            const items = (listData && listData.data) ? listData.data : (Array.isArray(listData) ? listData : []);
            const match = Array.isArray(items) ? items.find((it: any) => String(it.email || '').toLowerCase() === String(formData.email || '').toLowerCase()) : null;
            if (match) {
              // derive id like before and continue
              const existingId = String(match.id || match._id || match['$id'] || match.clientId || match.businessId || '');
              if (existingId) {
                // set businessId and continue to CSV upload path
                // eslint-disable-next-line no-console
                console.log('Found existing client id for email, will attach as businessId:', existingId);
                // attach businessId to bulk rows below by setting createdClient variable
                // reuse createdClient variable to hold match object
                // @ts-ignore
                createData = { data: match };
              } else {
                toast.error('Existing client found but could not derive id; please check backend.');
                setUploading(false);
                return;
              }
            } else {
              toast.error('User already exists but could not locate the client by email.');
              setUploading(false);
              return;
            }
          } catch (e) {
            console.error('Failed to locate existing client after 409:', e);
            toast.error('User exists and locating existing client failed');
            setUploading(false);
            return;
          }
        } else {
          toast.error((createData && (createData.message || createData.error)) || 'Failed to create client');
          setUploading(false);
          return;
        }
      }

      // client created successfully
      const createdClient = (createData && createData.data) ? createData.data : createData;
      toast.success(`Client "${formData.companyName}" created successfully`);

      // derive businessId from created client (support several possible id fields)
      let businessId = '';
      if (createdClient !== null && createdClient !== undefined) {
        if (typeof createdClient === 'string' || typeof createdClient === 'number') {
          businessId = String(createdClient);
        } else if (typeof createdClient === 'object') {
          businessId = String(
            createdClient.id || createdClient._id || createdClient['$id'] || createdClient.clientId || createdClient.businessId ||
            (createdClient.data && (createdClient.data.id || createdClient.data._id || createdClient.data['$id'])) || ''
          );
        }
      }

      // If CSV was provided, attempt to upload parsed rows as additional clients/users
      if (bulkFile) {
        if (!bulkUsers || bulkUsers.length === 0) {
          toast.error('No users parsed from CSV. Client created without CSV rows.');
          // inform parent to refresh
          if (onCreate) {
            try { await onCreate(createdClient); } catch (e) { console.error('onCreate callback failed', e); }
          }
          // reset bulk file state and close
          setBulkFile(null);
          setBulkFileName('');
          setBulkPreview('');
          setBulkUsers(null);
          onClose();
          return;
        }

        // Map parsed CSV rows into the precise API `clients` array shape expected by backend
        const clients = bulkUsers.map((u: Record<string, string>) => {
          const lc: Record<string, string> = {};
          Object.keys(u).forEach(k => { lc[k.trim().toLowerCase()] = u[k]; });

          const planType = (lc.plan || lc.plantype || lc.clienttype || lc.type || '').toString().toLowerCase();
          const csvRole = (lc.role || lc.userrole || lc.accounttype || lc.role_type || '').toString().toLowerCase();
          const rowRole = csvRole ? csvRole : (planType === 'business' ? 'business' : 'retail');

          let enrollees: any[] | undefined = undefined;
          if (lc.enrollees) {
            try {
              const parsed = JSON.parse(lc.enrollees);
              if (Array.isArray(parsed)) {
                enrollees = parsed.map((e: any) => ({
                  email: e.email,
                  password: e.password || generatePassword(lc.companyname || lc.company || lc.name || ''),
                  firstName: e.firstName || e.firstname || '',
                  lastName: e.lastName || e.lastname || '',
                }));
              }
            } catch (e) { /* ignore */ }
          }

          const clientObj: any = {
            email: lc.email || '',
            password: lc.password || generatePassword(lc.companyname || lc.company || lc.name || ''),
            firstName: lc.firstname || lc.firstname || lc.name || '',
            lastName: lc.lastname || lc.lastname || lc.name || '',
            role: rowRole,
          };

          const companyField = (lc.companyname || lc.company || lc.name || '').toString().trim();
          if (!clientObj.firstName && !clientObj.lastName && companyField.includes(' ')) {
            const parts = companyField.split(/\s+/);
            clientObj.firstName = parts.shift() || '';
            clientObj.lastName = parts.join(' ');
          }

          if (enrollees && enrollees.length > 0) clientObj.enrollees = enrollees;
          return clientObj;
        });

        // Attach businessId to each CSV row if available so backend knows these belong to the created business
        if (businessId) {
          clients.forEach(c => { c.businessId = businessId; });
        }

        // send bulk clients payload
        // eslint-disable-next-line no-console
        console.log('Sending CSV rows as clients payload', { clients });
        const bulkRes = await fetch('/api/admin/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clients }),
          credentials: 'include',
        });

        const bulkText = await bulkRes.text();
        let bulkData: any = bulkText;
        try { bulkData = JSON.parse(bulkText); } catch (e) { /* not json */ }

        if (bulkData && bulkData.success === false) {
          toast.error(bulkData.message || 'CSV upload failed');
          console.error('Bulk upload failed data:', bulkData);
          setUploading(false);
          return; // keep modal open for fixes
        }

        if (bulkData && bulkData.results && typeof bulkData.results === 'object') {
          const succ = Number(bulkData.results.success || 0);
          const fail = Number(bulkData.results.failure || 0);
          if (fail > 0) {
            toast.error(`CSV upload: ${succ} succeeded, ${fail} failed`);
            console.error('Bulk upload row errors:', bulkData.results.errors || bulkData);
            setUploading(false);
            return; // keep modal open
          }
          // all good
          toast.success(bulkData.message || 'CSV rows uploaded');
          // inform parent to refresh
          if (onCreate) {
            try { await onCreate(createdClient); } catch (e) { console.error('onCreate callback failed', e); }
          }
          setBulkFile(null);
          setBulkFileName('');
          setBulkPreview('');
          setBulkUsers(null);
          onClose();
          return;
        }

        if (!bulkRes.ok) {
          console.error('Bulk upload HTTP error', bulkRes.status, bulkText);
          toast.error('CSV upload failed');
          setUploading(false);
          return;
        }

        toast.success('CSV rows uploaded');
        if (onCreate) {
          try { await onCreate(createdClient); } catch (e) { console.error('onCreate callback failed', e); }
        }
        setBulkFile(null);
        setBulkFileName('');
        setBulkPreview('');
        setBulkUsers(null);
        onClose();
        return;
      }

      // no CSV provided, close modal after successful client create
      if (onCreate) {
        try { await onCreate(createdClient); } catch (e) { console.error('onCreate callback failed', e); }
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  // generate a password tailored to `companyName` with at least 1 uppercase, 1 lowercase and 1 digit
  // max length capped at 10 characters. If `companyName` is provided, incorporate its characters.
  const generatePassword = (companyName = '', len = 10) => {
    const maxLen = Math.min(10, Math.max(4, len));
    const clean = String(companyName || '').replace(/[^a-zA-Z0-9]/g, '');

    const randLower = () => String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const randUpper = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randDigit = () => String.fromCharCode(48 + Math.floor(Math.random() * 10));
    const randAny = () => {
      const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return pool.charAt(Math.floor(Math.random() * pool.length));
    };

    // determine target length: prefer companyName length + 2, but at least 6 and at most maxLen
    const targetLen = Math.min(maxLen, Math.max(6, Math.min(10, (clean.length > 0 ? Math.min(10, clean.length + 2) : 8))));

    const parts: string[] = [];

    if (clean.length > 0) {
      // start with first char of companyName uppercased
      parts.push(clean.charAt(0).toUpperCase());
      if (clean.length > 1) parts.push(clean.charAt(1).toLowerCase());
    } else {
      // fallback seeds
      parts.push(randUpper());
      parts.push(randLower());
    }

    // ensure we have at least one digit
    parts.push(randDigit());

    // fill remaining with random allowed chars
    while (parts.join('').length < targetLen) {
      parts.push(randAny());
    }

    // shuffle to avoid predictable order while keeping required characters
    const arr = parts.join('').slice(0, targetLen).split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }

    // final safety checks: ensure at least one upper, one lower, one digit
    let pwd = arr.join('');
    if (!/[A-Z]/.test(pwd)) pwd = randUpper() + pwd.slice(1);
    if (!/[a-z]/.test(pwd)) pwd = pwd.slice(0, 1) + randLower() + pwd.slice(2);
    if (!/\d/.test(pwd)) pwd = pwd.slice(0, 2) + randDigit() + pwd.slice(3);

    return pwd.slice(0, targetLen);
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
        <div className='absolute inset-0 cursor-pointer' onClick={onClose}/>
      <div className="w-full md:w-3xl rounded-[15px] bg-white px-4 py-6 md:p-6 shadow-xl max-h-[90vh] overflow-y-hidden z-20">
        <div className="flex items-start justify-between pb-2">
            <div>
                <h2 className="text-xl font-semibold">Create New Client</h2>
                <p className="mt-1 text-sm text-slate-600">Fill in the details to add a new client</p>
            </div>
            <button onClick={onClose} className="">
              <FaTimes size={20} />
            </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }} className="py-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">  
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
                  reader.onload = () => {
                    setFormData(prev => ({ ...prev, profile_pic: reader.result as string }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label htmlFor="client-logo-upload" className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-border bg-slate-50 text-sm hover:bg-slate-100 overflow-hidden">
              {formData.profile_pic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.profile_pic} alt="client" className="h-full w-full object-cover" />
              ) : (
                <FaUser size={24} />
              )}
            </label>
            <p className="mt-1">Upload profile_pic</p>
          </div>
        <div className="mt-6 space-y-4">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block font-medium text-slate-700">Client Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Enter client name"
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
            </div>
            <div>
              <label className="block font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Enter Email address"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block font-medium text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="block font-medium text-slate-700">Registration Date</label>
              <input
                type="date"
                value={formData.registrationDate}
                onChange={(e) => handleChange('registrationDate', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Enter Date of Registration"
              />
              {errors.registrationDate && <p className="mt-1 text-xs text-red-500">{errors.registrationDate}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block font-medium text-slate-700">Plan</label>
              <input
                type="text"
                value={formData.plan}
                onChange={(e) => handleChange('plan', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
              />
              {errors.plan && <p className="mt-1 text-xs text-red-500">{errors.plan}</p>}
            </div>
            <div>
              <label className="block font-medium text-slate-700">Client Address</label>
              <input
                type="text"
                value={formData.clientAddress}
                onChange={(e) => handleChange('clientAddress', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Enter client address"
              />
              {errors.clientAddress && <p className="mt-1 text-xs text-red-500">{errors.clientAddress}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block font-medium text-slate-700">Employees</label>
              <input
                type="text"
                value={formData.employees}
                onChange={(e) => handleChange('employees', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder=""
              />
              {errors.employees && <p className="mt-1 text-xs text-red-500">{errors.employees}</p>}
            </div>
            <div>
              <label className="block font-medium text-slate-700">Client Type</label>
              <select
                value={formData.clientType}
                onChange={(e) => handleChange('clientType', e.target.value as Client['planType'])}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="Business">Business</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block font-medium text-slate-700">Enrollment Date</label>
              <input
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder=""
              />
              {errors.enrollmentDate && <p className="mt-1 text-xs text-red-500">{errors.enrollmentDate}</p>}
            </div>
            <div>
              <label className="block font-medium text-slate-700">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange('expiryDate', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder=""
              />
              {errors.expiryDate && <p className="mt-1 text-xs text-red-500">{errors.expiryDate}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className="block font-medium text-slate-700">Auto Billing</label>
              <select
                value={formData.autoBilling}
                onChange={(e) => handleChange('autoBilling', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder=""
              />
              {errors.nationality && <p className="mt-1 text-xs text-red-500">{errors.nationality}</p>}
            </div>
          </div>
        </div>

        <div className='mt-8 flex flex-col items-center justify-center border-dashed border-2 border-border rounded-[10px] py-6'>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            id="bulk-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBulkFile(file);
                setBulkFileName(file.name);
                const reader = new FileReader();
                reader.onload = () => {
                  const text = String(reader.result || '');
                  const allLines = text.split(/\r?\n/).filter(l => l.trim());
                  // preview first 10 lines
                  const previewLines = allLines.slice(0, 10);
                  setBulkPreview(previewLines.join('\n'));

                  // parse CSV: first line headers, remaining rows
                  if (allLines.length > 0) {
                    const [headerLine, ...rows] = allLines;
                    const headers = headerLine.split(',').map(h => h.trim());
                    const users = rows.map(r => {
                      const cols = r.split(',');
                      const obj: Record<string, string> = {};
                      headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
                      return obj;
                    }).filter(u => Object.values(u).some(v => v !== ''));
                    setBulkUsers(users);
                  } else {
                    setBulkUsers([]);
                  }
                };
                reader.readAsText(file);
              }
            }}
          />
          <div className='flex flex-col items-center space-y-1 text-[#959595]'>
            <MdOutlineFileDownload size={28} />
            <p className="text-[15px]">Upload Bulk Employee List</p>
            <p className="text-xs">CSV File, up to 50MB</p>
          </div>
          <label htmlFor="bulk-upload" className="mt-4 inline-flex cursor-pointer items-center rounded-[10px] bg-primary px-4 py-2 text-[15px] hover:bg-primary/90 text-white">
            Upload File
          </label>

          {bulkFile && (
            <div className="mt-4 w-full px-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">Selected file: <strong>{bulkFileName}</strong></div>
                <button type="button" onClick={() => { setBulkFile(null); setBulkFileName(''); setBulkPreview(''); }} className="text-sm text-red-500">Remove</button>
              </div>
              <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-50 p-3 text-xs font-mono text-slate-700">{bulkPreview}</pre>
            </div>
          )}
        </div>

         <div className="mt-6 flex justify-center w-full space-x-3">
          <button
            type="submit"
            data-is-submitting={uploading}
            aria-busy={uploading}
            disabled={uploading}
            className={`rounded-[10px] w-full px-4 py-2 font-medium text-white ${uploading ? 'bg-primary/70' : 'bg-primary hover:bg-primary/90'}`}
          >
            {uploading ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}