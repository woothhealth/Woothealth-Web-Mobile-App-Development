'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaEye, FaTrash, FaTimes, FaEllipsisV } from 'react-icons/fa';
import {
  Lead,
  clientTypes,
  leadStatuses,
  salesReps,
  useAdminLeads,
  createAdminLead,
  updateAdminLead,
  deleteAdminLead,
} from '@/lib/adminLeads';
import DeleteConfirmModal from '../../DeleteConfirmModal';

export default function LeadsClient() {
  const { data, isLoading, error, refetch } = useAdminLeads();
  const leads = data?.data ?? [];
  const [search, setSearch] = useState('');
  const [filterRep, setFilterRep] = useState('All sales reps');
  const [filterStatus, setFilterStatus] = useState('All status');
  const [openFilter, setOpenFilter] = useState<'rep' | 'status' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead: Lead) => {
      const matchesSearch =
        lead.clientName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query);
      const matchesRep = filterRep === 'All sales reps' || lead.assignedTo === filterRep;
      const matchesStatus = filterStatus === 'All status' || lead.status === filterStatus;
      return matchesSearch && matchesRep && matchesStatus;
    });
  }, [leads, search, filterRep, filterStatus]);

  const handleOpenFilter = (type: 'rep' | 'status') => {
    setOpenFilter((current) => (current === type ? null : type));
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
    setOpenFilter(null);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
    setOpenFilter(null);
    setOpenMenuId(null);
  };

  const handleDeleteLead = (id: string) => {
    const leadToDelete = leads.find((lead: Lead) => lead.id === id);
    if (leadToDelete) {
      setDeleteTarget(leadToDelete);
    }
    setOpenMenuId(null);
  };

  const confirmDeleteLead = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAdminLead(deleteTarget.id);
      toast.success(`Lead for ${deleteTarget.clientName} deleted successfully.`);
      setDeleteTarget(null);
      setOpenMenuId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete lead.');
    }
  };

  const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'dateAdded'>) => {
    try {
      if (editingLead) {
        await updateAdminLead(editingLead.id, leadData);
        toast.success(`Lead “${editingLead.clientName}” updated successfully.`);
      } else {
        await createAdminLead(leadData);
        toast.success(`Lead “${leadData.clientName}” added successfully.`);
      }
      setIsModalOpen(false);
      setEditingLead(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save lead.');
    }
  };

  const statusColors: Record<string, string> = {
    'New Lead': 'bg-[#D1FAE5] text-[#10B981]',
    Contacted: 'bg-[#FEF9C3] text-[#D97706]',
    Converted: 'bg-[#D1FAE5] text-[#10B981]',
    Lost: 'bg-[#FEE2E2] text-[#EF4444]',
  };

  return (
    <div className="py-4 mb-8 w-full">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between mb-6 md:w-[90%] mx-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-center w-full">
          <input
            type="search"
            placeholder="Search client name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full min-w-[260px] rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition"
          />

          <div className="relative min-w-[180px]">
            <button
              type="button"
              onClick={() => handleOpenFilter('rep')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm transition hover:border-slate-400"
            >
              {filterRep}
            </button>
            {openFilter === 'rep' && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div
                  className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                  onClick={() => {
                    setFilterRep('All sales reps');
                    setOpenFilter(null);
                  }}
                >
                  All sales reps
                </div>
                {salesReps.map((rep) => (
                  <div
                    key={rep}
                    className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                    onClick={() => {
                      setFilterRep(rep);
                      setOpenFilter(null);
                    }}
                  >
                    {rep}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative min-w-40">
            <button
              type="button"
              onClick={() => handleOpenFilter('status')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm transition hover:border-slate-400"
            >
              {filterStatus}
            </button>
            {openFilter === 'status' && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div
                  className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                  onClick={() => {
                    setFilterStatus('All status');
                    setOpenFilter(null);
                  }}
                >
                  All status
                </div>
                {leadStatuses.map((status: string) => (
                  <div
                    key={status}
                    className="cursor-pointer px-4 py-3 text-sm hover:bg-slate-100"
                    onClick={() => {
                      setFilterStatus(status);
                      setOpenFilter(null);
                    }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleAddLead}
          className="inline-flex items-center gap-1 rounded-lg bg-[#49A5EF] w-40 px-4 md:px-2 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#41a3f3]"
        >
          <FaPlus /> Add New Lead
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar bg-[#ffffff] rounded-[10px] shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-[15px]">
          <thead className="font-semibold text-lg">
            <tr>
              <th className="px-4 py-4 text-left">Date added</th>
              <th className="px-4 py-4 text-left">Client name</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="px-4 py-4 text-left">Assigned to</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredLeads.map((lead: Lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-slate-900 whitespace-nowrap w-fit">{lead.dateAdded}</td>
                <td className="px-4 py-4 text-slate-900 whitespace-nowrap w-fit">{lead.clientName}</td>
                <td className="px-4 py-4 text-slate-600">{lead.email}</td>
                <td className="px-4 py-4 text-slate-600">{lead.assignedTo}</td>
                <td className="px-4 py-4 text-slate-600 text-center">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[lead.status as string]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-center relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === lead.id ? null : lead.id)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <FaEllipsisV />
                  </button>
                  {openMenuId === lead.id && (
                    <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                      <Link
                        href={`/dashboard/superadmin/leads/view?id=${lead.id}`}
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setOpenMenuId(null)}
                      >
                        <FaEye /> View
                      </Link>
                      <button
                        onClick={() => handleEditLead(lead)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lead)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No leads found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <LeadModal
          lead={editingLead}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLead(null);
          }}
          onSave={handleSaveLead}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete lead"
          description={
            <>
              Are you sure you want to delete the lead for <strong>{deleteTarget.clientName}</strong>? This action cannot be undone.
            </>
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteLead}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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

interface LeadModalProps {
  lead: Lead | null;
  onClose: () => void;
  onSave: (leadData: Omit<Lead, 'id' | 'dateAdded'>) => void;
}

function LeadModal({ lead, onClose, onSave }: LeadModalProps) {
  const [formData, setFormData] = useState({
    clientName: lead?.clientName || '',
    clientType: lead?.clientType || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    contactPerson: lead?.contactPerson || '',
    potentialEmployees: lead?.potentialEmployees.toString() || '',
    assignedTo: lead?.assignedTo || '',
    logNote: lead?.logNote || '',
    status: lead?.status || 'New Lead',
  });

  const [openField, setOpenField] = useState<'clientType' | 'assignedTo' | 'status' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.clientName.trim()) nextErrors.clientName = 'Client name is required';
    if (!formData.clientType) nextErrors.clientType = 'Client type is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!formData.contactPerson.trim()) nextErrors.contactPerson = 'Contact person is required';
    if (!formData.potentialEmployees.trim() || Number(formData.potentialEmployees) <= 0)
      nextErrors.potentialEmployees = 'Potential employees is required';
    if (!formData.assignedTo) nextErrors.assignedTo = 'Assigned to is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSave({
      clientName: formData.clientName,
      clientType: formData.clientType,
      email: formData.email,
      phone: formData.phone,
      contactPerson: formData.contactPerson,
      potentialEmployees: Number(formData.potentialEmployees),
      assignedTo: formData.assignedTo,
      logNote: formData.logNote,
      status: formData.status as Lead['status'],
    });
  };

  const chooseValue = (field: 'clientType' | 'assignedTo' | 'status', value: string) => {
    setFormData({ ...formData, [field]: value });
    setOpenField(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 max-h-[75vh] overflow-auto pr-2 custom-scrollbar">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Client name" error={errors.clientName}>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
              />
            </Field>

            <div className="relative">
            <Field label="Client type" error={errors.clientType}>
              <div
                onClick={() => setOpenField((current) => (current === 'clientType' ? null : 'clientType'))}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-3 text-slate-700 cursor-pointer"
              >
                {formData.clientType || 'Select client type'}
              </div>
              {openField === 'clientType' && (
                <div className="absolute w-full mt-2 rounded-3xl border border-slate-200 bg-white shadow-lg">
                  {clientTypes.map((type) => (
                    <div
                      key={type}
                      className={`cursor-pointer px-4 py-2 text-[15px] hover:bg-slate-100 ${formData.clientType === type ? 'bg-slate-200' : ''}`}
                      onClick={() => chooseValue('clientType', type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </Field>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
              />
            </Field>

            <Field label="Phone number" error={errors.phone}>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
              />
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Contact person" error={errors.contactPerson}>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-2 outline-none focus:border-[#49A5EF]"
              />
            </Field>

            <Field label="Potential employees" error={errors.potentialEmployees}>
              <input
                type="number"
                min="0"
                value={formData.potentialEmployees}
                onChange={(e) => setFormData({ ...formData, potentialEmployees: e.target.value })}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-3 outline-none focus:border-[#49A5EF]"
              />
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative">
            <Field label="Assigned to" error={errors.assignedTo}>
              <div
                onClick={() => setOpenField((current) => (current === 'assignedTo' ? null : 'assignedTo'))}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-3 text-slate-700 cursor-pointer"
              >
                {formData.assignedTo || 'Select sales rep'}
              </div>
              {openField === 'assignedTo' && (
                <div className="absolute w-full mt-2 rounded-xl border border-slate-200 bg-white shadow-lg">
                  {salesReps.map((rep) => (
                    <div
                      key={rep}
                      className={`cursor-pointer px-4 py-2 text-[15px] hover:bg-slate-100 ${formData.assignedTo === rep ? 'bg-slate-200' : ''}`}
                      onClick={() => chooseValue('assignedTo', rep)}
                    >
                      {rep}
                    </div>
                  ))}
                </div>
              )}
            </Field>
            </div>

            <div className="relative">
            <Field label="Status" error={undefined}>
              <div
                onClick={() => setOpenField((current) => (current === 'status' ? null : 'status'))}
                className="w-full rounded-[10px] border border-slate-300 px-4 py-3 text-slate-700 cursor-pointer"
              >
                {formData.status}
              </div>
              {openField === 'status' && (
                <div className="absolute w-full mt-2 rounded-xl border border-slate-200 bg-white shadow-lg">
                  {leadStatuses.map((status) => (
                    <div
                      key={status}
                      className={`cursor-pointer px-4 py-2 text-[15px] hover:bg-slate-100 ${formData.status === status ? 'bg-slate-200' : ''}`}
                      onClick={() => chooseValue('status', status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </Field>
            </div>
          </div>

          <Field label="Log note">
            <textarea
              rows={4}
              value={formData.logNote}
              onChange={(e) => setFormData({ ...formData, logNote: e.target.value })}
              className="w-full rounded-[10px] border border-slate-300 px-4 py-3 outline-none focus:border-[#49A5EF] resize-none"
            />
          </Field>

          <div className="flex flex-col gap-3 pt-2 w-full">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#49A5EF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#49A5EF]/90"
            >
              {lead ? 'Save changes' : 'Add lead'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-base font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function DeleteConfirm({
  lead,
  onCancel,
  onConfirm,
}: {
  lead: Lead;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Delete lead</h2>
        <p className="mt-3 text-slate-600">
          Are you sure you want to delete <strong>{lead.clientName}</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
