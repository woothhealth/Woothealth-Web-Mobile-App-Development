"use client"

import React from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

const NavBar = () => {
    const [healthPlansOpen, setHealthPlansOpen] = React.useState(false);
    const [resourcesOpen, setResourcesOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const pathname = usePathname();

    const isActive = (path) => pathname === path || (path !== '/' && pathname.startsWith(path + '/'));

    const toggleHealthPlans = () => {
        setHealthPlansOpen(!healthPlansOpen);
        setResourcesOpen(false);
    }

    const toggleResources = () => {
        setResourcesOpen(!resourcesOpen);
        setHealthPlansOpen(false);
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <nav className='flex justify-between px-8 py-4 md:px-10 md:py-6 lg:px-16 items-center sticky top-0 left-0 right-0 bg-white z-50 shadow-md'>
            <Link href='/' className=''>
                <Image src='/Logo2.png' width={500} height={0} alt="WootHealth Logo" className='w-auto h-10' priority />
            </Link>
            {/* Desktop menu */}
            <ul className='hidden lg:flex gap-6 text-[16px] font-medium'>
                <li className={`relative flex gap-1 items-center cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md ${isActive('/business') || isActive('/retail') ? 'text-[#49A5EF]' : ''}`} onClick={toggleHealthPlans}>
                        Health Plans 
                        {healthPlansOpen ? <FaChevronUp className='text-[.7rem]'/> : <FaChevronDown className='text-[.7rem]'/>}
                    {healthPlansOpen && (
                        <div className='absolute top-10 left-0 bg-white shadow-lg rounded-md py-4 pl-1 z-10 w-full'>
                            <ul className='flex flex-col gap-3 text-[15px]'>
                                <Link href="/business">
                                    <li className={`py-1 px-2 hover:bg-[#c9e3f866] rounded-md text-[#000000] ${isActive('/business') ? 'text-[#49A5EF]' : ''}`}>Business Plan</li>
                                </Link>
                                <Link href="/retail">
                                    <li className={`py-1 px-2 hover:bg-[#c9e3f866] text-[#000000] rounded-md ${isActive('/retail') ? 'text-[#49A5EF]' : ''}`}>Retail Plan</li>
                                </Link>
                            </ul>
                        </div>
                    )}
                </li>
                <Link href="/providers">
                    <li className={`cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md ${isActive('/providers') ? 'text-[#49A5EF]' : ''}`}>
                        Providers
                    </li>
                </Link>
                <Link href="/about">
                    <li className={`cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md ${isActive('/about') ? 'text-[#49A5EF]' : ''}`}>
                        About Us
                    </li>
                </Link>
                <li className={`relative flex gap-1 items-center cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md ${isActive('/blog') || isActive('/FAQs') ? 'text-[#49A5EF]' : ''}`} onClick={toggleResources}>
                    Resources
                    {resourcesOpen ? <FaChevronUp className='text-[.7rem]'/> : <FaChevronDown className='text-[.7rem]'/>}
                    {resourcesOpen && (
                        <div className='absolute top-10 left-0 bg-white shadow-lg rounded-md py-4 pl-1 z-10 w-full'>
                            <ul className='flex flex-col gap-3 text-[15px]'>
                                <Link href="/blog">
                                    <li className={`py-1 px-2 hover:bg-[#c9e3f866] rounded-md text-[#000000] ${isActive('/blog') ? 'text-[#49A5EF]' : ''}`}>Blog</li>
                                </Link>
                                <Link href="/FAQs">
                                    <li className={`py-1 px-2 hover:bg-[#c9e3f866] rounded-md text-[#000000] ${isActive('/FAQs') ? 'text-[#49A5EF]' : ''}`}>FAQs</li>
                                </Link>
                            </ul>
                        </div>
                    )}
                </li>
                <Link href="/contact">
                    <li className={`cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md ${isActive('/contact') ? 'text-[#49A5EF]' : ''}`}>
                        Contact Us
                    </li>
                </Link>
            </ul>
            <Link href='/login' className='w-fit'>
            <button className='btn hidden lg:block w-[120px] h-[38px]'>
                Login
            </button>
            </Link>

            {/* Hamburger for Mobile */}
            <div 
                onClick={toggleMenu}
                className='lg:hidden flex flex-col justify-center gap-1.5 cursor-pointer relative w-6 h-6'
                aria-label="Toggle menu"
            >
                <span className={`w-6 h-[2.6px] bg-black block transition-all duration-300 ${menuOpen ? 'rotate-45 absolute top-[11px]' : ''}`}></span>
                <span className={`w-6 h-[2.6px] bg-black block transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-4 h-[2.5px] bg-black block transition-all duration-300 ${menuOpen ? '-rotate-45 absolute top-[11px] w-6' : ''}`}></span>
            </div>

            {/* Mobile and Tab Menu */}
            {menuOpen && (
                <div className='flex flex-col absolute top-18 left-0 right-0 bg-white shadow-lg lg:hidden h-screen px-4 py-2 md:px-10'>
                    <ul className='flex flex-col gap-6 md:gap-10 py-6 text-[18px] md:text-[20px] font-medium'>
                        <li className={`flex flex-col gap-2 cursor-pointer hover:bg-[#c9e3f866] px-3 py-2 rounded-md ${isActive('/business') || isActive('/retail') ? 'text-[#49A5EF]' : ''}`}>
                            <span onClick={toggleHealthPlans} className='flex justify-between items-center'>
                                Health Plans
                                {healthPlansOpen ? <FaChevronUp className='text-[.8rem] md:text-[1rem]'/> : <FaChevronDown className='text-[.8rem] md:text-[1rem]'/>}
                            </span>
                            {healthPlansOpen && (
                                <div className='flex flex-col bg-white shadow-lg rounded-md py-4 pl-1 z-10 w-full'>
                                    <ul className='flex flex-col gap-3 text-[16px] md:text-[18px]'>
                                        <Link href="/business">
                                            <li className={`py-1 px-2 hover:bg-[#c9e3f866] text-[#000000] rounded-md ${isActive('/business') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>Business Plan</li>
                                        </Link>
                                        <Link href="/retail">
                                            <li className={`py-1 px-2 hover:bg-[#c9e3f866] text-[#000000] rounded-md ${isActive('/retail') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>Retail Plan</li>
                                        </Link>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <Link href="/providers">
                            <li className={`cursor-pointer hover:bg-[#c9e3f866] px-3 py-2 rounded-md ${isActive('/providers') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>
                                Providers
                            </li>
                        </Link>
                        <Link href="/about">
                            <li className={`cursor-pointer hover:bg-[#c9e3f866] px-3 py-2 rounded-md ${isActive('/about') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>
                                About Us
                            </li>
                        </Link>
                        <li className={`flex flex-col gap-2 cursor-pointer hover:bg-[#c9e3f866] px-3 py-2 rounded-md ${isActive('/blog') || isActive('/FAQs') ? 'text-[#49A5EF]' : ''}`}>
                            <span onClick={toggleResources} className='flex justify-between items-center'>
                                Resources
                                {resourcesOpen ? <FaChevronUp className='text-[.8rem] md:text-[1rem]'/> : <FaChevronDown className='text-[.8rem] md:text-[1rem]'/>}
                            </span>
                                {resourcesOpen && (
                                    <div className='flex flex-col bg-white shadow-lg rounded-md py-4 pl-1 z-10 w-full'>
                                        <ul className='flex flex-col gap-3 text-[16px] md:text-[18px]'>
                                            <Link href="/blog">
                                                <li className={`py-1 px-2 hover:bg-[#c9e3f866] text-[#000000] rounded-md ${isActive('/blog') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>Blog</li>
                                            </Link>
                                            <Link href="/FAQs">
                                                <li className={`py-1 px-2 hover:bg-[#c9e3f866] text-[#000000] rounded-md ${isActive('/FAQs') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>FAQs</li>
                                            </Link>
                                        </ul>
                                    </div>
                                )}
                        </li>
                        <Link href="/contact">
                            <li className={`cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md ${isActive('/contact') ? 'text-[#49A5EF]' : ''}`} onClick={toggleMenu}>
                                Contact Us
                            </li>
                        </Link>
                    </ul>
                    <Link href='/login' className='w-full'>
                        <button className='btn w-full h-12 bg-[#49A5EF] text-white rounded-full font-semibold mt-2' onClick={toggleMenu}>
                            Login
                        </button>
                    </Link>
                </div>
            )}
        </nav>
    )
}

export default NavBar