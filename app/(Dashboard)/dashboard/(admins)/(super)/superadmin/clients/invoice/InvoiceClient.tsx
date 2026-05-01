'use client';

import { useState } from 'react';
import { mockInvoices, mockClients } from '../mock-clients';
import { CreditInvoiceModal } from '../components/CreditInvoiceModal';

export function InvoiceClient() {
  const [showCreditModal, setShowCreditModal] = useState(false);

  // Get first client from mock data (would be based on URL params in real implementation)
  const client = mockClients[0];
  const invoices = mockInvoices.filter((inv) => inv.companyName === client.companyName);
  const invoice = invoices[0];

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-slate-600">No invoices found for this client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoice</h1>
        <button
          onClick={() => setShowCreditModal(true)}
          className="rounded-2xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Credit Invoice
        </button>
      </div>

      {/* Invoice Header Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-600">Company Name</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{invoice.companyName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Amount</p>
            <p className="mt-1 text-lg font-semibold text-blue-600">₦{invoice.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Amount Paid</p>
            <p className="mt-1 text-lg font-semibold text-green-600">₦{invoice.amountPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Payment Status</p>
            <p
              className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                invoice.paymentStatus === 'Partial'
                  ? 'bg-yellow-100 text-yellow-700'
                  : invoice.paymentStatus === 'Full'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {invoice.paymentStatus}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
            <div>
              <p className="text-xs text-slate-600">Issued By</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{invoice.issuedBy}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Issue Date</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{invoice.issueDate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Account Manager</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{invoice.accountManager}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Invoice Status</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{invoice.invoiceStatus}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">Payment Link</p>
              <a
                href={invoice.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm font-medium text-blue-600 hover:underline"
              >
                View Link →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Invoice Items</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Item Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Price (₦)</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Total (₦)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-3 text-sm text-slate-900">{item.itemName}</td>
                <td className="px-6 py-3 text-sm text-slate-900">{item.price.toLocaleString()}</td>
                <td className="px-6 py-3 text-sm text-slate-900">{item.quantity}</td>
                <td className="px-6 py-3 text-sm font-medium text-slate-900">
                  {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sub-Invoices Section */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Sub-Invoices</h2>
        </div>
        <div className="p-6 space-y-3">
          {/* Sample sub-invoice */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
            <div>
              <p className="text-sm font-medium text-slate-900">Invoice Number: INV-2024-002</p>
              <p className="text-sm text-slate-600">{invoice.companyName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-600">₦500,000</p>
              <button className="mt-1 text-xs text-blue-600 hover:underline">View Invoice →</button>
            </div>
          </div>

          {/* Sample sub-invoice 2 */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
            <div>
              <p className="text-sm font-medium text-slate-900">Invoice Number: INV-2024-003</p>
              <p className="text-sm text-slate-600">{invoice.companyName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-600">₦250,000</p>
              <button className="mt-1 text-xs text-blue-600 hover:underline">View Invoice →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Invoice Modal */}
      {showCreditModal && (
        <CreditInvoiceModal
          clientName={client.companyName}
          clientEmail={client.email}
          phone={client.phone}
          onClose={() => setShowCreditModal(false)}
        />
      )}
    </div>
  );
}
