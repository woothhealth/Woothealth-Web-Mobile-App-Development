'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaEllipsisV, FaEye, FaPlus, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import DeleteConfirmModal from '../../DeleteConfirmModal';
import { PreEmploymentTest, mockPreEmployment, PreEmploymentStatus } from '../mockPreEmployment';

const STATUS_OPTIONS: Array<{ label: string; value: PreEmploymentStatus | 'all' }> = [
  { label: 'All Status', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Overdue', value: 'overdue' },
];

const COMPANY_OPTIONS = ['PrimeTech Solutions', 'Greenfield Manufacturing', 'Apex Energy', 'NovaTech Industries'];
const PROVIDER_OPTIONS = ['HealthFirst Diagnostics', 'CarePlus Labs', 'WellCare Screening', 'GentleHealth Clinic'];
const TEST_TYPE_OPTIONS = ['Drug Screening', 'Vision Test', 'Hearing Test', 'Urinalysis', 'Screening ECG'];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadgeColor(status: PreEmploymentStatus) {
  switch (status) {
    case 'completed':
      return 'bg-[#10B9811A] text-[#10B981]';
    case 'scheduled':
      return 'bg-[#49A5EF1A] text-[#49A5EF]';
    case 'pending':
      return 'bg-[#F59E0B1A] text-[#F59E0B]';
    case 'overdue':
      return 'bg-[#EF44441A] text-[#EF4444]';
    case 'approved':
      return 'bg-[#10B9811A] text-[#10B981]';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function ScheduleTestModal({ onClose, onCreate }: { onClose: () => void; onCreate: (test: PreEmploymentTest) => void }) {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');
  const [employeeDOB, setEmployeeDOB] = useState('');
  const [company, setCompany] = useState(COMPANY_OPTIONS[0]);
  const [insurancePlan, setInsurancePlan] = useState('Corporate Plus Plan');
  const [provider, setProvider] = useState(PROVIDER_OPTIONS[0]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleTestType = (testType: string) => {
    setSelectedTests((current) =>
      current.includes(testType) ? current.filter((value) => value !== testType) : [...current, testType]
    );
  };

  const handleCreate = () => {
    setError('');

    if (!employeeName.trim() || !employeeEmail.trim() || !employeePhone.trim() || !employeeDOB.trim()) {
      setError('All employee fields are required.');
      return;
    }

    if (!selectedTests.length) {
      setError('Please choose at least one test type.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newTest: PreEmploymentTest = {
        id: `PRE-${Date.now()}`,
        dateOfService: new Date().toISOString(),
        scheduledDate: new Date().toISOString(),
        employeeName,
        employeeEmail,
        employeePhone,
        employeeDOB,
        company,
        insurancePlan,
        provider,
        testTypes: selectedTests,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
      onCreate(newTest);
      setIsLoading(false);
      toast.success('Pre-employment test scheduled successfully.');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full md:w-3xl overflow-y-auto rounded-[15px] bg-white p-6 shadow-xl max-h-[90vh] space-y-8 custom-scrollbar">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Schedule Pre-Employment Test</h2>
            <p className="mt-2 text-sm text-slate-600">Complete the form to schedule a new test for an employee.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 text-[14px]">
            <label className="text-base font-semibold">
              Employee name
            </label>
            <input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
              placeholder='Enter Full Name'
            />
          </div>
          <div className="space-y-4 text-[14px]">
          <label className="text-base font-semibold">
            Employee email
          </label>
            <input
              type="email"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
              placeholder='Enter Email Address'
            />
          </div>
          <div className="space-y-4 text-[14px]">
          <label className="text-base font-semibold">
            Employee phone number
          </label>
            <input
              value={employeePhone}
              onChange={(e) => setEmployeePhone(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
              placeholder='Enter Phone Number'
            />
          </div>
          <div className="space-y-4 text-[14px]">
          <label className="text-base font-semibold">
            Employee date of birth
          </label>
            <input
              type="date"
              value={employeeDOB}
              onChange={(e) => setEmployeeDOB(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
              placeholder='Select Date of Birth'
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-4 text-[14px]">
          <label className="text-base font-semibold">
            Company name
          </label>
            <select
              value={company} 
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            >
              {COMPANY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4 text-[14px]">
          <label className="text-base font-semibold">
            Insurance plan
          </label>
            <input
              value={insurancePlan}
              onChange={(e) => setInsurancePlan(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
              placeholder='Enter Insurance Plan'
            />
          </div>
          <div className="space-y-4 text-[14px]">
          <label className="text-base font-semibold">
            Provider
          </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            >
              {PROVIDER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='mt-6 grid gap-4 md:grid-cols-2 items-start'>
          <div className="">
            <p className="text-base font-semibold">Test types</p>
            <div className="mt-3 grid gap-2 grid-cols-2">
              {TEST_TYPE_OPTIONS.map((testType) => {
                const isSelected = selectedTests.includes(testType);
                return (
                  <button
                    key={testType}
                    type="button"
                    onClick={() => handleToggleTestType(testType)}
                    className={`rounded-2xl border px-4 py-1 text-[14px] transition ${
                      isSelected
                        ? 'border-[#49A5EF] bg-[#DBEAFE] text-[#1D4ED8]'
                        : 'border-[#D9D9D9] bg-white text-slate-700 hover:border-[#49A5EF]'
                    }`}
                  >
                    {testType}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-base">
            <p className="font-semibold">Scheduled timestamp</p>
            <p className="mt-1 text-[14px] w-full rounded-2xl border border-[#D9D9D9] bg-white px-4 py-2 focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]">{new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
        </div>

        {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#D9D9D9] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8] disabled:opacity-50"
          >
            {isLoading ? 'Scheduling...' : 'Schedule Test'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00000032;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}

export default function PreEmploymentClient() {
  const [tests, setTests] = useState<PreEmploymentTest[]>(mockPreEmployment);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PreEmploymentStatus | 'all'>('all');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PreEmploymentTest | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [page, setPage] = useState(1);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTests = useMemo(() => {
    let filtered = tests;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((test) => test.status === selectedStatus);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter((test) =>
        test.employeeName.toLowerCase().includes(query) ||
        test.company.toLowerCase().includes(query) ||
        test.provider.toLowerCase().includes(query) ||
        test.testTypes.some((type) => type.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [tests, selectedStatus, search]);

  const paginatedTests = useMemo(() => {
    const start = (page - 1) * 10;
    return filteredTests.slice(start, start + 10);
  }, [filteredTests, page]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / 10));

  const handleDelete = (id: string) => {
    const item = tests.find((test) => test.id === id);
    if (!item) return;
    setDeleteTarget(item);
    setOpenActionMenu(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTests((current) => current.filter((item) => item.id !== deleteTarget.id));
    toast.success('Pre-employment test deleted successfully.');
    setDeleteTarget(null);
  };

  const handleCreateTest = (test: PreEmploymentTest) => {
    setTests((current) => [test, ...current]);
    setPage(1);
  };

  return (
    <div className="">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 gap-3 flex-col sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search employee, company, provider, or test type"
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#49A5EF] focus:ring-2 focus:ring-[#DBEAFE]"
            />
          </div>

          <div className="relative min-w-[180px]" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex w-full items-center justify-between rounded-2xl border border-[#D9D9D9] bg-white px-4 py-2 text-sm text-slate-700 hover:border-[#49A5EF] focus:border-[#49A5EF] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]"
            >
              <span>{STATUS_OPTIONS.find(option => option.value === selectedStatus)?.label}</span>
              <FaChevronDown className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute top-full z-10 mt-1 w-full rounded-2xl border border-[#D9D9D9] bg-white shadow-lg">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(option.value as PreEmploymentStatus | 'all');
                      setIsStatusDropdownOpen(false);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        
          <div>
            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#49A5EF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3d8ed8]"
            >
              <FaPlus />
              Schedule Test
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[10px] bg-[#ffffff] shadow-sm" ref={tableRef}>
        <table className="min-w-full table-fixed text-[15px]">
          <thead className="text-left text-[18px] border-b border-[D9D9D9]">
            <tr>
              <th className="px-4 py-3">Date of Service</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Test Type</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  No pre-employment tests found.
                </td>
              </tr>
            ) : (
              paginatedTests.map((test) => (
                <tr key={test.id} className="border-t border-[#E5E7EB] hover:bg-[#F8FAFC]">
                  <td className="px-4 py-4 text-slate-900">{formatDate(test.dateOfService)}</td>
                  <td className="px-4 py-4 text-slate-900">{test.employeeName}</td>
                  <td className="px-4 py-4 text-slate-900">{test.company}</td>
                  <td className="px-4 py-4 text-slate-900">{test.testTypes.join(', ')}</td>
                  <td className="px-4 py-4 text-slate-900">{test.provider}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(test.status)}`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </td>
                  <td className="relative px-4 py-4 text-center">
                    <button
                      onClick={() => setOpenActionMenu(openActionMenu === test.id ? null : test.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      <FaEllipsisV />
                    </button>
                    {openActionMenu === test.id && (
                      <div className="absolute right-2 top-full z-5 mt-0 w-30 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-lg">
                        <Link
                          href={`/dashboard/superadmin/pre-employment/view?id=${test.id}`}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setOpenActionMenu(null)}
                        >
                          <FaEye />
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(test.id)}
                          className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-slate-50"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-600">
          Showing {paginatedTests.length} of {filteredTests.length} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-700">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete Pre-Employment Test"
          description={`Are you sure you want to delete the pre-employment test for ${deleteTarget.employeeName}? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {showScheduleModal && <ScheduleTestModal onClose={() => setShowScheduleModal(false)} onCreate={handleCreateTest} />}
    </div>
  );
}
