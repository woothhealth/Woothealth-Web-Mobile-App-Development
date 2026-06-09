 'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { CreditInvoiceModal } from '../components/CreditInvoiceModal';
import { MdArrowBack } from 'react-icons/md';

export function InvoiceClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const clientIdFromQuery = searchParams.get('clientId');

  const clientId = (() => {
    if (clientIdFromQuery) return clientIdFromQuery;
    if (!pathname) return null;
    const parts = pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    // If path ends with 'invoice' there's no id segment
    if (!last || last.toLowerCase() === 'invoice') return null;
    return last;
  })();

  const [showCreditModal, setShowCreditModal] = useState(false);
  const [client, setClient] = useState<any | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const clientRes = await fetch(`/api/admin/clients?clientId=${encodeURIComponent(clientId)}`, { credentials: 'include' });
        const clientJson = await clientRes.json().catch(() => null);
        const clientData = clientJson?.data || clientJson;
        setClient(clientData);
        // eslint-disable-next-line no-console
        console.debug('InvoiceClient fetched client:', clientJson);

        // Try to fetch invoices for this client
        try {
          const invRes = await fetch(`/api/admin/invoices?clientId=${encodeURIComponent(clientId)}`, { credentials: 'include' });
          const invJson = await invRes.json().catch(() => null);
          const invData = invJson?.data || invJson || [];
          setInvoices(Array.isArray(invData) ? invData : []);
          // eslint-disable-next-line no-console
          console.debug('InvoiceClient fetched invoices:', invJson);
        } catch (invErr) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch invoices for client', clientId, invErr);
          setInvoices([]);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch client for invoice page', err);
        setClient(null);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [clientId]);

  const invoice = invoices[0];
  const statusColors: Record<string, string> = {
    active: 'text-green-600',
    Pending: 'text-yellow-600',
  };

  if (!clientId) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Missing clientId in URL. Open this page with `?clientId=`.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Loading client data...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 h-50 flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-600">No invoices found for this client.</p>
        <Link href="/dashboard/superadmin/clients" className="border border-border rounded-[15px] p-2 hover:bg-slate-50 flex w-fit items-center gap-2">
          <MdArrowBack size={22} /> Go Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 md:w-[80%]">
      <Link href="/dashboard/superadmin/clients" className="border border-border rounded-full p-2 hover:bg-slate-50 flex w-fit">
        <MdArrowBack size={22} />
      </Link>
      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-2xl font-semibold">Invoice</h1>
        <div
          onClick={() => setShowCreditModal(true)}
          className="rounded-[10px] bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/80 cursor-pointer"
        >
          Credit Invoice
        </div>
      </div>

      <div className="rounded-[10px] bg-white space-y-6 shadow-sm">
      {/* Invoice Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col divide-y divide-border">
          <div className='px-4 md:px-6 py-2'>
            <p className="text-xl font-semibold text-slate-900">{invoice.companyName || client?.companyName || client?.company || client?.name}</p>
          </div>
          <div className='px-4 md:px-6 py-2 flex justify-between items-center'>
            <p className="">Invoice Reference Code</p>
            <p className="font-medium">{invoice.invoiceNumber}</p>
          </div>
          <div className='px-4 md:px-6 py-2 flex justify-between items-center bg-[#D1FAE580]'>
            <p className="text-[#10B981]">Amount</p>
            <p className="font-medium text-primary">₦{invoice.amount.toLocaleString()}</p>
          </div>
          <div className='px-4 md:px-6 py-2 flex justify-between items-center bg-[#EF444433]'>
            <p className="text-[#EF4444]">Amount Paid</p>
            <p className="font-medium text-primary">₦{invoice.amountPaid.toLocaleString()}</p>
          </div>
          <div className='px-4 md:px-6 py-2 flex justify-between items-center bg-[#FEF3C780]'>
            <p className="text-[#F59E0B]">Payment Status</p>
            <p className={`text-primary font-medium `}>
              {invoice.paymentStatus}
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border">
            <div className='px-4 md:px-6 py-2 flex justify-between items-center'>
              <p className="">Issued By</p>
                <p className="font-medium text-primary">{invoice.issuedBy}</p>
            </div>
            <div className='px-4 md:px-6 py-2 flex justify-between items-center'>
              <p className="">Issue Date</p>
              <p className="font-medium text-primary">{invoice.issueDate}</p>
            </div>
            <div className='px-4 md:px-6 py-2 flex justify-between items-center'>
              <p className="">Account Manager</p>
              <p className="font-medium text-primary">{invoice.accountManager}</p>
            </div>
            <div className='px-4 md:px-6 py-2 flex justify-between items-center'>
              <p className="">Invoice Status</p>
              <p className={`font-medium ${statusColors[invoice.invoiceStatus] || 'text-slate-600'}`}>
                {invoice.invoiceStatus}
              </p>
            </div>
            <div className='px-4 md:px-6 py-2 flex justify-between items-center'>
              <p className="w-fit">Payment Link</p>
              <a
                href={invoice.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {invoice.paymentLink}
              </a>
            </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="pb-6 overflow-auto w-full">
        <h2 className="font-semibold text-2xl py-2 text-center">Invoice Items</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 md:px-6 py-3 text-left font-semibold">Item Name</th>
              <th className="px-4 md:px-6 py-3 text-left font-semibold">Price</th>
              <th className="px-4 md:px-6 py-3 text-left font-semibold">Quantity</th>
              <th className="px-4 md:px-6 py-3 text-left font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item : any) => (
              <tr key={item.id} className="divide-y divide-border">
                <td className="px-4 md:px-6 py-3">{item.itemName}</td>
                <td className="px-4 md:px-6 py-3">#{item.price.toLocaleString()}</td>
                <td className="px-2 md:px-6 py-3">{item.quantity}</td>
                <td className="px-4 md:px-6 py-3 font-medium border-b border-border">
                  #{(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      {/* Sub-Invoices Section */}
      <div className="rounded-[10px] bg-[#ffffff] shadow-sm">
        <h2 className="font-semibold text-xl px-4 md:px-6 py-4 border-b border-border">Sub-Invoices</h2>
        <div className="space-y-2 divide-y divide-border">
          {/* Sample sub-invoice */}
          <div className="flex flex-col space-y-2 py-4">
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between px-4 md:px-6">
            <div className="space-y-1">
              <p className="font-medium text-lg">Invoice Number: INV-2024-002</p>
              <p className="">{invoice.companyName}</p>
              <p className="font-medium">₦500,000</p>
            </div>
            <div className="text-right">
              <button className="text-xs px-6 py-2 bg-primary text-white hover:bg-primary/80 rounded-[10px]">View Invoice</button>
            </div>
          </div>
          <div className="flex justify-center py-2 px-6 bg-[#E5E7EB80]">
            <p className="text-center">
              Issued by {invoice.issuedBy} on {invoice.issueDate}
            </p>
          </div>
          </div>

          {/* Sample sub-invoice 2 */}
          <div className="flex flex-col space-y-2 py-4">
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between px-4 md:px-6">
            <div className="space-y-1">
              <p className="font-medium text-lg">Invoice Number: INV-2024-003</p>
              <p className="">{invoice.companyName}</p>
              <p className="font-medium">₦250,000</p>
            </div>
            <div className="text-right">
              <button className="text-xs px-6 py-2 bg-primary text-white hover:bg-primary/80 rounded-[10px]">View Invoice</button>
            </div>
          </div>
          <div className="flex justify-center py-2 px-6 bg-[#E5E7EB80]">
            <p className="text-center">
              Issued by {invoice.issuedBy} on {invoice.issueDate}
            </p>
          </div>
          </div>
        </div>
      </div>

      {/* Credit Invoice Modal */}
      {showCreditModal && client && (
        <CreditInvoiceModal
          clientId={client.userId}
          clientName={client.companyName || client.company || client.name}
          clientEmail={client.email}
          phone={client.phone}
          onClose={() => setShowCreditModal(false)}
        />
      )}
    </div>
  );
}
