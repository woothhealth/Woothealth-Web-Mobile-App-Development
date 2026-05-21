'use client';

import React from 'react';
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SecurityFormInput, securitySchema } from '@/lib/validator/security';

interface SecurityFormProps {
  onPasswordChange?: (newPassword: string, confirmPassword: string) => Promise<void>;
}

const SecurityForm = ({ onPasswordChange }: SecurityFormProps) => {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formInput, setFormInput] = useState<SecurityFormInput>({
        newPassword: "",
        currentPassword: "",
        confirmPassword: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormInput(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: '' })); // clear field error
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorMessage('');
        setMessage('');
        setFieldErrors({});
        setIsSubmitting(true);

        const result = securitySchema.safeParse(formInput);

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
            if (onPasswordChange) {
                await onPasswordChange(formInput.newPassword, formInput.confirmPassword);
                setIsSubmitted(true);
                setMessage('Password updated successfully!');
            } else {
                const res = await fetch('', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formInput,
                }),
                });

                const data = await res.json();

                if (res.status === 201) {
                setIsSubmitted(true);
                setMessage(data?.message || 'Password updated successfully!');
                } else if (res.status === 409) {
                setErrorMessage(data?.message || 'Provided password is already in use.');
                } else {
                setErrorMessage(data?.message || 'Password update failed. Please try again.');
                }
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
  return (
    <form id="form" onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center md:mx-0'>
        {!isSubmitted && (
            <>
            <div className='flex flex-col gap-6 w-full'>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="currentPassword" className='font-semibold'>
                        Current Password
                    </label>
                    
                    <div className='relative'>
                        <input type={showPassword? 'text' : 'password'} name='currentPassword' id="currentPassword" placeholder='Enter Your current Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' value={formInput.currentPassword} onChange={handleChange}/>
                        <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <LuEyeClosed/> : <LuEye/>}
                        </button>
                    </div>
                    {fieldErrors.currentPassword && <span className="text-red-500/60 text-sm">{fieldErrors.currentPassword}</span>}
                </div>

                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="newPassword" className='font-semibold'>
                        New Password
                    </label>
                    
                    <div className='relative'>
                        <input type={showPassword? 'text' : 'password'} name='newPassword' id="newPassword" placeholder='Enter Your new Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' value={formInput.newPassword} onChange={handleChange}/>
                        <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <LuEyeClosed/> : <LuEye/>}
                        </button>
                    </div>
                    {fieldErrors.newPassword && <span className="text-red-500/60 text-sm">{fieldErrors.newPassword}</span>}
                </div>

                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="confirmPassword" className='font-semibold'>
                        Confirm Password
                    </label>
                    
                    <div className='relative'>
                        <input type={showPassword? 'text' : 'password'} name='confirmPassword' id="confirmPassword" placeholder='Enter Your confirm Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' value={formInput.confirmPassword} onChange={handleChange}/>
                        <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <LuEyeClosed/> : <LuEye/>}
                        </button>
                    </div>
                    {fieldErrors.confirmPassword && <span className="text-red-500/60 text-sm">{fieldErrors.confirmPassword}</span>}
                </div>
            </div>

            <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-fit'>
                {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
        </>
        )}
        {isSubmitted && (
            <div className="text-center border-green-200 py-4 mx-4 md:mx-0">
                <FaCheckCircle className="md:h-16 md:w-16 h-12 w-12 text-green-600/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                    Successful update!
                </h3>
                <p className=" mb-6">
                    Your password has been updated successfully. 
                </p>
                <button onClick={() => router.push("/business/settings")} className="bg-[#49A5EF]/780 text-white px-10 font-semibold py-2 rounded-sm">
                    Go back
                </button>
            </div>
        )}
    </form>
  );
};

export default SecurityForm;
