'use client'

import React, { useRef, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { BiSolidFile } from 'react-icons/bi'
import { FiUpload, FiCamera } from 'react-icons/fi'

const Page = () => {

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = [
    'image/png',
    'image/jpeg',
    'application/pdf',
  ]

  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
        claimType: '',
        date: '',
        hospitalName: '',
        claimAmount: '',
        description: '',
        files: [] as File[],
      });
  const [errors, setErrors] = useState({
        claimType: '',
        date: '',
        hospitalName: '',
        claimAmount: '',
        description: '',
        files: '',
      });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;

    if (target.type === 'file' && target.files) {
      const selectedFiles = Array.from(target.files);

      for (const file of selectedFiles) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setErrors((prev) => ({
            ...prev,
            files: 'Only PDF, JPG, and PNG files are allowed',
          }));
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          setErrors((prev) => ({
            ...prev,
            files: 'Each file must be under 10MB',
          }));
          return;
        }
      }

      setErrors((prev) => ({ ...prev, files: '' }));
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...selectedFiles],
      }));
      return;
    }

      setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
        setErrors({
          ...errors,
          [target.name]: ''
        });
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;
        const newErrors = { ...errors };
    
        if (!formData.claimType.trim()) {
          newErrors.claimType = 'Field not filled';
          hasError = true;
        }
        if (!formData.date.trim()) {
          newErrors.date = 'Field not filled';
          hasError = true;
        }
        if (!formData.hospitalName.trim()) {
          newErrors.hospitalName = 'Field not filled';
          hasError = true;
        }
        if (!formData.claimAmount.trim()) {
          newErrors.claimAmount = 'Field not filled';
          hasError = true;
        }
        if (formData.files.length === 0) {
          newErrors.files = 'Please upload at least one document';
          hasError = true;
        }
  
        setErrors(newErrors);
    
        if (hasError) return;
    
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
          console.log('Form submitted:', formData);
          setIsSubmitting(false);
          setIsSubmitted(true);
          // Reset form after successful submission
          setFormData({
            claimType: '',
            date: '',
            hospitalName: '',
            claimAmount: '',
            description: '',
            files: [],
          });
        }, 1500);
      };
  
    return (
      <>
    <section className='py-4 md:p-4'>
      <div className='flex flex-col'>
        <div className='flex flex-col gap-6'>
          <div className='flex gap-2 text-[#49A5EF] bg-[#49A5EF05] border border-[#49A5EF] rounded-[10px] p-2 md:w-1/2'>
            <div className='p-1.5 inline-flex rounded-full bg-[#49A5EF] h-fit text-[#FFFFFF] text-base'>
              <BiSolidFile/>
            </div>
            <div>
              <h4 className='text-sm font-semibold'>Quick Tip</h4>
              <p className='text-xs'>Claims are typically processed within5-7 business days. Make sure all receipts are clear and legible. Please note that the maximum eligible age for enrollment is 65 years.</p>
            </div>
          </div>
          <div className='w-full'>
            {isSubmitted ? (
                <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                    <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                    <h3 className="text-xl mb-2">
                      Claim Submitted Successfully
                    </h3>
                    <p className="mb-6">
                      Your claim will be processed within 2–3 working days.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#49A5EF]/780 text-white px-10  py-3 rounded-sm"
                      >
                      Go back
                    </button>
                  </div>
                ) : (
                <div className='flex flex-col md:flex-row gap-10'>
                  <div className='flex flex-col gap-3 bg-[#FFFFFF] rounded-[10px] py-4 md:px-6 md:w-1/2 '>
                  <p className='text-[18px] font-semibold'>Claims Details</p>
                  <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="claimType"className=''>
                        Claim Type
                      </label>
                      <input type="text" placeholder='Select claim type' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="claimType" name="claimType" value={formData.claimType} onChange={handleChange} />
                      {errors.claimType && <span className="text-red-500/60 text-sm">{errors.claimType}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="date" className=''>
                        Date of Services
                      </label>
                      <input type="date" placeholder='dd/mm/yyyy' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="date" name="date" value={formData.date} onChange={handleChange}/>
                      {errors.date && <span className="text-red-500/60 text-sm">{errors.date}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='' htmlFor="hospitalName">
                        Hospital/Provider Name
                      </label>
                      <input type="text" name='hospitalName' id="hospitalName" placeholder='Enter provider name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formData.hospitalName} onChange={handleChange}/>
                      {errors.hospitalName && <span className="text-red-500/60 text-sm">{errors.hospitalName}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='' htmlFor="claimAmount">
                        Claim Amount
                      </label>
                      <input type="number" name='claimAmount' placeholder='0.00' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="claimAmount" value={formData.claimAmount} onChange={handleChange} />
                      {errors.claimAmount && <span className="text-red-500/60 text-sm">{errors.claimAmount}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='' htmlFor="description">
                        Description (optional)
                      </label>
                      <textarea name='description' placeholder='Add any additional details about your claim' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm resize-none' id="description" value={formData.description} onChange={handleChange} />
                    </div>
                    
                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3  rounded-sm mt-3 hidden md:block'>
                      {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                    </button>
                </form>
              </div>

            {/* UPLOAD */}
            <div className="bg-white md:p-6 rounded-lg space-y-4 h-fit md:w-[48%]">
              <p className="text-[18px] font-semibold">Upload Document</p>
              <div className='mt-12 flex flex-col items-center justify-center space-y-3'>
                <FiUpload className='text-4xl'/>
                <h4 className='font-semibold'>Upload Bills & Receipts</h4>
                <p className='text-sm'>PDF, JPG, PNG up to 10MB each</p>
              </div>
              <input ref={uploadRef} type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleChange} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />

              <div className="flex items-center justify-center gap-4 mt-10">
                <div onClick={() => uploadRef.current?.click()} className="btn rounded-[10px] px-8 py-2 flex gap-2 items-center cursor-pointer">
                  <FiUpload /> Choose Files
                </div>
                <div onClick={() => cameraRef.current?.click()} className="px-6 rounded-[10px] py-2 flex gap-2 items-center bg-[#E5E7EB4D] cursor-pointer">
                  <FiCamera /> Take Photos
                </div>
              </div>
              {errors.files && <p className="text-red-500/60 text-sm">{errors.files}</p>}
              {formData.files.length > 0 && (
                <ul className="text-sm">
                  {formData.files.map((file, i) => (
                    <li key={i}>• {file.name}</li>
                  ))}
                </ul>
              )}

              <div className='flex mt-8 gap-2 bg-[#FEF3C7] border border-[#B57406] rounded-[10px] px-2 py-4'>
                <div className='text-[#B57406] text-sm font-semibold'>
                  Required:
                </div>
                <div>
                  <p className='text-sm text-[#F59E0B]'>Original bills, payment receipts, prescriptions (if applicable)</p>
                </div>
              </div>

              <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 rounded-sm mt-6 w-full md:hidden block'>
                {isSubmitting ? 'Sending...' : 'Continue'}
              </button>
            </div>

          </div>
        )}
      </div>
      </div>
      </div>
    </section>
    </>
  )
}

export default Page