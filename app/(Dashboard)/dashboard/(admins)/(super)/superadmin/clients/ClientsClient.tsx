'use client';

import { useState, useMemo } from 'react';
import { FaEllipsisV, FaFilter, FaChevronDown, FaUsers, FaCreditCard, FaFileInvoice, FaPlus, FaPause, FaBan } from 'react-icons/fa';
import Link from 'next/link';
import { IoWalletOutline } from "react-icons/io5";
import type { Client } from './mock-clients';
import { mockClients } from './mock-clients';
import { ViewEnrolleesModal } from './components/ViewEnrolleesModal';
import { ViewPaymentModal } from './components/ViewPaymentModal';
import { ViewInvoiceModal } from './components/ViewInvoiceModal';
import { AddPlanModal } from './components/AddPlanModal';
import { SuspendAccountModal } from './components/SuspendAccountModal';
import { DeactivateAccountModal } from './components/DeactivateAccountModal';

type ModalType = 'enrollees' | 'payment' | 'invoice' | 'addPlan' | 'suspend' | 'deactivate' | null;

export function ClientsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return mockClients.filter((client) => {
      const matchesSearch =
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);

      const matchesStatus = statusFilter ? client.status === statusFilter : true;
      const matchesPlan = planFilter ? client.planType === planFilter : true;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [searchTerm, statusFilter, planFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filtered.slice(startIndex, endIndex);

  const handleOpenModal = (type: ModalType, client: Client) => {
    setSelectedClient(client);
    setActiveModal(type);
    setOpenActionMenu(null);
  };

  const statusOptions = ['Active', 'Suspended', 'Inactive'];
  const planOptions = ['Business', 'Retail'];

  return (
    <div className="space-y-6 px-4 py-6 md:p-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className='w-full'>
          <input
            type="text"
            placeholder="Search by company name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-[10px] border border-border bg-transparent px-4 py-3 text-sm placeholder-slate-500 focus:border-primary focus:outline-none"
          />
        </div>

          {/* Status Filter */}
          <div className="relative w-fit">
            <div
              onClick={() => setStatusDropdownOpen((open) => !open)}
              className="flex items-center justify-between gap-2 w-30 rounded-[10px] border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              aria-expanded={statusDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="">{statusFilter || 'All'}</span>
              <FaChevronDown className={`h-3.5 w-3.5 text-slate-500 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {statusDropdownOpen && (
              <div className="absolute left-0 top-12 z-10 w-full overflow-hidden rounded-[15px] border border-border bg-white shadow-lg">
                <button
                  onClick={() => {
                    setStatusFilter(null);
                    setStatusDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-300" />
                  All
                </button>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-100"
                  >
                    <span
                      className={`inline-flex h-2.5 w-2.5 rounded-full ${
                        status === 'Active'
                          ? 'bg-emerald-500'
                          : status === 'Suspended'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="flex-1">{status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {paginatedClients.map((client) => (
          <div key={client.id} className="rounded-[15px] border border-border p-4 md:p-6 shadow-sm">
            {/* Header with Company Name, Status, Plan */}
            <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{client.companyName}</h3>
                  <p className="text-sm text-slate-600">{client.clientType}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-1 md:gap-3">
                  <span
                    className={`inline-block rounded-full px-3 w-fit py-1 text-sm font-medium ${
                      client.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : client.status === 'Suspended'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {client.status}
                  </span>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {client.planType}
                  </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5 bg-[#E5E7EB4D] rounded-[10px] py-3 px-4 md:text-center">
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Total Enrollees</p>
                <p className="text-xl font-bold text-slate-900">{client.totalEnrollees}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Active Plans</p>
                <p className="text-xl font-bold text-primary">{client.activePlan}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Monthly Premium</p>
                <p className="text-xl font-bold text-[#10B981]">₦{client.monthlyPremium.toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Outstanding</p>
                <p className="text-xl font-bold text-[#EF4444]">₦{client.outstanding.toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Wallet Balance</p>
                <p className="text-xl font-bold text-primary">₦{client.walletBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 items-start justify-between">
              <div className="flex flex-col text-sm space-y-1">
                <div className="flex space-x-2">
                  <p className="text-slate-600">Contact Person:</p>
                  <p className="font-medium text-slate-900">{client.contactPerson}</p>
                </div>
                <div className='flex space-x-2'>
                  <p className="text-slate-600">Email:</p>
                  <p className="font-medium text-slate-900">{client.email}</p>
                </div>
                <div className='flex space-x-2'>
                  <p className="text-slate-600">Phone:</p>
                  <p className="font-medium text-slate-900">{client.phone}</p>
                </div>
                <div className='flex space-x-2'>
                  <p className="text-slate-600">Registration Date:</p>
                  <p className="font-medium text-slate-900">{client.registrationDate}</p>
                </div>
              </div>
              
              {/* Action Menu Button */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-4 justify-end">
                  <div className="space-y-2">
                    <Link
                      href={`/dashboard/superadmin/clients/enrollees`}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#E5E7EB4D] cursor-pointer hover:bg-slate-50 rounded-[10px]"
                    >
                      <FaUsers /> View Enrollees ({client.totalEnrollees})
                    </Link>
                    <button
                      onClick={() => handleOpenModal('payment', client)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left bg-[#E5E7EB4D] cursor-pointer text-sm hover:bg-slate-50 rounded-[10px]"
                    >
                      <IoWalletOutline /> View Payment
                    </button>
                    <Link
                      href={`/dashboard/superadmin/clients/invoice`}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#E5E7EB4D] cursor-pointer hover:bg-slate-50 rounded-[10px]"
                    >
                      <FaFileInvoice /> View Invoice
                    </Link>
                  </div>
                    <div className="space-y-2 text-[#ffffff]">
                    <button
                      onClick={() => handleOpenModal('addPlan', client)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#10B981] cursor-pointer hover:bg-[#10B981]/80 rounded-[10px]"
                    >
                      <FaPlus /> Add Plan
                    </button>
                    <button
                      onClick={() => handleOpenModal('suspend', client)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#E86306] hover:bg-[#D97706] rounded-[10px] cursor-pointer"
                    >
                      <FaPause /> Suspend Account
                    </button>
                    <button
                      onClick={() => handleOpenModal('deactivate', client)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#EF4444] hover:bg-[#EF4444]/80 rounded-[10px] cursor-pointer"
                    >
                      <FaBan /> Deactivate Account
                    </button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} clients
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'enrollees' && selectedClient && (
        <ViewEnrolleesModal
          clientId={selectedClient.id}
          clientName={selectedClient.companyName}
          enrolleeCount={selectedClient.totalEnrollees}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'payment' && selectedClient && (
        <ViewPaymentModal clientName={selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'invoice' && selectedClient && (
        <ViewInvoiceModal
          clientId={selectedClient.id}
          clientName={selectedClient.companyName}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'addPlan' && selectedClient && (
        <AddPlanModal clientName={selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'suspend' && selectedClient && (
        <SuspendAccountModal clientName={selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'deactivate' && selectedClient && (
        <DeactivateAccountModal clientName={selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
