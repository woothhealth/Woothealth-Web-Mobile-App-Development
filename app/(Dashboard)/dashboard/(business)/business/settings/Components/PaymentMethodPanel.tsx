'use client'

import { LuTrash2 } from 'react-icons/lu'
import { RiMastercardFill, RiVisaLine } from 'react-icons/ri'

interface PaymentMethod {
  id: string;
  cardType: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  addedDate: string;
  status: string;
}

interface PaymentMethodPanelProps {
  paymentMethods?: PaymentMethod[];
  onDelete?: (methodId: string) => void;
}

export default function PaymentMethodPanel({ paymentMethods = [], onDelete }: PaymentMethodPanelProps) {
  const getCardIcon = (cardType: string) => {
    const type = cardType.toLowerCase();
    if (type.includes('visa')) return <RiVisaLine className="text-2xl text-blue-600" />;
    if (type.includes('mastercard')) return <RiMastercardFill className="text-2xl text-[#EF4444]" />;
    if (type.includes('amex')) return <span className="text-2xl">💳</span>;
    return <span className="text-2xl">💳</span>;
  };

  const isExpired = (month: string, year: string) => {
    const now = new Date();
    const expiryYear = parseInt('20' + year);
    const expiryMonth = parseInt(month);
    return now.getFullYear() > expiryYear ||
           (now.getFullYear() === expiryYear && now.getMonth() + 1 > expiryMonth);
  };

  return (
    <section className='flex flex-col space-y-6 bg-[#FFFFFF] rounded-xl p-6'>
      <div>
        <h3 className="text-xl font-semibold">Payment Methods</h3>
        <p className='text-[15px]'>Manage your saved payment cards</p>
      </div>

      {paymentMethods.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <p>No payment methods saved yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {paymentMethods.map((method) => {
            const expired = isExpired(method.expiryMonth, method.expiryYear);
            return (
              <div
                key={method.id}
                className={`border rounded-[10px] p-4 flex justify-between items-center ${
                  expired ? 'border-red-300 bg-red-50' : 'border-[#D9D9D9]'
                }`}
              >
                <div className='flex-1'>
                  <div className='flex items-center space-x-3'>
                    <span className='text-2xl'>{getCardIcon(method.cardType)}</span>
                    <div>
                      <h4 className='font-semibold text-[15px]'>
                        {method.cardType.toUpperCase()} **** {method.lastFour}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Expires {method.expiryMonth.padStart(2, '0')}/{method.expiryYear}
                      </p>
                    </div>
                    {method.isDefault && (
                      <span className='flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold'>
                        <span>Default</span>
                      </span>
                    )}
                    {expired && (
                      <span className='bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold'>
                        Expired
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete?.(method.id)}
                  disabled={method.isDefault}
                  className='p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  title={method.isDefault ? "Cannot delete default payment method" : "Delete"}
                >
                  <LuTrash2 className='text-lg text-red-600' />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
