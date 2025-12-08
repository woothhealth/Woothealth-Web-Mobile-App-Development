import React from 'react'
import Image from 'next/image'
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarker, FaPhoneAlt } from 'react-icons/fa'
import { FaHeart, FaXTwitter } from 'react-icons/fa6'

const Footer = () => {
  return (
    <section className='bg-[#120052] text-[#FFFFFF] text-[0.9rem] py-10 px-[150px] border-t-12 border-t-[#49A5EF]'>
        <div className='flex justify-between'>
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
                <Image src='/Logo.png' width={45} height={0} alt="WootHealth Logo" className='w-auto h-[2.5rem] mb-4' loading='lazy' />
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