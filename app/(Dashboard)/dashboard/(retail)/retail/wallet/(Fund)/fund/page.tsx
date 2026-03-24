'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import Image from 'next/image';
import { toast } from 'sonner';
import { useWallet } from '@/Components/WalletContext';
import { useDashboardUser } from '@/Components/DashboardUserProvider';
import { useTransactionRefresh } from '@/Components/TransactionRefreshContext';


const Page = () => {
  const { wallet, loading: walletLoading, refreshWallet } = useWallet(); // <--- use global wallet
  const user = useDashboardUser();
  const { triggerRefresh } = useTransactionRefresh();

  const [formData, setFormData] = useState({ amount: '' });
  const [errors, setErrors] = useState({ amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData({ ...formData, [target.name]: target.value });
    setErrors({ ...errors, [target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { amount: '' };
    let hasError = false;

    if (!formData.amount.trim()) {
      newErrors.amount = 'Field not filled';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    if (!user?.id || !user?.email) {
      toast.error('User data not loaded. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Initialize top-up
      const topupRes = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          amount: formData.amount,
        }),
      });

      const topupData = await topupRes.json();
      if (!topupRes.ok || !topupData.success) {
        toast.error(topupData.message || 'Failed to initialize payment');
        setIsSubmitting(false);
        return;
      }

      const reference = topupData.reference;

      // Now proceed with Paystack
      await loadPaystackScript();
      await startPaystackPayment(Number(formData.amount), user.email, reference);
    } catch (err) {
      console.error('Payment init error', err);
      setIsSubmitting(false);
    }
  };

  const loadPaystackScript = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') return reject(new Error('No window'));
      if ((window as any).PaystackPop) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Paystack script failed to load'));
      document.body.appendChild(script);
    });

  const startPaystackPayment = async (amountNumber: number, userEmail: string, reference: string) => {
    const key = process.env.NEXT_PUBLIC_PAYSTACK_KEY || process.env.NEXT_PUBLIC_PAYSTACK_TEST_KEY || '';
    if (!key) {
      toast.error('Payment key not configured');
      setIsSubmitting(false);
      return;
    }

    const handler = (window as any).PaystackPop.setup({
  key,
  email: userEmail || undefined,
  amount: Math.round(amountNumber * 100), // Paystack expects Kobo
  currency: 'NGN',
  ref: reference,
  onClose: () => {
    setIsSubmitting(false);
    toast.error('Payment window closed');
  },
  callback: async (response: any) => {
    try {
      const verifyRes = await fetch('/api/wallet/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: response.reference }),
      });

      const verifyData = await verifyRes.json();
      setIsSubmitting(false);

      if (verifyRes.ok && verifyData.success) {
        setIsSubmitted(true);
        setFormData({ amount: '' });
        toast.success('Payment successful! Wallet credited.');
        await refreshWallet(); // update balance in UI
        triggerRefresh(); // update transaction history
      } else {
        toast.error('Payment verification failed.');
        console.error('Verification failed', verifyData);
      }
    } catch (err) {
      console.error('Verification error', err);
      setIsSubmitting(false);
      toast.error('Payment verification error.');
    }
  },
});

    handler.openIframe();
  };

  return (
    <section className='p-4'>
      <Link href='/dashboard/retail/wallet' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl' />
      </Link>

      <div className='flex flex-col justify-center items-center mt-6'>
        <div className='flex flex-col gap-10'>
          <p className='text-[18px]'>Fund your wallet for seamless healthcare payments</p>

          <div className='pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px] flex gap-10 flex-col' style={{ height: '20rem' }}>
            <div className='flex items-center justify-center gap-4'>
              <div className='p-1 rounded-full bg-[#49A5EF1A]'>
                <Image src='/Paystack_img.png' alt='Paystack' width={100} height={100} className='h-8 w-fit' />
              </div>
              <h4 className='text-[24px] font-semibold'>Paystack</h4>
            </div>

            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-2'>
                <label htmlFor='amount'>Amount to fund</label>
                <input
                  type='number'
                  name='amount'
                  className='bg-[#F8F9FA] border border-[#E5E7EB] rounded-[10px] px-2 py-1 outline-0'
                  placeholder='0.00'
                  value={formData.amount}
                  onChange={handleChange}
                />
                {errors.amount && <span className='text-red-500/60 text-sm'>{errors.amount}</span>}
              </div>

              <input
                type='submit'
                value={isSubmitting ? 'Sending...' : 'Fund Online'}
                className='btn py-2 rounded-2xl w-full cursor-pointer'
                disabled={isSubmitting}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;