'use client';

import React from 'react';
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useEffect, useState, useTransition } from "react";
import { RegisterFormInput, registerSchema } from "@/lib/validator/register";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterForm = () => {
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useTransition();
    const [message, setMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formInput, setFormInput] = useState<RegisterFormInput>({
        firstName: "",
        lastName: "",
        phone: "+234",
        email: "",
        password: "",
        confirmPassword: "",
        check: false,
        locate: "",
        address: "",
        age: "",
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

        const result = registerSchema.safeParse(formInput);

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
                    role: 'retail',
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
    <form id="form" onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center md:mx-0'>
        {!isSubmitted && (
            <>
            <div className='flex flex-col md:flex-row gap-6 w-full'>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="firstName"className='font-semibold'>
                        First Name
                    </label>
                    <input type="text" placeholder='Enter Your Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="firstName" name="firstName" value= {formInput.firstName} onChange={handleChange} />
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
                    <label className='font-semibold' htmlFor="phone">
                        Phone Number
                    </label>
                    <input  type="tel" name="phone" placeholder="+2349137976215" id="phone" minLength={14} className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formInput.phone} onChange={handlePhoneChange}/>
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
                    <label className='font-semibold' htmlFor="password">
                        Choose your Password
                    </label>
                    <div className='relative'>
                        <input type={showPassword? 'text' : 'password'} name='password' id="password" placeholder='Enter Your Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' value={formInput.password} onChange={handleChange}/>
                        <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <LuEyeClosed/> : <LuEye/>}
                        </button>
                    </div>
                    {fieldErrors.password && <span className="text-red-500/60 text-sm">{fieldErrors.password}</span>}
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="confirmPassword">
                      Confirm your Password
                    </label>
                    <div className='relative'>
                        <input type={showPassword? 'text' : 'password'} id="confirmPassword" placeholder='Confirm your Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' name="confirmPassword" value={formInput.confirmPassword} onChange={handleChange} />
                        <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out outline-none' onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <LuEyeClosed/> : <LuEye/>}
                        </button>
                    </div>
                    {fieldErrors.confirmPassword && <span className="text-red-500/60 text-sm">{fieldErrors.confirmPassword}</span>}
                </div>
            </div>
            <div className='flex gap-6 w-full flex-col md:flex-row'>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="age">
                        Age
                    </label>
                    <select name='age' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="age" value={formInput.age} onChange={handleChange}>
                        <option value="">Select your age</option>
                        <option value="18-25">18-25</option>
                        <option value="26-35">26-35</option>
                        <option value="35-45">36-45</option>
                        <option value="46-60">46-60</option>
                        <option value="61-65">61-65</option>
                    </select>
                    {fieldErrors.age && <span className="text-red-500/60 text-sm">{fieldErrors.age}</span>}
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="locate">
                        State
                    </label>
                    <input type="text" name='locate' placeholder='Enter your location' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="locate" value={formInput.locate} onChange={handleChange} />
                    {fieldErrors.locate && <span className="text-red-500/60 text-sm">{fieldErrors.locate}</span>}
                </div>
            </div>
            <div className='flex gap-6 w-full flex-col md:flex-row'>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="address">
                        Address
                    </label>
                    <textarea  placeholder='Enter your Address' name='address' className='resize-none h-20 bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-3 placeholder:text-sm' id="address" value={formInput.address} onChange={handleChange} ></textarea>
                    {fieldErrors.address && <span className="text-red-500/60 text-sm">{fieldErrors.address}</span>}
                </div>
            </div>
            <div className='w-full'>
                <div className='flex items-center gap-2'>
                    <input type="checkbox" name="check" id="check" checked={formInput.check} onChange={handleChange} />
                    <label htmlFor="check" className='w-sm text-sm'>I have read and agreed to Woot Health’s Terms of Use and Privacy Policy <span className='text-red-500/60'>*</span></label>
                </div>
                {fieldErrors.check && <span className="text-red-500/60 text-sm">{fieldErrors.check}</span>}
            </div>

            <div
                id="error-message"
                className="mt-4 text-center text-red-500 text-sm font-semibold"
              ></div>

            <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-fit mt-1'>
                {isSubmitting ? 'Sending...' : 'SUBMIT'}
            </button>
            <div>
                <p className='md:text-lg'>Have an account? { " "}
                    <Link href={`/login`} className='text-[#49A5EF] underline'>Log in</Link>
                </p>
            </div>
        </>
        )}
        {isSubmitted && (
            <div className="text-center border-green-200 py-4 mx-4 md:mx-0">
                <FaCheckCircle className="md:h-16 md:w-16 h-12 w-12 text-green-600/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                    Registration Successful!
                </h3>
                <p className=" mb-6">
                    Your account has been created successfully. 
                </p>
                <button onClick={() => router.push("/login")} className="bg-[#49A5EF]/780 text-white px-10 font-semibold py-2 rounded-sm">
                    Login
                </button>
            </div>
        )}
    </form>
  );
};

export default RegisterForm;
