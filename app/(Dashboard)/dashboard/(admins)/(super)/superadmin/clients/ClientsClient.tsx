'use client';

import { useState, useMemo, useEffect } from 'react';
import { FaChevronDown, FaUsers, FaFileInvoice, FaPlus, FaPause, FaBan } from 'react-icons/fa';
import Link from 'next/link';
import { IoWalletOutline } from "react-icons/io5";
import type { Client } from './mock-clients';
/* import { mockClients } from './mock-clients'; // switched to dynamic API */
import { useAdminClients, createAdminClient } from '@/lib/adminClients';
import { ViewEnrolleesModal } from './components/ViewEnrolleesModal';
import { ViewPaymentModal } from './components/ViewPaymentModal';
import { ViewInvoiceModal } from './components/ViewInvoiceModal';
import { AddPlanModal } from './components/AddPlanModal';
import { SuspendAccountModal } from './components/SuspendAccountModal';
import { DeactivateAccountModal } from './components/DeactivateAccountModal';
import { CreateClientModal } from './components/CreateClientModal';
import { toast } from 'sonner';
import { CreateInvoiceModal } from './components/CreateInvoice';
import { ActivateAccountModal } from './components/ActivateAccountModal';

type ModalType = 'enrollees' | 'payment' | 'invoice' | 'addPlan' | 'suspend' | 'deactivate' | 'activate' | 'createClient' | 'createInvoice' | null;

export function ClientsClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [enrolleeCounts, setEnrolleeCounts] = useState<Record<string, number>>({});
  const { data: clientsRes, isLoading, refetch } = useAdminClients();

  const mainCompany = (client: Client) => {
    if ((client.firstName && client.lastName) || client.firstName || client.lastName) {
      return `${client.firstName} ${client.lastName}`;
    }
    return;
  };

  const mainPlan = (client: Client) => {
    if (client.role) {
      return client.role + ' Plan';
    }
    return client.planType || 'N/A';
  };

  const mainPlanType = (client: Client) => {
    if (client.role) {
      return client.role === 'business' ? 'Business Client' : 'Woot Health Retail';
    }
    return client.planType || 'N/A';
  }

  const formatDate = (client: Client) => {
    if (client.$createdAt) {
      const date = new Date(client.$createdAt);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return 'N/A';
  }

  const isActive = (client: Client) => {
    return client.status?.toLowerCase() === 'active';
  }

  useEffect(() => {
    if (clientsRes && clientsRes.data) {
      setClients(clientsRes.data);
    }
  }, [clientsRes]);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    return clients.filter((client) => {
      const company = mainCompany(client) || '';
      const email = (client.email || '').toString();
      const phone = (client.phone || '').toString();

      const matchesSearch =
        company.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.includes(searchTerm || '');

      const matchesStatus = statusFilter ? client.status === statusFilter : true;
      const matchesPlan = planFilter ? client.planType === planFilter : true;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clients, searchTerm, statusFilter, planFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filtered.slice(startIndex, endIndex);

  const handleOpenModal = (type: ModalType, client?: Client | null) => {
    setSelectedClient(client || null);
    setActiveModal(type);
    setOpenActionMenu(null);
  };

  // Fetch enrollee counts for the paginated clients (using businessId === client.userId)
  useEffect(() => {
    let mounted = true;
    const fetchCounts = async () => {
      try {
        const entries = await Promise.all(
          paginatedClients.map(async (client) => {
            const id = client.userId;
            if (!id) return [String(id), 0] as const;
            try {
              const res = await fetch(`/api/admin/enrollees?businessId=${encodeURIComponent(id)}`);
              const json = await res.json();
              let arr: any[] = [];
              if (Array.isArray(json)) arr = json;
              else if (json && Array.isArray(json.data)) arr = json.data;
              else if (json && Array.isArray(json.enrollees)) arr = json.enrollees;
              // Filter by businessId explicitly to ensure correct count
              const filteredByBusiness = arr.filter((e) => String(e.businessId) === String(id));
              const count = filteredByBusiness.length;
              return [String(id), count] as const;
            } catch (e) {
              return [String(id), 0] as const;
            }
          })
        );
        if (!mounted) return;
        const map: Record<string, number> = {};
        for (const [k, v] of entries) map[k] = v;
        setEnrolleeCounts((prev) => ({ ...prev, ...map }));
      } catch (err) {
        // ignore
      }
    };
    if (paginatedClients.length > 0) fetchCounts();
    return () => { mounted = false; };
  }, [paginatedClients]);

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

          <button className="rounded-[10px] bg-primary px-4 py-3 text-sm md:w-38 font-medium text-white hover:bg-primary/90" onClick={() => handleOpenModal('createClient')}>
            Create Client
          </button>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">Loading clients...</p>
          </div>
        ) : !searchTerm && !statusFilter && !planFilter ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">Enter a search term, status, or plan to view clients</p>
          </div>
        ) : paginatedClients.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">No clients match your search criteria</p>
          </div>
        ) : (
        paginatedClients.map((client, idx) => (
          <div key={client?.userId ?? client?.email ?? `client-${startIndex + idx}`} className="rounded-[15px] border border-border p-4 md:p-6 shadow-sm">
            {/* Header with Company Name, Status, Plan */}
            <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 capitalize">{mainCompany(client) || 'Not Provided'}</h3>
                  <p className="text-sm text-slate-600">{mainPlanType(client)}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-1 md:gap-3">
                  <span
                    className={`inline-block rounded-full px-3 w-fit py-1 text-sm font-medium ${
                      isActive(client)
                        ? 'bg-green-100 text-green-700'
                        : client.status === 'Suspended'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {client.status || 'N/A'}
                  </span>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {mainPlan(client)}
                  </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5 bg-[#E5E7EB4D] rounded-[10px] py-3 px-4 md:text-center">
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Total Enrollees</p>
                <p className="text-xl font-bold text-slate-900">{enrolleeCounts[client.userId] ?? client.enrolleeCount ?? '0'}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Active Plans</p>
                <p className="text-xl font-bold text-primary">{client.activePlan || 'N/A'}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Monthly Premium</p>
                <p className="text-xl font-bold text-[#10B981]">₦{Number(client.monthlyPremium ?? 0).toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Outstanding</p>
                <p className="text-xl font-bold text-[#EF4444]">₦{Number(client.outstanding ?? 0).toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Wallet Balance</p>
                <p className="text-xl font-bold text-primary">₦{Number(client.walletBalance ?? 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 items-start justify-between">
              <div className="flex flex-col text-sm space-y-1">
                <div className="flex space-x-2">
                  <p className="text-slate-600">Contact Person:</p>
                  <p className="font-medium text-slate-900">{client.contactPerson || 'N/A'}</p>
                </div>
                <div className='flex space-x-2'>
                  <p className="text-slate-600">Email:</p>
                  <p className="font-medium text-slate-900">{client.email || 'N/A'}</p>
                </div>
                <div className='flex space-x-2'>
                  <p className="text-slate-600">Phone:</p>
                  <p className="font-medium text-slate-900">{client.phone || 'N/A'}</p>
                </div>
                <div className='flex space-x-2'>
                  <p className="text-slate-600">Registration Date:</p>
                  <p className="font-medium text-slate-900">{formatDate(client)}</p>
                </div>
              </div>
              
              {/* Action Menu Button */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-4 col-span-2 justify-end">
                <div>
                  <button onClick={() => handleOpenModal('createInvoice', client)} className="flex gap-2 text-[#ffffff] items-center w-full px-4 py-2 text-left bg-primary cursor-pointer text-sm hover:bg-primary/80 rounded-[10px]">
                    Create Invoice
                  </button>
                </div>
                  <div className="space-y-2">
                    <Link
                      href={`/dashboard/superadmin/clients/enrollees/${client.userId}`}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#E5E7EB4D] cursor-pointer hover:bg-slate-50 rounded-[10px]"
                    >
                      <FaUsers /> View Enrollees ({enrolleeCounts[client.userId] ?? client.enrolleeCount ?? '0'})
                    </Link>
                    <button
                      onClick={() => handleOpenModal('payment', client)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left bg-[#E5E7EB4D] cursor-pointer text-sm hover:bg-slate-50 rounded-[10px]"
                    >
                      <IoWalletOutline /> View Payment
                    </button>
                    <Link
                      href={`/dashboard/superadmin/clients/invoice/${client.userId}`}
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

                    {isActive(client) ? ( 
                    <button
                      onClick={() => handleOpenModal('deactivate', client)}
                      className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#EF4444] hover:bg-[#EF4444]/80 rounded-[10px] cursor-pointer"
                    >
                      <FaBan /> Deactivate Account
                    </button>
                    ) : (
                      <button
                        onClick={() => handleOpenModal('activate', client)}
                        className="flex gap-2 items-center w-full px-4 py-2 text-left text-sm bg-[#10B981] hover:bg-[#10B981]/80 rounded-[10px] cursor-pointer"
                      >
                        <FaPlus /> Activate Account
                      </button>
                    )}
                  </div>
              </div>
            </div>
          </div>
        ))
        )}
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
          clientId={selectedClient.userId}
          clientName={mainCompany(selectedClient) || selectedClient.companyName}
          enrolleeCount={selectedClient.enrolleeCount}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'createInvoice' && selectedClient && (
        <CreateInvoiceModal
          clientName={mainCompany(selectedClient) || selectedClient.companyName}
          clientEmail={selectedClient.email}
          phone={selectedClient.phone}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'payment' && selectedClient && (
        <ViewPaymentModal clientId={selectedClient.userId} clientName={mainCompany(selectedClient) || selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'invoice' && selectedClient && (
        <ViewInvoiceModal
          clientId={selectedClient.userId}
          clientName={mainCompany(selectedClient) || selectedClient.companyName}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'addPlan' && selectedClient && (
        <AddPlanModal clientName={mainCompany(selectedClient) || selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'suspend' && selectedClient && (
        <SuspendAccountModal clientId={selectedClient.userId} clientName={mainCompany(selectedClient) || selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'deactivate' && selectedClient && (
        <DeactivateAccountModal clientId={selectedClient.userId} clientName={mainCompany(selectedClient) || selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'activate' && selectedClient && (
        <ActivateAccountModal clientId={selectedClient.userId} mainCompany={mainCompany(selectedClient) || selectedClient.companyName} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'createClient' && (
        <CreateClientModal
          onClose={() => setActiveModal(null)}
          onCreate={async () => {
            try {
              // Refresh clients list after modal reports creation
              await refetch();
              toast.success('Clients list refreshed');
            } catch (err) {
              console.error('Failed to refresh clients after create', err);
            }
          }}
        />
      )}
    </div>
  );
}
