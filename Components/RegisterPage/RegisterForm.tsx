"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { toast } from "sonner";
import { registerAction } from "@/lib/registerAuth";
import Link from "next/link";

type RegisterFormInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  locate: string;
  address: string;
  age: string;
  password: string;
  confirmPassword: string;
  check: boolean;
};

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const scrollToError = (errors: Record<string, string>) => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return;
    const el = document.getElementById(firstKey);
    if (!el) return;

    el.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
    if ("focus" in el) {
        (el as HTMLElement).focus();
    }
    };

  const [formInput, setFormInput] = useState<RegisterFormInput>({
    firstName: "",
    lastName: "",
    phoneNumber: "+234",
    email: "",
    locate: "",
    address: "",
    age: "",
    password: "",
    confirmPassword: "",
    check: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormInput((prev) => ({
            ...prev,
            [name]:
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
        }));

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (!value.startsWith("+234")) {
            value = "+234";
        }

        const rest = value.slice(4).replace(/\D/g, "");

        setFormInput(prev => ({
            ...prev,
            phoneNumber: "+234" + rest,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            const result = await registerAction(formData);

            if (!result.success) {
            if (result.errors) {
                const formatted: Record<string, string> = {};

                for (const key of Object.keys(result.errors)) {
                const messages = result.errors[key as keyof typeof result.errors];
                if (messages?.length) {
                    formatted[key] = messages[0];
                }
                }

                setErrors(formatted);
                scrollToError(formatted);
                return;
            }

            toast.error(result.message);
            return;
            }

            toast.success("Registration successful");
            setIsSubmitted(true);

            form.reset();
            setMessage(result.message ?? "Account created");
        });
    };


  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center md:mx-0'>
        {!message && (
            <>
            <div className='flex flex-col md:flex-row gap-6 w-full'>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="firstName"className='font-semibold'>
                        First Name
                    </label>
                    <input type="text" placeholder='Enter Your Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="firstName" name="firstName" value= {formInput.firstName} onChange={handleChange} />
                    {errors.firstName && <span className="text-red-500/60 text-sm">{errors.firstName}</span>}
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label htmlFor="lastName" className='font-semibold'>
                        Last Name
                    </label>
                    <input type="text" placeholder='Enter Your Last Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="lastName" name="lastName" value={formInput.lastName} onChange={handleChange} />
                    {errors.lastName && <span className="text-red-500/60 text-sm">{errors.lastName}</span>}
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-6 w-full'>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="phoneNumber">
                        Phone Number
                    </label>
                    <input  type="tel" name="phoneNumber" placeholder="+2349137976215" id="phoneNumber" minLength={14} className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formInput.phoneNumber} onChange={handlePhoneChange}/>
                    {errors.phoneNumber && <span className="text-red-500/60 text-sm">{errors.phoneNumber}</span>}
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="email">
                        Email
                    </label>
                    <input type="email" name='email' placeholder='Email' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="email" value={formInput.email} onChange={handleChange} />
                    {errors.email && <span className="text-red-500/60 text-sm">{errors.email}</span>}
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
                    {errors.password && <span className="text-red-500/60 text-sm">{errors.password}</span>}
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="confirmPassword">
                      Confirm your Password
                    </label>
                    <div className='relative'>
                        <input type={showPassword? 'text' : 'password'} id="confirmPassword" placeholder='Confirm your Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' name="confirmPassword" value={formInput.confirmPassword} onChange={handleChange} />
                        <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <LuEyeClosed/> : <LuEye/>}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="text-red-500/60 text-sm">{errors.confirmPassword}</span>}
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
                    {errors.age && <span className="text-red-500/60 text-sm">{errors.age}</span>}
                </div>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="locate">
                        State
                    </label>
                    <select name='locate' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="locate" value={formInput.locate} onChange={handleChange}>
                        <option value="">Select your State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Ayetoro">Ayetoro</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Ondo">4Ondo</option>
                        <option value="Oyo">Oyo</option>
                    </select>
                    {errors.locate && <span className="text-red-500/60 text-sm">{errors.locate}</span>}
                    {/* <input type="text" name='locate' placeholder='Enter State' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="states" value={formInput.states} onChange={handleChange} />
                    {errors.states && <span className="text-red-500/60 text-sm">{errors.states}</span>} */}
                </div>
            </div>
            <div className='flex gap-6 w-full flex-col md:flex-row'>
                <div className='flex flex-col gap-2 w-full'>
                    <label className='font-semibold' htmlFor="address">
                        Address
                    </label>
                    <textarea  placeholder='Enter your Address' name='address' className='resize-none h-20 bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-3 placeholder:text-sm' id="address" value={formInput.address} onChange={handleChange} ></textarea>
                    {errors.address && <span className="text-red-500/60 text-sm">{errors.address}</span>}
                </div>
            </div>
                    <div className='w-full'>
                      <div className='flex items-center gap-2'>
                        <input type="checkbox" name="check" id="check" checked={formInput.check} onChange={handleChange} />
                        <label htmlFor="check" className='w-sm text-sm'>I have read and agreed to Woot Health’s Terms of Use and Privacy Policy <span className='text-red-500/60'>*</span></label>
                      </div>
                      {errors.check && <span className="text-red-500/60 text-sm">{errors.check}</span>}
                    </div>

                    <button type='submit' disabled={isPending} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-fit mt-1'>
                        {isPending ? 'Sending...' : 'SUBMIT'}
                    </button>
                    <div>
                        <p className='md:text-lg'>Have an account? { " "}
                            <Link href={`/login`} className='text-[#49A5EF] underline'>Log in</Link>
                        </p>
                    </div>
                    </>
                )}
                    {message && (
                        <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                            <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                Registration Successful!
                            </h3>
                            <p className=" mb-6">
                                Your account has been created successfully. Please refer to your email for your credientials to successfully Log in.
                            </p>
                            <button onClick={() => router.push("/login")} className="bg-[#49A5EF]/780 text-white px-10 font-semibold py-3 rounded-sm">
                                Login
                            </button>
                        </div>
                    )}
                </form>
  );
};

export default RegisterForm;
