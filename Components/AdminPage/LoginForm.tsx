'use client'

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
    };

    const [formInput, setFormInput] = useState<LoginFormInput>({
        email: "",
        password: "",
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
            // ✅ Post to server-side login API
            const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.get("email"),
                password: formData.get("password"),
                mode: "admin",
            }),
            });

            const result = await res.json();

            if (!result.success) {
            toast.error(result.message);
            return;
            }

            toast.success("Login successful!");

            // ✅ Redirect after cookie is set
             if (result.role === "superadmin") {
                router.push("/dashboard/superadmin");
            } else if (result.role === "admin") {
                router.push("/dashboard/superadmin");
            } else {
                router.push("/admin"); // fallback
            }
        });
    };


  return (
    <form action={handleLogin} className='flex flex-col gap-4 justify-center md:mx-0' aria-live='polite'>
        <div className='text-start'>
            <div className='bg-[#49A5EF]/70 text-[#ffffff]/80 px-2 py-0.5 w-fit rounded-full flex items-center space-x-1 animate-pulse'>
                <div className='bg-red-400 animate-bounce h-2 w-2 rounded-full'></div>
                <p className='text-xs animate-none'>Admin access only</p>
            </div>
            <h3 className='text-[22px] font-semibold uppercase'>Welcome Back</h3>
            <p className='text-sm text-[#333333]/80'>Sign in with your Admin Credentials to continue</p>
        </div>
        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='email' className='md:text-lg text-base'>Email</label>
            <input type='text' placeholder='Enter Your Email address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF]' id='email' name='email' onChange={handleChange}/>
            {errors.email && (
                <p className="text-red-500/60 text-sm">{errors.email}</p>
            )}
        </div>

        <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='password' className='md:text-lg text-base'>Password</label>
            <div className='relative'>
                <input type={showPassword? 'text' : 'password'} name='password' id="password" placeholder='**********' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#49A5EF]' onChange={handleChange}/>
                <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                  {showPassword ? <LuEyeClosed/> : <LuEye/>}
                </button>
            </div>
            {errors.password && (
                <p className="text-red-500/60 text-sm">{errors.password}</p>
            )}
        </div>
        <button type='submit' className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-full mt-1 disabled:opacity-50'disabled={isPending}>
            {isPending ? "Loging In..." : "Login"}
        </button>
    </form>
)}

export default LoginForm