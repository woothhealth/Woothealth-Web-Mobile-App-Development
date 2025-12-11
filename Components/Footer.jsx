import React from 'react'
import Image from 'next/image'
import { FaAppStoreIos, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarker, FaPhoneAlt, FaStar } from 'react-icons/fa'
import { FaFacebook, FaGooglePlay, FaHeart, FaX, FaXTwitter } from 'react-icons/fa6'
import { DiAppstore } from 'react-icons/di'

const Footer = () => {
  return (
    <section className='bg-[#120052] text-[#FFFFFF] text-[0.9rem] py-10'>
        <div className='flex flex-col items-center justify-center mx-18 bg-[#FAFAFA] mb-8 rounded-4xl h-50 text-[#000000]'>
            <div className='flex text-xs gap-6'>
                <div className='flex'>
                    <div className='h-5 w-5 bg-linear-to-r from-[#17C9FB] to-[#1A74E8] rounded-sm flex items-center justify-center mr-2'>
                        <DiAppstore className='text-lg font-extrabold'/>
                    </div>
                    <p className='flex items-center'>
                        4.7 <FaStar className='mx-1'/> on Apple Store <span className='font-extralight ml-1'>600k reviews</span>
                    </p>
                </div>
                <div className='flex items-center'>
                    <FaGooglePlay className='text-sm font-extrabold mr-2'/>
                    <p className='flex items-center'>
                        4.8 <FaStar className='mx-1'/> on Play Store <span className='font-extralight ml-1'>500k reviews</span>
                    </p>
                </div>
            </div>
            <h2 className='text-[25px] font-extrabold'>
                Healthcare that fits your everyday life
            </h2>
            <button className='px-20 py-3'>
                Get Started
            </button>
            <div>
                <div>

                </div>
                <div className='border-dashed border-2 h-10 w-30'>

                </div>
            </div>
        </div>
        <div className='flex justify-between px-[140px]'>
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
                    <li className='flex gap-2 items-center'><FaEnvelope/>support@woothealth.com</li>
                    <address className='flex gap-3 items-center'><FaMapMarker/>Oregun-Ikeja, Lagos, Nigeria</address>
                </ul>
            </div>
            <div className=''>
                <Image src='/Logo2.png' width={500} height={100} alt="WootHealth Logo" className='w-auto h-[2.5rem] mb-4' loading='lazy' />
                <p className='text-base mb-4'>Healthcare that works for your everyday life</p>
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
    </section>
  )
}

export default Footer