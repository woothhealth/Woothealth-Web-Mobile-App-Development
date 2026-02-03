'use client'

import { QuotaFormInput, quotaSchema } from '@/lib/validator/quota'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState, useTransition } from 'react'
import { FaCheckCircle } from 'react-icons/fa'

const FormSection = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
      const [errorMessage, setErrorMessage] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [message, setMessage] = useState("");
      const [isSubmitted, setIsSubmitted] = useState(false);

    const [formInput, setFormInput] = useState<QuotaFormInput>({
      firstName: '',
      lastName: '',
      phone: '+234',
      email: '',
      company: '',
      companyAddress: '',
      employeeNumber: '',
      locate: '',
      message: '',
      check: false
    });
    
        const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
            const { name, value } = e.target;
            setFormInput(prev => ({ ...prev, [name]: value }));
            setFieldErrors(prev => ({ ...prev, [name]: '' })); // clear field error
        };
    
        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value;
    
            if (!value.startsWith("+234")) value = "+234";
    
            const rest = value.slice(4).replace(/\D/g, "");
    
            setFormInput((prev) => ({
                ...prev,
                phone: "+234" + rest,
            }));
        }
    
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setErrorMessage('');
            setFieldErrors({});
    
            const result = quotaSchema.safeParse(formInput);
    
            if (!result.success) {
                const errors: Record<string, string> = {};
    
                result.error.issues.forEach(issue => {
                    const field = issue.path[0] as string;
                    errors[field] = issue.message;
                });
                setFieldErrors(errors);
                return;
            }
            setIsSubmitting(true);
        };
      
        useEffect(() => {
            if (!isSubmitting) return;
    
            const submit = async () => {
                try {
                    const response = await axios.post('https://backend.woothealth.com/signup/',{
                        ...formInput,
                        role: 'business',
                    },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        validateStatus: () => true,
                    }
                    );
    
                    if (response.status === 201) {
                        setErrorMessage('');
                        setIsSubmitted(true);
                        setMessage(response.data ?? 'Registration successful');
                    } else if (response.status === 409) {
                        setErrorMessage(
                        response.data?.message ||
                        response.data?.error ||
                        'User already registered.'
                        );
                    } else {
                        setErrorMessage(
                            response.data?.message ||
                            response.data?.error ||
                            'Sign up failed. Please try again.'
                        );
                    }
                } catch (error: any) {
                    console.error('Error:', error);
                    setErrorMessage(
                        error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message || 'An unexpected error occurred. Please try again'
                        );
                } finally {
                    setIsSubmitting(false);
                };
            };
            submit();
        }, [isSubmitting, formInput]);

  return (
    <section className='relative min-h-screen mb-16'>
        <div className='relative flex flex-col items-center justify-center '>
            <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'>
            </div>
            <div className='absolute formDiv overflow-y-scroll h-screen md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-10 px-8 md:px-16 w-[90%] md:w-[70%]'>
                {isSubmitted && (
                <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                  <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className=" mb-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#49A5EF]/780 text-white px-5 py-3 rounded-sm"
                  >
                    Get Another Quote
                  </button>
                </div>
              ) }
              {!isSubmitted && (
                <div className='flex flex-col gap-2 '>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center mx-2 md:mx-0'>
                    <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label htmlFor="firstName"className='font-semibold'>
                                First Name
                            </label>
                            <input type="text" placeholder='Enter Your Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="firstName" name="firstName" value={formInput.firstName} onChange={handleChange} />
                            {fieldErrors.firstName && <span className="text-red-500/60 text-sm">{fieldErrors.firstName}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label htmlFor="lastName" className='font-semibold'>
                                Last Name
                            </label>
                            <input type="text" placeholder='Enter Your Last Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="lastName" name="lastName" value={formInput.lastName} onChange={handleChange} />
                            {fieldErrors.lastName && <span className="text-red-500/60 text-sm">{fieldErrors.lastName}</span>}
                        </div>
                      </div>
                      <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="phoneNumber">
                                Phone Number
                            </label>
                            <input  type="tel" name="phone" placeholder="+234*******" id="phone" minLength={14} className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formInput.phone} onChange={handlePhoneChange}/>
                    {fieldErrors.phone && <span className="text-red-500/60 text-sm">{fieldErrors.phone}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="email">
                                Email
                            </label>
                            <input type="email" name='email' placeholder='Email' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="email" value={formInput.email} onChange={handleChange} />
                            {fieldErrors.email && <span className="text-red-500/60 text-sm">{fieldErrors.email}</span>}
                        </div>
                    </div>
                      <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="company">
                                Company Name
                            </label>
                            <input type="text" name='company' id="company" placeholder='Enter Your Company Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formInput.company} onChange={handleChange}/>
                            {fieldErrors.company && <span className="text-red-500/60 text-sm">{fieldErrors.company}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="company">
                                Company Address
                            </label>
                            <input type="text" name='companyAddress' id="companyAddress" placeholder='Enter your Company Address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formInput.companyAddress} onChange={handleChange}/>
                            {fieldErrors.companyAddress && <span className="text-red-500/60 text-sm">{fieldErrors.companyAddress}</span>}
                        </div>
                    </div>
                    <div className='flex gap-6 w-full flex-col md:flex-row'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="employeeNumber">
                                Employee Number
                            </label>
                            <input type="number" placeholder='How many employees do you have?' name='employeeNumber' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="employeeNumber" value={formInput.employeeNumber} onChange={handleChange} />
                            {fieldErrors.employeeNumber && <span className="text-red-500/60 text-sm">{fieldErrors.employeeNumber}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="locate">
                        State
                    </label>
                    <input type="text" name='locate' placeholder='Enter your location' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="locate" value={formInput.locate} onChange={handleChange} />
                    {fieldErrors.locate && <span className="text-red-500/60 text-sm">{fieldErrors.locate}</span>}
                </div>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="message">
                                Message
                            </label>
                            <textarea name='message' placeholder='Write a message' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-4 resize-none h-30 placeholder:text-sm' value={formInput.message} onChange={handleChange}></textarea>
                            {fieldErrors.message && <span className="text-red-500/60 text-sm">{fieldErrors.message}</span>}
                    </div>
                    <div className='w-full'>
                      <div className='flex items-center gap-2'>
                        <input type="checkbox" name="check" id="check" checked={formInput.check} onChange={handleChange} />
                        <label htmlFor="check" className='w-sm text-sm'>I have read and agreed to Woot Health’s Terms of Use and Privacy Policy*</label>
                      </div>
                      {fieldErrors.check && <span className="text-red-500/60 text-sm">{fieldErrors.check}</span>}
                    </div>

                     <div id="error-message" className="mt-4 text-center text-red-500 text-sm font-semibold"></div>

                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-fit mt-1'>
                      {isSubmitting ? 'Sending...' : 'SUBMIT'}
                    </button>
                </form>
                <div className='text-center mt-6'>
                  <p className='text-base md:text-lg'>Have an account? { " "}
                    <Link href={`/login`} className='text-[#49A5EF] underline'>Login</Link>
                  </p>
                </div>
            </div>
            )}
            </div>
        </div>
    </section>
  )
}

export default FormSection