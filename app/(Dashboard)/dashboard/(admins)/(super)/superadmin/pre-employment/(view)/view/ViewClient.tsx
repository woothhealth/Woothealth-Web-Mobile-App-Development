'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { mockPreEmployment, PreEmploymentTest, PreEmploymentStatus } from '../../mockPreEmployment';

function getStatusBadgeColor(status: PreEmploymentStatus) {
  switch (status) {
    case 'completed':
      return 'bg-[#D1FAE5] text-[#10B981]';
    case 'scheduled':
      return 'bg-[#DBEAFE] text-[#2563EB]';
    case 'pending':
      return 'bg-[#FEF3C7] text-[#B45309]';
    case 'overdue':
      return 'bg-[#FEE2E2] text-[#991B1B]';
    case 'approved':
      return 'bg-[#E0F2FE] text-[#0C4A6E]';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

function EditTestModal({ test, onClose, onSave }: { test: PreEmploymentTest; onClose: () => void; onSave: (updated: PreEmploymentTest) => void }) {
  const [company, setCompany] = useState(test.company);
  const [insurancePlan, setInsurancePlan] = useState(test.insurancePlan);
  const [provider, setProvider] = useState(test.provider);
  const [selectedTests, setSelectedTests] = useState<string[]>(test.testTypes);
  const [scheduledDate, setScheduledDate] = useState(test.scheduledDate.slice(0, 10));
  const [error, setError] = useState('');

  const TEST_TYPES = ['Drug Screening', 'Vision Test', 'Hearing Test', 'Urinalysis', 'Screening ECG'];

  const toggleTestType = (type: string) => {
    setSelectedTests((current) =>
      current.includes(type) ? current.filter((value) => value !== type) : [...current, type]
    );
  };

  const handleSave = () => {
    if (!company.trim() || !insurancePlan.trim() || !provider.trim() || !selectedTests.length) {
      setError('Please complete all fields and select at least one test type.');
      return;
    }

    onSave({
      ...test,
      company,
      insurancePlan,
      provider,
      testTypes: selectedTests,
      scheduledDate: new Date(scheduledDate).toISOString(),
    });
    toast.success('Pre-employment test updated successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl overflow-y-auto rounded-[15px] bg-white p-6 shadow-xl max-h-[90vh]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Edit Scheduled Test</h2>
            <p className="mt-2 text-sm text-slate-600">Update the scheduled test details before completion.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className='space-y-2'>
          <label className="space-y-2 text-base font-semibold">
            Company name
          </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-[15px] focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            />
          </div>
          <div className='space-y-2'>
          <label className="space-y-2 text-base font-semibold">
            Insurance plan
          </label>
          <input
              value={insurancePlan}
              onChange={(e) => setInsurancePlan(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-[15px] focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            />
          </div>
          <div className='space-y-2'>
            <label className="space-y-2 text-base font-semibold">
              Provider
            </label>
            <input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-[15px] focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            />
          </div>
          <div className='space-y-2'>
            <label className="space-y-2 text-base font-semibold">
              Scheduled date
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-[15px] focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            />
          </div>
          <div className="space-y-2">
            <p className="text-base font-semibold">Test types</p>
            <div className="grid gap-2 grid-cols-2">
              {TEST_TYPES.map((type) => {
                const selected = selectedTests.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleTestType(type)}
                    className={`rounded-2xl border px-4 py-2 text-sm transition ${
                      selected
                        ? 'border-[#49A5EF] bg-[#DBEAFE] text-[#1D4ED8]'
                        : 'border-[#E5E7EB] bg-white text-slate-700 hover:border-[#49A5EF]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-base text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-[#49A5EF] px-5 py-2 text-base font-semibold text-white hover:bg-[#3d8ed8]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ViewClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || undefined;
  const initialTest = useMemo(() => (id ? mockPreEmployment.find((test) => test.id === id) ?? null : null), [id]);
  const [test, setTest] = useState<PreEmploymentTest | null>(initialTest);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!test) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
        <p className="text-lg font-semibold text-slate-700">Pre-employment test not found</p>
        <p className="mt-2 text-sm text-slate-500">Please return to the pre-employment list and select a valid entry.</p>
        <Link href="/dashboard/superadmin/pre-employment" className="mt-6 inline-flex items-center rounded-2xl bg-[#49A5EF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3d8ed8]">
          <FaArrowLeft className="mr-2" /> Back to pre-employment
        </Link>
      </div>
    );
  }

  const handleMarkComplete = () => {
    setTest({ ...test, status: 'completed' });
    toast.success('Test marked as completed.');
  };

  const handleSaveUpdate = (updated: PreEmploymentTest) => {
    setTest(updated);
  };

  return (
    <section className="space-y-6 px-4 py-6 lg:px-8">
    <Link href="/dashboard/superadmin/pre-employment" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 hover:bg-slate-50">
      <FaArrowLeft size={22} />
    </Link>
    <div className="space-y-6 px-4 py-6 lg:px-8 bg-[#ffffff] rounded-[10px] shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex space-x-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#49A5EF] text-2xl font-bold text-[#ffffff]">
            {getInitials(test.employeeName)}
          </div>
          <div className='space-y-2'> 
            <p className="text-3xl font-semibold text-slate-900">{test.employeeName}</p>
            <div className="flex flex-col space-y-1">
              <div className='flex space-x-2 text-sm'>
                <p className="font-semibold">Email:</p>
                <p className="">{test.employeeEmail}</p>
              </div>
              <div className='flex space-x-2 text-sm'>
                <p className="font-semibold">Phone:</p>
                <p className="">{test.employeePhone}</p>
              </div>
              <div className='flex space-x-2 text-sm'>
                <p className="font-semibold">Date of Birth:</p>
                <p className="">{formatDate(test.employeeDOB)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-col gap-4 text-end">
            <span className={`inline-flex rounded-full px-4 py-2 text-sm w-fit font-semibold ${getStatusBadgeColor(test.status)}`}>
              {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
            </span>

            {test.status === 'scheduled' ? (
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] w-fit bg-[#49A5EF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#3d8ed8] cursor-pointer"
                >
                  <FaEdit className="mr-2" /> Edit
                </div>
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  className="inline-flex items-center justify-center rounded-2xl w-fit bg-[#10B981] px-4 py-3 text-sm font-semibold text-white hover:bg-[#059669]"
                >
                  <FaCheckCircle className="mr-2" /> Mark Complete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className='space-y-4'>
          <div className="space-y-2">
            <p className="text-base">Company</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{test.company}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base">Insurance plan</p>
            <p className="text-lg font-semibold text-slate-900">{test.insurancePlan}</p>
          </div>
          <div className="space-y-2">
            <p className="text-base">Scheduled date</p>
            <p className="text-sm font-semibold">{formatDate(test.scheduledDate)}</p>
          </div>
        </div>
        <div className='space-y-4'>
          <div className="space-y-2">
            <p className="text-base">Provider</p>
            <p className="text-lg font-semibold text-slate-900">{test.provider}</p>
          </div>
          <div className='space-y-2'>
            <p className="text-base">Test types</p>
            <ul className="">
              {test.testTypes.map((type) => (
                <li key={type} className="rounded-full bg-[#EFF6FF] list-disc font-semibold pl-4">
                  {type}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showEditModal && test && (
        <EditTestModal
          test={test}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveUpdate}
        />
      )}
    </div>
    </section>
  );
}
