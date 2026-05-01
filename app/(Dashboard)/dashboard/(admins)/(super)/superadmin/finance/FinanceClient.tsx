'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FaSearch, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { Invoice, mockInvoices, AccountType, InvoiceStatus } from './mock-finance';
import EditInvoiceModal from './components/EditInvoiceModal';
import DeleteConfirmModal from '../DeleteConfirmModal';

const accountTypes: ('All' | AccountType)[] = ['All', 'Retail Account', 'Business Account'];
const statuses: ('All' | InvoiceStatus)[] = ['All', 'Paid', 'Pending', 'Overdue', 'Refund Request', 'Cancelled'];

const ROWS_PER_PAGE = 10;
const TOTAL_INVOICES = 300;

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case 'Paid':
      return 'bg-[#D1FAE5] text-[#10B981]';
    case 'Pending':
      return 'bg-[#FEF3C7] text-[#F59E0B]';
    case 'Overdue':
      return 'bg-[#FEE2E2] text-[#EF4444]';
    case 'Refund Request':
      return 'bg-[#FDBA74] text-[#F97316]';
    case 'Cancelled':
      return 'bg-[#E5E7EB] text-[#6B7280]';
    default:
      return '';
  }
};

export default function FinanceClient() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [search, setSearch] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<'All' | AccountType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'account' | 'status' | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [page, setPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceId.toLowerCase().includes(query) ||
        invoice.client.toLowerCase().includes(query);

      const matchesAccountType = accountTypeFilter === 'All' || invoice.accountType === accountTypeFilter;
      const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;

      return matchesSearch && matchesAccountType && matchesStatus;
    });
  }, [invoices, search, accountTypeFilter, statusFilter]);

  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredInvoices.slice(start, start + ROWS_PER_PAGE);
  }, [filteredInvoices, page]);

  const totalPages = Math.ceil(filteredInvoices.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(page * ROWS_PER_PAGE, filteredInvoices.length);

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setOpenActionMenu(null);
  };

  const handleDeleteInvoice = (id: string) => {
    const invoice = invoices.find((invoice) => invoice.id === id);
    if (!invoice) return;
    setDeleteTarget(invoice);
    setOpenActionMenu(null);
  };

  const confirmDeleteInvoice = () => {
    if (!deleteTarget) return;
    setInvoices((current) => current.filter((invoice) => invoice.id !== deleteTarget.id));
    toast.success(`Invoice ${deleteTarget.invoiceId} deleted successfully.`);
    setDeleteTarget(null);
  };

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    setEditingInvoice(null);
  };

  return (
    <div className="rounded-[10px] bg-white px-4 py-6 md:p-6 shadow-sm">
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between z-10">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by invoice ID or client..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          />
        </div>

        <div className='flex space-x-4 md:space-x-0'>
        {/* Account Type Filter */}
        <div className="relative w-32">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'account' ? null : 'account')}
            className="rounded-lg border border-gray-300 bg-white w-full text-start px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {accountTypeFilter === 'All' ? 'All Account' : accountTypeFilter}
          </button>
          {openDropdown === 'account' && (
            <div className="absolute right-0 top-full z-10 mt-2 w-fit rounded-lg border border-gray-200 bg-white shadow-lg">
              {accountTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setAccountTypeFilter(type);
                    setOpenDropdown(null);
                    setPage(1);
                  }}
                  className={`block w-full px-4 py-2 text-left text-[14px] rounded-[10px] hover:bg-gray-100 ${
                    accountTypeFilter === type ? 'font-bold bg-[#49A5EF] text-[#ffffff]' : ''
                  }`}
                >
                  {type === 'All' ? 'All Account' : type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {statusFilter === 'All' ? 'All Status' : statusFilter}
          </button>
          {openDropdown === 'status' && (
            <div className="absolute right-0 top-full z-10 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
              {statuses.map((status) => (
                <div
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setOpenDropdown(null);
                    setPage(1);
                  }}
                  className={`block px-4 py-2 text-left text-sm w-full rounded-[10px] hover:bg-gray-100 ${
                    statusFilter === status ? 'font-bold bg-[#49A5EF] text-[#ffffff]' : ''
                  }`}
                >
                  {status === 'All' ? 'All Status' : status}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-[17px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold">Invoice ID</th>
              <th className="px-4 py-3 text-left font-semibold">Client</th>
              <th className="px-4 py-3 text-left font-semibold">Amount (₦)</th>
              <th className="px-4 py-3 text-left font-semibold">Account Type</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap w-fit">{invoice.invoiceId}</td>
                <td className="px-4 py-3 text-gray-900">{invoice.client}</td>
                <td className="px-4 py-3 text-gray-900">₦{invoice.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-900">{invoice.accountType}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="relative px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => setOpenActionMenu(openActionMenu === invoice.id ? null : invoice.id)}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 outline-0"
                    >
                      <FaEllipsisV size={16} />
                    </button>
                  </div>

                  {/* Action Menu */}
                  {openActionMenu === invoice.id && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
                      <button
                        onClick={() => handleEditInvoice(invoice)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#49A5EF] hover:bg-gray-50"
                      >
                        <FaEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-50 border-t border-gray-200"
                      >
                        <FaTrash size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredInvoices.length > 0 ? startIndex : 0}-{endIndex} of {TOTAL_INVOICES} invoices
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
          onSave={handleSaveInvoice}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete invoice"
          description={`Are you sure you want to delete invoice ${deleteTarget.invoiceId}? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteInvoice}
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