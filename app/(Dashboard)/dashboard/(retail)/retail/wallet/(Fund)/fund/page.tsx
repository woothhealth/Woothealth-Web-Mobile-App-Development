"use client"

import React, { useEffect, useState } from "react"
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import Image from 'next/image'
import { toast } from 'sonner';

const Page = () => {

  const [formData, setFormData] = useState({
        amount: ''
      });
      const [email, setEmail] = useState('');
      const [errors, setErrors] = useState({
        amount: ''
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isSubmitted, setIsSubmitted] = useState(false);
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setFormData({
          ...formData,
          [target.name]: target.value
        });
        setErrors({
          ...errors,
          [target.name]: ''
        });
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { amount: ''};
        let hasError = false;
    
        if (!formData.amount.trim()) {
          newErrors.amount = 'Field not filled';
          hasError = true;
        }
  
        setErrors(newErrors);
    
        if (hasError) return;
    
        setIsSubmitting(true);
        // Initialize Paystack payment
        try {
          await loadPaystackScript();
          await startPaystackPayment(Number(formData.amount), email);
        } catch (err) {
          console.error('Payment init error', err);
          setIsSubmitting(false);
        }
      };

      useEffect(() => {
        // Fetch user email from /api/me
        const fetchEmail = async () => {
          try {
            const res = await fetch('/api/me', { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            // backend may return different shapes; try common fields
            const userEmail = data?.email || data?.user?.email || data?.data?.email || '';
            setEmail(userEmail);
          } catch (e) {
            // ignore
          }
        };
        fetchEmail();
      }, []);

      const loadPaystackScript = () => {
        return new Promise<void>((resolve, reject) => {
          if (typeof window === 'undefined') return reject(new Error('No window'));
          if ((window as any).PaystackPop) return resolve();
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Paystack script failed to load'));
          document.body.appendChild(script);
        });
      };

      const startPaystackPayment = async (amountNumber: number, userEmail: string) => {
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
          ref: '' + Date.now(),
          onClose: function() {
            setIsSubmitting(false);
            // user closed payment
          },
          callback: function(response: any) {
            (async () => {
              try {
                const verifyRes = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reference: response.reference }),
                });
                const verifyData = await verifyRes.json();
                setIsSubmitting(false);

                  if (verifyRes.ok && verifyData?.data?.data?.status === 'success') {
                  setIsSubmitted(true);
                  setFormData({ amount: '' });
                  toast.success('Payment successful. Reference: ' + response.reference);
                  // TODO: call backend to credit wallet if needed
                } else {
                  console.error('Verification failed', verifyData);
                  toast.error('Payment verification failed');
                }
              } catch (e) {
                console.error('Verification error', e);
                setIsSubmitting(false);
                toast.error('Payment verification error');
              }
            })();
          }
        });

        handler.openIframe();
      };

  return (
    <section className='p-4'>
      <Link href='/dashboard/retail/wallet' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
      <div className='flex flex-col justify-center items-center mt-6'>
        <div className='flex flex-col gap-10'>
          <p className='text-[18px]'>Fund your wallet for seamless healthcare payments</p>
            <div className='pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px] flex gap-10 flex-col' style={{height: '20rem'}}>
              <div className='flex items-center justify-center gap-4'>
                <div className='p-1 rounded-full bg-[#49A5EF1A]'>
                  <Image src='/Paystack_img.png' alt='Paystack' width={100} height={100} className='h-8 w-fit' />
                </div>
                <h4 className='text-[24px] font-semibold'>Paystack</h4>
              </div>
              <form action="" className='flex flex-col gap-6' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="amount">
                    Amount to fund
                  </label>
                  <input type="number" name='amount' className='bg-[#F8F9FA] border border-[#E5E7EB] rounded-[10px] px-2 py-1 outline-0' placeholder='0.00' value={formData.amount} onChange={handleChange} />
                  {errors.amount && <span className="text-red-500/60 text-sm">{errors.amount}</span>}
                </div>
                <input type="submit" value={`${isSubmitting ? 'Sending...' : 'Fund Onine'}`} className='btn py-2 rounded-2xl w-full cursor-pointer' disabled={isSubmitting}/>
              </form>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Page