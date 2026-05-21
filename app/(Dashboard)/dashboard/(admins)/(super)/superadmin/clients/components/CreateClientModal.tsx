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
    contactPerson: '',
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
    photo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Client name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
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

  const handleSubmit = () => {
    if (validate()) {
      const newClient: Omit<Client, 'id' | 'registrationDate'> = {
        ...formData,
        totalEnrollees: 0,
        activePlan: 0,
        monthlyPremium: 0,
        outstanding: 0,
        walletBalance: 0,
      };
      onCreate?.(newClient);
      toast.success(`Client "${formData.companyName}" created successfully`);
      onClose();
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
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

        <form className="py-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">  
          <div className='flex flex-col items-center space-y-1 text-[#959595]'>
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              id="client-logo-upload"
              value={formData.photo || ''}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setFormData(prev => ({ ...prev, photo: reader.result as string }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label htmlFor="client-logo-upload" className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-border bg-slate-50 text-sm hover:bg-slate-100">
              <FaUser size={24} />
            </label>
            <p className="mt-1">Upload photo</p>
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
            accept="csv"
            className="hidden"
            id="bulk-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Handle bulk upload logic here
                toast.success('Bulk upload feature is not implemented yet');
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
        </div>

         <div className="mt-6 flex justify-center w-full space-x-3">
          <button
            onClick={handleSubmit}
            className="rounded-[10px] w-full bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90"
          >
            Create Client
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}