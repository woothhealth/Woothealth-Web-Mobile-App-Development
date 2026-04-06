'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaRegUser } from 'react-icons/fa6'
import { FaCheckCircle, FaUpload } from 'react-icons/fa'
import Image from 'next/image'

const AddEnrolleeClient = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formInput, setFormInput] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    plan: '',
    residentialAddress: '',
    enrollmentDate: '',
    gender: '',
    expiryDate: '',
    dependents: '',
    autoBilling: 'no',
    nationality: '',
    // image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormInput(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage('');
    setFieldErrors({});
    setIsSubmitting(true);

    // Basic validation
    const errors: Record<string, string> = {};
    if (!formInput.name) errors.name = 'Enrollee name is required';
    if (!formInput.email) errors.email = 'Email is required';
    if (!formInput.phone) errors.phone = 'Phone number is required';
    if (!formInput.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formInput.plan) errors.plan = 'Plan is required';
    if (!formInput.residentialAddress) errors.residentialAddress = 'Residential address is required';
    if (!formInput.enrollmentDate) errors.enrollmentDate = 'Enrollment date is required';
    if (!formInput.gender) errors.gender = 'Gender is required';
    if (!formInput.expiryDate) errors.expiryDate = 'Expiry date is required';
    if (!formInput.nationality) errors.nationality = 'Nationality is required';

    if (Object.keys(errors).length > 0) {
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

      if (res.status === 201 || res.status === 200) {
        setIsSubmitted(true);
        setMessage(data?.message || 'Enrollee added successfully!');
        setErrorMessage('');
        setFormInput({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          plan: '',
          residentialAddress: '',
          enrollmentDate: '',
          gender: '',
          expiryDate: '',
          dependents: '',
          autoBilling: 'no',
          nationality: '',
          // image: null,
        });
        // setImagePreview(null);
      } else if (res.status === 409) {
        const msg = data?.error || 'Enrollee already exists.';
        setErrorMessage(msg);
      } else if (res.status === 400) {
        const msg = data?.error || 'Invalid enrollee data.';
        setErrorMessage(msg);
      } else if (res.status === 500) {
        const msg = data?.error || 'Server error occurred. Please try again.';
        setErrorMessage(msg);
      } else {
        const msg = data?.error || 'Failed to add enrollee. Please try again.';
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
      <section className='py-4 md:p-0'>
        <div className='flex flex-col md:justify-center md:items-center'>
          <div className='flex flex-col gap-6 md:w-[80%]'>
            <div>
              <p className='text-[18px] font-semibold text-center md:text-start'>Add an Enrollee?</p>
              <p className='text-[16px] text-gray-600 text-center md:text-start'>Complete the form below to add a new enrollee.</p>
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
                          name: '',
                          email: '',
                          phone: '',
                          dateOfBirth: '',
                          plan: '',
                          residentialAddress: '',
                          enrollmentDate: '',
                          gender: '',
                          expiryDate: '',
                          dependents: '',
                          autoBilling: 'no',
                          nationality: '',
                          // image: null,
                        });
                        // setImagePreview(null);
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
                <div className=''>
                  <form onSubmit={handleSubmit} className='flex flex-col space-y-6 w-full'>
                    {/* <div className='flex flex-col gap-2 items-center justify-center'>
                        <div className='border-2 border-dashed border-[#cbcdd1] rounded-full p-4 text-center cursor-pointer hover:border-[#49A5EF]' onClick={() => fileInputRef.current?.click()}>
                            {imagePreview ? (
                                <div className='relative w-32 h-32 mx-auto'>
                                    <Image src={imagePreview} alt="Preview" fill className='object-contain' />
                                </div>
                            ) : (
                                <FaRegUser className='text-4xl text-gray-400' />
                            )}
                        </div>
                        <label className='flex items-center gap-2 font-semibold text-gray-400'><FaUpload /> Upload Photo</label>
                        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </div> */}
                    <div className='flex flex-col gap-6 md:flex-row w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="name" className='font-semibold'>Enrollee Name</label>
                        <input type="text" placeholder='Enter enrollee name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="name" name="name" value={formInput.name} onChange={handleChange} />
                        {fieldErrors.name && <span className="text-red-500/60 text-sm">{fieldErrors.name}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                        <label htmlFor="email" className='font-semibold'>Email Address</label>
                        <input type="email" placeholder='Enter email address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="email" name="email" value={formInput.email} onChange={handleChange}/>
                        {fieldErrors.email && <span className="text-red-500/60 text-sm">{fieldErrors.email}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 md:flex-row w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="phone">Phone Number</label>
                        <input type="tel" name='phone' placeholder='Enter phone number' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="phone" value={formInput.phone} onChange={handleChange} />
                        {fieldErrors.phone && <span className="text-red-500/60 text-sm">{fieldErrors.phone}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="dateOfBirth">Date of Birth</label>
                        <input type="date" name='dateOfBirth' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="dateOfBirth" value={formInput.dateOfBirth} onChange={handleChange} />
                        {fieldErrors.dateOfBirth && <span className="text-red-500/60 text-sm">{fieldErrors.dateOfBirth}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 md:flex-row w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="plan">Plan</label>
                        <select name='plan' id="plan" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formInput.plan} onChange={handleChange}>
                            <option value="">Select Plan</option>
                            <option value="Core">Core</option>
                            <option value="Sync">Sync</option>
                            <option value="Nexus">Nexus</option>
                            <option value="Quantum">Quantum</option>
                            <option value="Ignite">Ignite</option>
                        </select>
                        {fieldErrors.plan && <span className="text-red-500/60 text-sm">{fieldErrors.plan}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="residentialAddress">Residential Address</label>
                        <textarea name='residentialAddress' placeholder='Enter residential address' className='bg-[#F8F9FA] h-20 border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm resize-none' id="residentialAddress" value={formInput.residentialAddress} onChange={handleChange} rows={3} />
                        {fieldErrors.residentialAddress && <span className="text-red-500/60 text-sm">{fieldErrors.residentialAddress}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 md:flex-row w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="enrollmentDate">Enrollment Date</label>
                        <input type="date" name='enrollmentDate' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="enrollmentDate" value={formInput.enrollmentDate} onChange={handleChange} />
                        {fieldErrors.enrollmentDate && <span className="text-red-500/60 text-sm">{fieldErrors.enrollmentDate}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="gender">Gender</label>
                        <select name='gender' id="gender" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formInput.gender} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {fieldErrors.gender && <span className="text-red-500/60 text-sm">{fieldErrors.gender}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 md:flex-row w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="expiryDate">Expiry Date</label>
                        <input type="date" name='expiryDate' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="expiryDate" value={formInput.expiryDate} onChange={handleChange} />
                        {fieldErrors.expiryDate && <span className="text-red-500/60 text-sm">{fieldErrors.expiryDate}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="dependents">Number of Dependents</label>
                        <input type="number" name='dependents' placeholder='Enter number of dependents' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="dependents" value={formInput.dependents} onChange={handleChange} min="0" />
                        {fieldErrors.dependents && <span className="text-red-500/60 text-sm">{fieldErrors.dependents}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 md:flex-row w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="autoBilling">Auto Billing</label>
                        <select name='autoBilling' id="autoBilling" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formInput.autoBilling} onChange={handleChange}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        {fieldErrors.autoBilling && <span className="text-red-500/60 text-sm">{fieldErrors.autoBilling}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                        <label className='font-semibold' htmlFor="nationality">Nationality</label>
                        <input type="text" name='nationality' placeholder='Enter nationality' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="nationality" value={formInput.nationality} onChange={handleChange} />
                        {fieldErrors.nationality && <span className="text-red-500/60 text-sm">{fieldErrors.nationality}</span>}
                        </div>
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

export default AddEnrolleeClient
