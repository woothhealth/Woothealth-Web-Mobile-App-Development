'use client'

import { loginAction } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react'
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { toast } from 'sonner';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    type LoginFormInput = {
        email: string;
        password: string;
        rememberMe: boolean;
    };

    const [formInput, setFormInput] = useState<LoginFormInput>({
        email: "",
        password: "",
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormInput((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    const validate = (formData: FormData) => {
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!email.includes("@")) {
            newErrors.email = "Enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

  const handleLogin = async (formData: FormData) => {
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Login successful!");

      router.push(`/dashboard/${result.role}`);
    });
  };

  return (
    <form action={handleLogin} className='flex flex-col gap-8 items-center justify-center md:mx-0' aria-live='polite'>
        <div className='text-center'>
            <h3 className='text-[24px] font-semibold'>We&apos;re glad to have <span className='text-[#49A5EF]'>you back</span></h3>
            <p>Log in to manage your health insurance</p>
        </div>
        <div className='flex flex-col gap-3 w-full'>
            <label htmlFor='email' className='md:text-lg text-base'>Email</label>
            <input type='text' placeholder='Enter Your Email address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id='email' name='email' onChange={handleChange}/>
            {errors.email && (
                <p className="text-red-500/60 text-sm">{errors.email}</p>
            )}
        </div>

        <div className='flex flex-col gap-3 w-full'>
            <label htmlFor='password' className='md:text-lg text-base'>Password</label>
            <div className='relative'>
                <input type={showPassword? 'text' : 'password'} name='password' id="password" placeholder='Enter Your Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' onChange={handleChange}/>
                <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                  {showPassword ? <LuEyeClosed/> : <LuEye/>}
                </button>
            </div>
            {errors.password && (
                <p className="text-red-500/60 text-sm">{errors.password}</p>
            )}
            <div className='flex justify-between mt-3 items-center'>
                <label className='text-sm flex items-center gap-1'>
                    <input type="checkbox" name="rememberMe" onChange={(e) => setRememberMe(e.target.checked)} checked={rememberMe} /> Remember me
                </label>
                <Link href='/forgot-password' className='text-end text-sm text-[#49A5EF]'>Forgot Password?</Link>
            </div>
        </div>
        <button type='submit' className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-full mt-1 disabled:opacity-50'disabled={isPending}>
            {isPending ? "Loging In..." : "Login"}
        </button>
    </form>
)}

export default LoginForm