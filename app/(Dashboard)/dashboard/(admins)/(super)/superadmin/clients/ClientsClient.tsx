'use client';

import { useState, useMemo } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
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
    <div className="space-y-6 p-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search by company name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto z-10">
          {/* Status Filter */}
          <div className="relative min-w-max">
            <button
              onClick={() => setStatusFilter(statusFilter ? null : statusOptions[0])}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Status: {statusFilter || 'All'}
            </button>
            {statusFilter && (
              <div className="absolute top-12 left-0 z-20 rounded-2xl border border-slate-200 bg-white shadow-lg">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status === statusFilter ? null : status)}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plan Filter */}
          <div className="relative min-w-max">
            <button
              onClick={() => setPlanFilter(planFilter ? null : planOptions[0])}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Plan: {planFilter || 'All'}
            </button>
            {planFilter && (
              <div className="absolute top-12 left-0 z-20 rounded-2xl border border-slate-200 bg-white shadow-lg">
                {planOptions.map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setPlanFilter(plan === planFilter ? null : plan)}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                  >
                    {plan}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {paginatedClients.map((client) => (
          <div key={client.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Header with Company Name, Status, Plan */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{client.companyName}</h3>
                <div className="mt-2 flex gap-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      client.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : client.status === 'Suspended'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {client.status}
                  </span>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {client.planType}
                  </span>
                </div>
              </div>

              {/* Action Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setOpenActionMenu(openActionMenu === client.id ? null : client.id)}
                  className="rounded-full bg-slate-100 p-2 hover:bg-slate-200"
                  aria-label="More actions"
                >
                  <FaEllipsisV className="text-slate-700" />
                </button>

                {/* Action Dropdown Menu */}
                {openActionMenu === client.id && (
                  <div className="absolute right-0 top-10 z-30 min-w-max rounded-2xl border border-slate-200 bg-white shadow-lg">
                    <button
                      onClick={() => handleOpenModal('enrollees', client)}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      👥 View Enrollees ({client.totalEnrollees})
                    </button>
                    <button
                      onClick={() => handleOpenModal('payment', client)}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      💳 View Payment
                    </button>
                    <button
                      onClick={() => handleOpenModal('invoice', client)}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      📄 View Invoice
                    </button>
                    <button
                      onClick={() => handleOpenModal('addPlan', client)}
                      className="block w-full px-4 py-2 text-left text-sm bg-[#10B981]"
                    >
                      ➕ Add Plan
                    </button>
                    <button
                      onClick={() => handleOpenModal('suspend', client)}
                      className="block w-full px-4 py-2 text-left text-sm bg-[#E86306] hover:bg-[#D97706]"
                    >
                      ⏸️ Suspend Account
                    </button>
                    <button
                      onClick={() => handleOpenModal('deactivate', client)}
                      className="block w-full px-4 py-2 text-left text-sm bg-[#EF4444]"
                    >
                      ⛔ Deactivate Account
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-600">Total Enrollees</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{client.totalEnrollees}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-600">Active Plans</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{client.activePlan}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-600">Monthly Premium</p>
                <p className="mt-1 text-lg font-bold text-blue-600">₦{client.monthlyPremium.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-600">Outstanding</p>
                <p className="mt-1 text-lg font-bold text-red-600">₦{client.outstanding.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-600">Wallet Balance</p>
                <p className="mt-1 text-lg font-bold text-green-600">₦{client.walletBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-600">Contact Person</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{client.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Email</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{client.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Phone</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{client.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Registration Date</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{client.registrationDate}</p>
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
