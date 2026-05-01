'use client';

import { useState } from 'react';

interface CreditInvoiceItem {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
}

interface CreditInvoiceModalProps {
  clientName: string;
  clientEmail: string;
  phone: string;
  onClose: () => void;
}

export function CreditInvoiceModal({ clientName, clientEmail, phone, onClose }: CreditInvoiceModalProps) {
  const [items, setItems] = useState<CreditInvoiceItem[]>([
    { id: '1', itemName: '', price: 0, quantity: 1 },
  ]);
  const [invoiceRefNo, setInvoiceRefNo] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Partial');
  const [issuedBy, setIssuedBy] = useState('Admin User');
  const [accountManager, setAccountManager] = useState('Sarah Williams');
  const [vat, setVat] = useState(7.5);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateItem = (id: string, field: keyof CreditInvoiceItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    const newItem: CreditInvoiceItem = {
      id: Math.random().toString(),
      itemName: '',
      price: 0,
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatAmount = subtotal * (vat / 100);
  const totalDue = subtotal + vatAmount;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!invoiceRefNo.trim()) newErrors.invoiceRefNo = 'Invoice reference number is required';
    if (!issueDate) newErrors.issueDate = 'Issue date is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!amount.trim()) newErrors.amount = 'Amount is required';
    if (amount && isNaN(Number(amount))) newErrors.amount = 'Amount must be a number';
    if (!amountPaid.trim()) newErrors.amountPaid = 'Amount paid is required';
    if (amountPaid && isNaN(Number(amountPaid))) newErrors.amountPaid = 'Amount paid must be a number';

    items.forEach((item, index) => {
      if (!item.itemName.trim()) newErrors[`itemName-${item.id}`] = 'Item name is required';
      if (item.price <= 0) newErrors[`price-${item.id}`] = 'Price must be greater than 0';
      if (item.quantity <= 0) newErrors[`quantity-${item.id}`] = 'Quantity must be greater than 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const invoiceData = {
        invoiceRefNo,
        issueDate,
        dueDate,
        amount,
        amountPaid,
        paymentStatus,
        billTo: {
          clientName,
          clientEmail,
          accountManager,
          phone,
        },
        items,
        subtotal,
        vat,
        vatAmount,
        totalDue,
        issuedBy,
      };
      alert('Credit invoice submitted successfully!');
      console.log(invoiceData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40">
      <div className="my-8 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Create Credit Invoice</h2>

        <div className="mt-6 space-y-6">
          {/* Invoice Data Section */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Invoice Data</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Invoice Ref No</label>
                <input
                  type="text"
                  value={invoiceRefNo}
                  onChange={(e) => setInvoiceRefNo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="INV-2024-001"
                />
                {errors.invoiceRefNo && <p className="mt-1 text-xs text-red-500">{errors.invoiceRefNo}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                {errors.issueDate && <p className="mt-1 text-xs text-red-500">{errors.issueDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Amount Paid (₦)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
                {errors.amountPaid && <p className="mt-1 text-xs text-red-500">{errors.amountPaid}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option>Partial</option>
                  <option>Full</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billed To Section */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Billed To</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  disabled
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  disabled
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Account Manager</label>
                <input
                  type="text"
                  value={accountManager}
                  onChange={(e) => setAccountManager(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Phone</label>
                <input
                  type="text"
                  value={phone}
                  disabled
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items Section */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Invoice Items</h3>
              <button
                onClick={addItem}
                className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-200"
              >
                + Add Item
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Item Name</label>
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Plan name"
                    />
                    {errors[`itemName-${item.id}`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`itemName-${item.id}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700">Price (₦)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                    {errors[`price-${item.id}`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`price-${item.id}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="1"
                    />
                    {errors[`quantity-${item.id}`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`quantity-${item.id}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700">Total (₦)</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        value={item.price * item.quantity}
                        disabled
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
                      />
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-lg bg-red-100 px-2 py-2 text-red-600 hover:bg-red-200"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">VAT (%):</label>
                  <input
                    type="number"
                    value={vat}
                    onChange={(e) => setVat(Number(e.target.value))}
                    className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    step="0.1"
                  />
                </div>
                <span className="font-medium">₦{vatAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200">
                <span>Total Due:</span>
                <span className="text-blue-600">₦{totalDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Issued By */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Invoice Issued By</label>
            <select
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option>Admin User</option>
              <option>Finance Manager</option>
              <option>Sales Manager</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 border-t border-slate-200 pt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300"
            disabled={Object.keys(errors).length > 0}
          >
            Submit Credit Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
