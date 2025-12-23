import React from 'react'
import Image from 'next/image'
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarker, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { FaApple, FaGooglePlay, FaHeart, FaX, FaXTwitter } from 'react-icons/fa6';
import { DiAppstore } from 'react-icons/di';
import Link from 'next/link';

const Footer = () => {
  return (
    <section className='bg-[#120052] text-[#FFFFFF] text-[0.9rem] py-10'>
        <div className='flex flex-col items-center space-y-6 justify-center mx-5 md:mx-18 bg-[#FAFAFA] mb-8 rounded-4xl py-16 text-[#000000]'>
            <div className='flex flex-col md:flex-row text-xs md:gap-6'>
                <div className='flex'>
                    <div className='h-5 w-5 bg-linear-to-r from-[#17C9FB] to-[#1A74E8] rounded-sm flex items-center justify-center mr-2'>
                        <DiAppstore className='text-lg font-extrabold'/>
                    </div>
                    <p className='flex items-center'>
                        4.7 <FaStar className='mx-1'/> on Apple Store <span className='font-extralight ml-1'>600k reviews</span>
                    </p>
                </div>
                <div className='flex items-center'>
                    <Image src='/playstore_icon.png' width={200} height={100} loading='eager' alt='Playstore icon' className='h-4 w-fit font-extrabold mr-2'/>
                    <p className='flex items-center'>
                        4.8 <FaStar className='mx-1'/> on Play Store <span className='font-extralight ml-1'>500k reviews</span>
                    </p>
                </div>
            </div>
            <div className='flex flex-col items-center space-y-6 text-center'>
                <h2 className='text-[25px] font-extrabold'>
                    Healthcare that fits your everyday life
                </h2>
                <Link href='/register' className='w-fit'>
                    <button className='btn px-20 py-3 text-lg'>
                        Get Started
                    </button>
                </Link>
            </div>

            {/* Desktop */}
            <div className='md:flex gap-8 items-center hidden md:flex-row'>
                <div className='flex flex-col gap-6'>
                    <div className='flex items-center text-[#FFFFFF] bg-[#000000] rounded-lg py-2 px-4'>
                        <div>
                            <FaApple className='h-4 w-fit font-extrabold mr-2'/>    
                        </div>
                        <div className='-space-y-1'>
                            <p className='text-xs font-extralight'>Download free on</p>
                            <p className='text-lg'>Apple Store</p>
                        </div>
                    </div>
                    <div className='flex items-center text-[#FFFFFF] bg-[#000000] rounded-lg py-2 px-4'>
                        <div>
                            <Image src='/playstore_icon.png' width={200} height={100} loading='eager' alt='Playstore icon' className='h-4 w-fit font-extrabold mr-2'/>    
                        </div>
                        <div className='-space-y-1'>
                            <p className='text-xs font-extralight'>Download free on</p>
                            <p className='text-lg'>Play Store</p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center border-dashed border-2 h-fit w-fit p-6 gap-8'>
                    <p className='text-lg w-34'>Scan to Download WootHealth app</p>
                    <Image src='/QR_code.png' width={200} height={100} loading='lazy' alt='Playstore icon' className='h-48 w-fit font-extrabold mr-2'/>
                </div>
            </div>

            {/* Mobile */}
            <div className='flex gap-3 items-center md:hidden flex-col'>
                <div className='flex gap-5 items-center border-dashed border-2 h-fit w-fit p-6'>
                    <p className='text-xs w-14'>Scan to Download WootHealth app</p>
                    <Image src='/QR_code.png' width={200} height={100} loading='lazy' alt='Playstore icon' className='h-20 w-fit font-extrabold mr-2'/>
                </div>
                <div className='flex gap-6 w-fit'>
                    <div className='flex items-center text-[#FFFFFF] bg-[#000000] rounded-lg py-2 px-4'>
                        <div>
                            <FaApple className='h-4 w-fit font-extrabold mr-2'/>    
                        </div>
                        <div className='-space-y-1'>
                            <p className='text-xs font-extralight'>Download free on</p>
                            <p className='text-base'>Apple Store</p>
                        </div>
                    </div>
                    <div className='flex items-center text-[#FFFFFF] bg-[#000000] rounded-lg py-2 px-4'>
                        <div>
                            <Image src='/playstore_icon.png' width={200} height={100} loading='eager' alt='Playstore icon' className='h-4 w-fit font-extrabold mr-2'/>    
                        </div>
                        <div className='-space-y-1'>
                            <p className='text-xs font-extralight'>Download free on</p>
                            <p className='text-base'>Play Store</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='py-14 md:px-[130px] px-6'>
                {/* Desktop */}
                <div className='hidden md:grid md:grid-cols-3 md:gap-y-8 md:gap-x-4 lg:flex lg:justify-between'>
                    <div>
                        <h3 className='font-semibold text-lg mb-4'>Health Plans</h3>
                        <ul className='flex flex-col gap-3 ml-2'>
                            <li>Business Plans</li>
                            <li>Retail Plans</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg mb-4'>Quick Links</h3>
                        <ul className='flex flex-col gap-3 ml-2'>
                            <li>Home</li>
                            <li>Providers</li>
                            <li>About Us</li>
                            <li>FAQs</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className='text-wrap'>
                        <h3 className='font-semibold text-lg mb-4'>Contact Us</h3>
                        <ul className='flex flex-col gap-3 ml-2'>
                            <li className='flex gap-2 items-center'><FaPhoneAlt/>+234 0098762345</li>
                            <li className='flex gap-2 items-center'><FaEnvelope/>support@woothealth .com</li>
                            <address className='flex gap-3 items-center'><FaMapMarker/>Oregun-Ikeja, Lagos, Nigeria</address>
                        </ul>
                    </div>
                    <div className='md:col-span-3'>
                        <Image src='/Logo2.png' width={500} height={100}alt="WootHealth Logo" className='w-auto h-[2.5rem] mb-4' loading='lazy' />
                        <p className='text-base mb-4'>Healthcare that works for your everyday life</p>
                        <p className='flex items-center text-sm italic'>Made with<FaHeart className='mx-2'/> from Nigeria</p>
                        
                        <div className='mt-8 flex gap-4'>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px] cursor-pointer'>
                                <FaLinkedinIn className='text-lg text-black'/>
                            </div>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px] cursor-pointer'>
                                <FaFacebookF className='text-lg text-black'/>
                            </div>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px] cursor-pointer'>
                                <FaInstagram className='text-lg text-black'/>
                            </div>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px] cursor-pointer'>
                                <FaXTwitter className='text-lg text-black'/>
                            </div>
                        </div>
                    </div>
                </div>
        
                {/* Mobile */}
                <div className='grid grid-cols-2 gap-y-8 md:hidden'>
                    <div>
                        <h3 className='font-semibold text-lg mb-4'>Quick Links</h3>
                        <ul className='flex flex-col gap-4 ml-2 text-sm'>
                            <li>Home</li>
                            <li>Providers</li>
                            <li>About Us</li>
                            <li>FAQs</li>
                            <li>Terms & Conditions</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div>
                            <h3 className='font-semibold text-lg mb-4'>Health Plans</h3>
                            <ul className='flex flex-col gap-3 ml-2 text-sm'>
                                <li>Business Plans</li>
                                <li>Retail Plans</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='font-semibold text-lg mb-4'>Contact Us</h3>
                            <ul className='flex flex-col gap-3 ml-2 text-sm'>
                                <li className='flex gap-2 items-center'><FaPhoneAlt/>+234 0098762345</li>
                                <li className='flex gap-2 items-center text-[0.83rem]'><FaEnvelope /> support@woothealth .com</li>
                                <address className='flex gap-3 items-center'><FaMapMarker/>Oregun-Ikeja, Lagos, Nigeria</address>
                            </ul>
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <Image src='/Logo2.png' width={500} height={100} alt="WootHealth Logo" className='w-auto h-8 mb-4' priority />
                        <p className='text-base mb-4'>
                            Healthcare that works for your everyday life
                        </p>
                        <p className='flex items-center text-sm italic'>Made with<FaHeart className='mx-2'/> from Nigeria</p>
                        
                        <div className='mt-8 flex gap-4'>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px]'>
                                <FaLinkedinIn className='text-lg text-black'/>
                            </div>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px]'>
                                <FaFacebookF className='text-lg text-black'/>
                            </div>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px]'>
                                <FaInstagram className='text-lg text-black'/>
                            </div>
                            <div className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px]'>
                                <FaXTwitter className='text-lg text-black'/>
                            </div>
                        </div>
                    </div>
                </div>
        
                </div>
                <div className='border-[#FAFAFA] border-t p-6'>
                    <p className='text-center text-[.9rem] tracking-widest'>&copy; {new Date().getFullYear()} | WootHealth | All rights reserved.</p>
                </div>
    </section>
  )
}

export default Footer