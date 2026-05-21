'use client';

import React from 'react';
import { FaRegHospital, FaWpforms, FaX } from 'react-icons/fa6';
import { toast } from 'sonner';

interface Billing {
  id: string;
  date: string;
  invoiceNo: string;
  status: 'paid' | 'denied';
  hmoId: string;
  dueDate: string;
  amount: number;
  billTo: {
    name: string;
    address: string;
    email: string;
    tel: string;
  };
  billFrom: {
    name: string;
    address: string;
    email: string;
    tel: string;
  };
  treatments: {
    itemCode: string;
    desc: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  paymentInfo: {
    method: string;
    transactionId: string;
    paymentDate: string;
  };
}

const getStatusColor = (status: 'paid' | 'denied') => {
  return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

interface InvoiceModalProps {
  billing: Billing;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ billing, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    toast.success('Invoice downloaded successfully!');
  };

  const handlePrint = () => {
    toast.success('Invoice sent to printer!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center py-4 bg-black/50">
      <div className="bg-white rounded-[15px] shadow-xl md:w-2xl w-full h-full overflow-y-auto">
        <div className="">
          <div className="flex justify-end mb-4 p-6">
            <FaX onClick={onClose} className="font-semibold" size={22} />
          </div>

          {/* Payment Status and Amount */}
          <div className="flex justify-between items-center px-6 pb-4 border-b border-border">
            <div className='flex flex-col space-y-1'>
              <span className="font-medium">Payment Status:</span>
              <span className={`px-4 py-1 w-fit rounded-full text-sm font-semibold ${getStatusColor(billing.status)}`}>
                {billing.status.charAt(0).toUpperCase() + billing.status.slice(1)}
              </span>
            </div>
            <div className='flex flex-col space-y-1'>
              <span className="font-medium">Amount:</span>
              <span className="font-bold text-lg">₦{billing.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Bill To and Bill From */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold mb-1 flex gap-2">
               <FaRegHospital size={24} /> Bill To
              </h3>
              <div className="text-sm">
                <p>{billing.billTo.name}</p>
                <p>{billing.billTo.address}</p>
                <p>{billing.billTo.email}</p>
                <p>{billing.billTo.tel}</p>
              </div>
            </div>
            <div className='text-end'>
              <h3 className="text-lg font-semibold mb-1 justify-end flex gap-2">
                <FaWpforms size={20} /> Bill From
              </h3>
              <div className="text-sm">
                <p>{billing.billFrom.name}</p>
                <p>{billing.billFrom.address}</p>
                <p>{billing.billFrom.email}</p>
                <p>{billing.billFrom.tel}</p>
              </div>
            </div>
          </div>

          {/* Treatment Description & Services Rendered */}
          <div className="mb-6 px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Description & Services Rendered</h3>
            <div className="overflow-x-auto px-4">
              <table className="w-full border-collapse bg-[#ffffff] rounded-[10px] shadow-sm">
                <thead>
                  <tr className="bg-[#E5E7EB] border-b border-border">
                    <th className="px-4 py-2 text-left">Item Code</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-center">Quantity</th>
                    <th className="px-4 py-2 text-left">Unit Price</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.treatments.map((item, index) => (
                    <tr key={index} className="border-b border-border text-[15px]">
                      <td className="px-4 py-2">{item.itemCode}</td>
                      <td className="px-4 py-2">{item.desc}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2">₦{item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2">₦{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#E5E7EB] border-t border-border">
                    <td colSpan={4} className="px-4 py-2 text-right font-semibold">Total Billed Amount:</td>
                    <td className="px-4 py-2 font-bold">₦{billing.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Subtotal, Tax, Total */}
          <div className="mb-6 border-b border-border px-6 pb-4">
            <div className="flex flex-col bg-gray-50 rounded-lg">
                <p className='flex justify-between'><span className="font-medium">Subtotal:</span> ₦{billing.subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className='flex justify-between'><span className="font-medium">Tax ({billing.taxPercent}%):</span> ₦{billing.taxAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="font-bold text-lg flex justify-between"><span className="font-medium">Total Amount:</span> ₦{billing.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
          </div>

          {/* Payment Information */}
          <div className="mb-6 border-b border-border px-6 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
            <div className="space-y-1">
              <p className='flex justify-between'><span className="font-medium">Payment Method:</span> {billing.paymentInfo.method}</p>
              <p className='flex justify-between'><span className="font-medium">Transaction ID:</span> {billing.paymentInfo.transactionId}</p>
              <p className='flex justify-between'><span className="font-medium">Payment Date:</span> {billing.paymentInfo.paymentDate}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between w-[80%] mx-auto mb-6">
            <div
              onClick={handleDownload}
              className="px-8 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
            >
              Download Invoice
            </div>
            <div
              onClick={handlePrint}
              className="px-8 py-2 bg-[#E5E7EB] rounded-md hover:bg-gray-300 border border-border cursor-pointer"
            >
              Print Invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
export type { Billing };