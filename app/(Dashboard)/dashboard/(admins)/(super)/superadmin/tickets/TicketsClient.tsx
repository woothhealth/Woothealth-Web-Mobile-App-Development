'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEllipsisV } from 'react-icons/fa';
import {
  Ticket,
  useAdminTickets,
  createAdminTicket,
  updateAdminTicket,
  deleteAdminTicket,
} from '@/lib/adminTickets';
import { DASHBOARD_ADMIN_ROLES } from '@/lib/roles';

// Commented out mock data - now using dynamic API calls
// const mockTickets: Ticket[] = [
//   {
//     id: '1',
//     date: '15/04/26',
//     title: 'Login Issue',
//     department: 'IT',
//     assignedTo: 'John Doe',
//     status: 'open',
//   },
//   ...more mock data
// ];

const departments = DASHBOARD_ADMIN_ROLES || ['IT', 'Finance', 'HR', 'Marketing', 'Operations'];
const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];

export default function TicketsClient() {
  const { data, isLoading, error, refetch } = useAdminTickets();
  const tickets = data?.data ?? [];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'title' | 'date' | 'department'>('title');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase();
    return tickets.filter((ticket: Ticket) => {
      if (selectedCategory === 'title') return ticket.title.toLowerCase().includes(q);
      if (selectedCategory === 'date') return ticket.date.toLowerCase().includes(q);
      if (selectedCategory === 'department') return ticket.department.toLowerCase().includes(q);
      return true;
    });
  }, [tickets, search, selectedCategory]);

  const handleAddTicket = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
    setOpenActionId(null);
  };

  const handleDeleteTicket = (id: string) => {
    const ticket = tickets.find((item: Ticket) => item.id === id);
    if (ticket) {
      setDeleteTarget(ticket);
      setOpenActionId(null);
    }
  };

  const confirmDeleteTicket = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAdminTicket(deleteTarget.id);
      toast.success(`Ticket "${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      setOpenActionId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete ticket.');
    }
  };

  const handleSaveTicket = async (ticketData: Omit<Ticket, 'id'>) => {
    try {
      if (editingTicket) {
        await updateAdminTicket(editingTicket.id, ticketData);
        toast.success(`Ticket "${editingTicket.title}" updated successfully.`);
      } else {
        await createAdminTicket(ticketData);
        toast.success(`Ticket "${ticketData.title}" created successfully.`);
      }
      setIsModalOpen(false);
      setEditingTicket(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save ticket.');
    }
  };

  const statusColors: Record<string, string> = {
    open: 'bg-[#49A5EF1A] text-[#49A5EF]',
    'In progress': 'bg-[#FFDE001A] text-[#FFDE00]',
    resolved: 'bg-[#10B9811A] text-[#10B981]',
  };

  return (
    <div className="px-3 py-4 md:p-4 mb-8 w-full mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-8 lg:w-[90%] w-full lg:mx-auto md:items-center justify-between">
        <div className="flex flex-col md:flex-row w-[90%] gap-4">
          <input
            type="text"
            placeholder="Search by title, date, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
          >
            <option value="title">Title</option>
            <option value="date">Date</option>
            <option value="department">Department</option>
          </select>
        </div>
        <button
          onClick={handleAddTicket}
          className="bg-[#49A5EF] text-white px-4 md:px-2 py-2 rounded-lg w-fit md:w-36 flex items-center justify-center gap-1 hover:bg-[#3a8bc7] transition"
        >
          <FaPlus /> Create Ticket
        </button>
      </div>

      {isLoading && <div className="text-center py-8">Loading tickets...</div>}
      {error && <div className="text-center py-8 text-red-500">Error loading tickets</div>}

      {!isLoading && !error && (
      <div className="bg-[#ffffff] rounded-[10px] overflow-x-auto custom-scrollbar">
        <table className="md:min-w-full">
          <thead className="border-b border-[#D9D9D9] text-left">
            <tr>
              <th className="text-[18px] px-4 py-4">Date</th>
              <th className="text-[18px] px-4 py-4">Title</th>
              <th className="text-[18px] px-4 py-4">Department</th>
              <th className="text-[18px] px-4 py-4">Assigned To</th>
              <th className="text-[18px] px-4 py-4">Status</th>
              <th className="text-[18px] px-4 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket: Ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 text-[15px] divide-y divide-[#D9D9D9]">
                <td className="px-4 py-2 md:py-4">{ticket.date}</td>
                <td className="px-4 py-2 md:py-4">{ticket.title}</td>
                <td className="px-4 py-2 md:py-4">{ticket.department}</td>
                <td className="px-4 py-2 md:py-4">
                  <span className={`px-3 py-1 rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-800'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-4 relative">
                  <button
                    onClick={() => setOpenActionId(openActionId === ticket.id ? null : ticket.id)}
                    className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  >
                    <FaEllipsisV />
                  </button>
                  {openActionId === ticket.id && (
                    <div className="absolute right-0 top-11 z-20 w-36 rounded-xl border border-slate-200 bg-white shadow-lg">
                      <button
                        onClick={() => handleEditTicket(ticket)}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">No tickets found</div>
        )}
      </div>
      )}

      {isModalOpen && (
        <TicketModal
          ticket={editingTicket}
          onSave={handleSaveTicket}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          ticket={deleteTarget as Ticket}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteTicket}
        />
      )}

       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
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

interface ConfirmDeleteModalProps {
  ticket: Ticket;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDeleteModal({ ticket, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Confirm Delete</h2>
        <p className="mt-3 text-slate-600">
          Are you sure you want to delete the ticket <strong className="text-slate-900">{ticket.title}</strong>? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
          >
            Delete Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

interface TicketModalProps {
  ticket: Ticket | null;
  onSave: (ticket: Omit<Ticket, 'id'>) => void;
  onClose: () => void;
}

function TicketModal({ ticket, onSave, onClose }: TicketModalProps) {
  const [formData, setFormData] = useState({
    title: ticket?.title || '',
    description: '',
    department: ticket?.department || '',
    attachment: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const ticketData: Omit<Ticket, 'id'> = {
      date: new Date().toLocaleDateString('en-GB'), // dd/mm/yy
      title: formData.title,
      department: formData.department,
      status: 'open',
    };
    onSave(ticketData);
  };

  const handleDepartmentSelect = (dept: string) => {
    setFormData({ ...formData, department: dept });
    setIsDepartmentOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[15px] py-6 md:px-8 w-[90svw] mx-auto md:w-3xl space-y-4 md:space-y-8">
        <div className='flex justify-between px-4 md:px-0'>
          <h2 className="text-xl font-semibold">{ticket ? 'Edit Ticket' : 'Create a New Ticket'}</h2>
          <button className='w-fit outline-0' onClick={onClose}>
            <FaTimes size={18}/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4 overflow-auto max-h-[70vh] custom-scrollbar mr-2 px-4 custom-scrollbar'>
          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:space-x-35">
            <label className="block font-medium">Title</label>
            <div className='w-full'>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:space-x-22">
            <label className="block font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:space-x-21">
            <label className="block font-medium">Department</label>
            <div className='w-full'>
            <div
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm relative cursor-pointer"
              onClick={() => {
                setIsDepartmentOpen(!isDepartmentOpen);
              }}
            >
              {formData.department || 'Select Department'}
              {isDepartmentOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-5">
                  {departments.map((dept) => (
                    <div
                      key={dept}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDepartmentSelect(dept)}
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:space-x-4">
            <label className="font-medium text-[15px] w-50">Attachment (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, attachment: e.target.files?.[0] || null })}
              className="w-full border text-sm border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex md:justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#49A5EF] text-white rounded hover:bg-[#2796f1]"
            >
              {ticket ? 'Update' : 'Create'} Ticket
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
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