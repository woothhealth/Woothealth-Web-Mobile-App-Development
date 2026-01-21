import React from 'react'
import Image from 'next/image'
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarker, FaPhoneAlt } from 'react-icons/fa'
import { FaHeart, FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'

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
    <section className='bg-[#120052] text-[#FFFFFF] text-[0.9rem] border-t-12 border-t-[#49A5EF]'>
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
                <address className='flex mt-2 gap-3 items-center ml-2'><FaMapMarker/>3 Adebayo Munis Close, Gbagada Phase 2, Lagos</address>
            </div>
            <div className='md:col-span-3'>
                <Image src='/Logo2.png' width={500} height={100}alt="WootHealth Logo" className='w-auto h-[2.5rem] mb-4' loading='lazy' />
                <p className='text-base mb-4'>Healthcare you can count on.</p>
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
                    Healthcare you can count on.
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