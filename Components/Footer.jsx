import React from 'react'
import Image from 'next/image'
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarker, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { FaApple, FaHeart, FaXTwitter } from 'react-icons/fa6';
import { DiAppstore } from 'react-icons/di';
import Link from 'next/link';

const link1 = [
    {
        name: "Home",
        url: "/"
    },
    {
        name: "Providers",
        url: "/providers"
    },
    {
        name: "About Us",
        url: "/about"
    },
    {
        name: "FAQs",
        url: "/FAQs"
    },
    {
        name: "Terms & Conditions",
        url: "/"
    },
    {
        name: "Privacy Policy",
        url: "/"
    }
]

const link2 = [
    {
        name: "Business Plans",
        url: "/business"
    },
    {
        name: "Retail Plans",
        url: "/retail"
    }
]

const Footer = () => {
  return (
    <section className='bg-[#120052] text-[#FFFFFF] text-[0.9rem] py-10'>
        <div className='flex flex-col items-center space-y-6 justify-center mx-6 md:mx-18 bg-[#FAFAFA] mb-8 rounded-4xl py-16 text-[#000000]'>
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
            <div className='flex flex-col items-center space-y-2 md:space-y-6 px-8 text-center'>
                <h2 className='md:text-[25px] font-extrabold text-[20px]'>
                    Healthcare that fits your everyday life
                </h2>
                <Link href='/register' className='w-fit'>
                    <button className='btn md:px-20 px-14 py-3 text-lg'>
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
                <div className='flex space-x-2 w-fit'>
                    <div className='flex items-center text-[#FFFFFF] bg-[#000000] rounded-lg py-2 px-2'>
                        <div>
                            <FaApple className='h-4 w-fit font-extrabold mr-2'/>    
                        </div>
                        <div className='-space-y-1'>
                            <p className='text-[11px] font-extralight'>Download free on</p>
                            <p className='text-[14px]'>Apple Store</p>
                        </div>
                    </div>
                    <div className='flex items-center text-[#FFFFFF] bg-[#000000] rounded-lg py-2 px-2'>
                        <div>
                            <Image src='/playstore_icon.png' width={200} height={100} loading='eager' alt='Playstore icon' className='h-4 w-fit font-extrabold mr-2'/>    
                        </div>
                        <div className='-space-y-1'>
                            <p className='text-[11px] font-extralight'>Download free on</p>
                            <p className='text-[14px]'>Play Store</p>
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
                            {link2.map((item, index) => (
                                <Link href={item.url} key={index}>
                                    <li>{item.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg mb-4'>Quick Links</h3>
                        <ul className='flex flex-col gap-3 ml-2'>
                            {link1.map((item, index) => (
                                <Link href={item.url} key={index}>
                                    <li>{item.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div className='text-wrap'>
                        <h3 className='font-semibold text-lg mb-4'>Contact Us</h3>
                        <ul className='flex flex-col gap-3 ml-2'>
                            <a href="tel:02018891833" className='w-fit'>
                                <li className='flex gap-2 items-center'><FaPhoneAlt/>02018891833</li>
                            </a>
                            <a href="mailto:support@woothealth.com" className='w-fit'>
                                <li className='flex gap-2 items-center'><FaEnvelope/>support@woothealth.com</li>
                            </a>
                        </ul>
                        <address className='flex gap-3 items-center mt-2 ml-2 cursor-pointer'><FaMapMarker/>3 Adebayo Munis Close, Gbagada Phase 2, Lagos</address>
                    </div>
                    <div className='md:col-span-3'>
                        <Image src='/Logo2.png' width={500} height={100}alt="WootHealth Logo" className='w-auto h-10 mb-4' loading='lazy' />
                        <p className='text-base mb-4'>Healthcare that works for your everyday life</p>
                        <p className='flex items-center text-sm italic'>Made with<FaHeart className='mx-2'/> by Gramild Digital Services</p>
                        
                        <div className='mt-8 flex gap-4'>
                            <a href='https://www.linkedin.com/company/woothealth/' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-10 w-10'>
                                <FaLinkedinIn className='text-lg text-black'/>
                            </a>
                            <a href='https://www.facebook.com/profile.php?id=100085077885831' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-10 w-10'>
                                <FaFacebookF className='text-lg text-black'/>
                            </a>
                            <a href='https://www.instagram.com/woothealth' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-10 w-10 cursor-pointer'>
                                <FaInstagram className='text-lg text-black'/> 
                            </a>
                            <a href='https://x.com/woothealth' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-10 w-10 cursor-pointer'>
                                <FaXTwitter className='text-lg text-black'/>
                            </a>
                        </div>
                    </div>
                </div>
        
                {/* Mobile */}
                <div className='flex flex-col gap-y-8 md:hidden'>
                    <div>
                        <h3 className='font-semibold text-xl mb-4'>Quick Links</h3>
                        <ul className='flex flex-col gap-4 ml-2 text-base'>
                            {link1.map((item, index) => (
                                <Link href={item.url} key={index}>
                                    <li>{item.name}</li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div>
                            <h3 className='font-semibold text-xl mb-4'>Health Plans</h3>
                            <ul className='flex flex-col gap-3 ml-2 text-base'>
                                {link2.map((item, index) => (
                                    <Link href={item.url} key={index}>
                                        <li>{item.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className='font-semibold text-xl mb-4'>Contact Us</h3>
                            <ul className='flex flex-col gap-3 ml-2 text-base'>
                                <a href="tel:02018891833" className='w-fit'>
                                <li className='flex gap-2 items-center'><FaPhoneAlt/>02018891833</li>
                            </a>
                            <a href="mailto:support@woothealth.com" className='w-fit'>
                                <li className='flex gap-2 items-center'><FaEnvelope/>support@woothealth.com</li>
                            </a>
                            </ul>
                            <address className='flex mt-3 ml-2 cursor-pointer gap-4 items-center'><FaMapMarker/>3 Adebayo Munis Close, Gbagada Phase 2, Lagos</address>
                        </div>
                    </div>
                    <div className=''>
                        <Image src='/Logo2.png' width={500} height={100} alt="WootHealth Logo" className='w-auto h-8 mb-4' priority />
                        <p className='text-lg mb-4'>
                            Healthcare that works for your everyday life
                        </p>
                        <p className='flex items-center text-sm italic'>Made with<FaHeart className='mx-2'/> by Gramild Digital Services</p>
                        
                        <div className='mt-8 flex gap-4'>
                            <a href='https://www.linkedin.com/company/woothealth/' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px]'>
                                <FaLinkedinIn className='text-lg text-black'/>
                            </a>
                            <a href='https://www.facebook.com/profile.php?id=100085077885831' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px]'>
                                <FaFacebookF className='text-lg text-black'/>
                            </a>
                            <a href='https://www.instagram.com/woothealth' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px] cursor-pointer'>
                                <FaInstagram className='text-lg text-black'/> 
                            </a>
                            <a href='https://x.com/woothealth' className='flex items-center justify-center bg-[#FAFAFA] rounded-full h-[30px] w-[30px] cursor-pointer'>
                                <FaXTwitter className='text-lg text-black'/>
                            </a>
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