'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'
import { EmployeeFormInput, employeeSchema } from "@/lib/validator/employee";

const AddEmployeeClient = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formInput, setFormInput] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    department: string;
    gender: string;
    plan: string;
    status: 'active' | 'inactive';
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    department: '',
    gender: '',
    plan: '',
    status: 'active',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' })); // clear field error
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage('');
    setFieldErrors({});
    setIsSubmitting(true);

    const result = employeeSchema.safeParse(formInput);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/enrollees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInput),
      });

      const data = await res.json();

      if (res.status === 201) {
        // Verify we actually got a created enrollee, not just a list response
        if (data && typeof data === 'object' && data.success === true && Array.isArray(data.data) && data.data.length === 0) {
          // Backend returned list format instead of created enrollee - this is an error
          setErrorMessage('Error');
          console.error('❌ Frontend detected backend returning list instead of created enrollee:', data);
        } else {
          // Success - we got a proper created enrollee response
          setIsSubmitted(true);
          setMessage(data?.message || 'Enrollee added successfully!');
          setErrorMessage('');
          // Reset form after successful submission
          setFormInput({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            department: '',
            gender: '',
            plan: '',
            status: 'active',
          });
        }
      } else if (res.status === 409) {
        const msg = data?.error || data?.details?.data?.error || 'Enrollee already exists.';
        setErrorMessage(msg);
      } else if (res.status === 400) {
        const msg = data?.error || data?.details?.data?.error || 'Invalid enrollee data.';
        setErrorMessage(msg);
      } else if (res.status === 500) {
        const msg = data?.error || 'Server error occurred. Please try again.';
        setErrorMessage(msg);
      } else {
        const msg = data?.error || data?.details?.data?.error || 'Failed to add enrollee. Please try again.';
        setErrorMessage(msg);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
      <>
    <section className='py-4 md:p-4'>
      <Link href='/dashboard/superadmin/enrollees' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
      <div className='flex flex-col md:justify-center md:items-center mt-6'>
        <div className='flex flex-col gap-6 md:w-lg'>
            <div>
                <p className='text-[18px] text-center md:text-start'>Add an enrollee?</p>
                <p className='text-[16px] text-gray-600 text-center md:text-start'>Complete the form below to begin their enrollment.</p>
            </div>
            <div className='pt-3 md:pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px]'>
              {isSubmitted ? (
                  <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                    <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Enrollee added Successfully!
                    </h3>
                    <p className=" mb-6">
                      Thank you for the addition. Please refresh the enrollee list to see the new enrollee.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-col md:flex-row">
                      <Link
                        href={`/dashboard/superadmin/enrollees`}
                        className="bg-[#49A5EF]/780 text-white px-4 md:px-10 font-semibold py-2 md:py-3 rounded-lg mr-4"
                      >
                        View Enrollee List
                      </Link>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormInput({
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            dateOfBirth: '',
                            department: '',
                            gender: '',
                            plan: '',
                            status: 'active',
                          });
                          setFieldErrors({});
                          setErrorMessage('');
                        }}
                        className="bg-gray-500 text-white px-4 md:px-10 font-semibold  py-2 md:py-3 rounded-sm"
                      >
                        Add Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                  <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="firstName"className='font-semibold'>
                        First Name
                      </label>
                      <input type="text" placeholder='Enter first name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="firstName" name="firstName" value={formInput.firstName} onChange={handleChange} />
                      {fieldErrors.firstName && <span className="text-red-500/60 text-sm">{fieldErrors.firstName}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="lastName"className='font-semibold'>
                        Last Name
                      </label>
                      <input type="text" placeholder='Enter last name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="lastName" name="lastName" value={formInput.lastName} onChange={handleChange} />
                      {fieldErrors.lastName && <span className="text-red-500/60 text-sm">{fieldErrors.lastName}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="email" className='font-semibold'>
                        Email Address
                      </label>
                      <input type="email" placeholder='Enter Email Address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="email" name="email" value={formInput.email} onChange={handleChange}/>
                      {fieldErrors.email && <span className="text-red-500/60 text-sm">{fieldErrors.email}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="phone">
                        Phone Number
                      </label>
                      <input type="tel" name='phone' placeholder='Enter phone number' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="phone" value={formInput.phone} onChange={handleChange} />
                      {fieldErrors.phone && <span className="text-red-500/60 text-sm">{fieldErrors.phone}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="department">
                        Department
                      </label>
                      <input type="text" name='department' placeholder='Enter Department' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="department" value={formInput.department} onChange={handleChange} />
                      {fieldErrors.department && <span className="text-red-500/60 text-sm">{fieldErrors.department}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="dateOfBirth">
                        Date of Birth
                      </label>
                      <input type="date" name='dateOfBirth' placeholder='Enter date of birth' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="dateOfBirth" value={formInput.dateOfBirth} onChange={handleChange} />
                      {fieldErrors.dateOfBirth && <span className="text-red-500/60 text-sm">{fieldErrors.dateOfBirth}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="gender">
                        Gender
                      </label>
                      <select name='gender' id="gender" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formInput.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {fieldErrors.gender && <span className="text-red-500/60 text-sm">{fieldErrors.gender}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="plan">
                        Plan
                      </label>
                      <select name='plan' id="plan" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formInput.plan} onChange={handleChange}>
                        <option value="">Select Plan type</option>
                        <option value="Core">Core</option>
                        <option value="Sync">Sync</option>
                        <option value="Nexus">Nexus</option>
                        <option value="Quantum">Quantum</option>
                        <option value="Ignite">Ignite</option>
                      </select>
                      {fieldErrors.plan && <span className="text-red-500/60 text-sm">{fieldErrors.plan}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="status">
                        Status
                      </label>
                      <select name='status' id="status" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formInput.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {fieldErrors.status && <span className="text-red-500/60 text-sm">{fieldErrors.status}</span>}
                    </div>

                    {errorMessage && <span className="text-red-500/60 text-sm text-center">{errorMessage}</span>}
                    {message && !errorMessage && <span className="text-green-600/80 text-sm text-center">{message}</span>}

                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm mt-3'>
                      {isSubmitting ? 'Adding Enrollee...' : 'Add Enrollee'}
                    </button>
                </form>
              </div>
              )}
              </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default AddEmployeeClient