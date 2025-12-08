"use client"
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import Image from 'next/image'

const NavBar = () => {
    const [healthPlansOpen, setHealthPlansOpen] = React.useState(false);
    const [resourcesOpen, setResourcesOpen] = React.useState(false);

    const toggleHealthPlans = () => {
        setHealthPlansOpen(!healthPlansOpen);
        setResourcesOpen(false);
    }

    const toggleResources = () => {
        setResourcesOpen(!resourcesOpen);
        setHealthPlansOpen(false);
    }

    return (
        <nav className='flex justify-between px-16 py-6 items-center'>
            <div className=''>
                <Image src='/Logo.png' width={45} height={0} alt="WootHealth Logo" className='w-auto h-[2.5rem]' loading='lazy' />
            </div>
            <ul className='flex gap-6 text-[16px] font-medium'>
                <li className='relative flex gap-1 items-center cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md' onClick={toggleHealthPlans}>
                    Health Plans <FaChevronDown className='text-[.7rem]'/>
                    {healthPlansOpen && (
                        <div className='absolute top-10 left-0 bg-white shadow-lg rounded-md py-4 pl-1 z-10 w-full'>
                            <ul className='flex flex-col gap-3 text-[15px]'>
                                <li className='py-1 px-2 hover:bg-[#c9e3f866] rounded-md'>Business Plan</li>
                                <li className='py-1 px-2 hover:bg-[#c9e3f866] rounded-md'>Retail Plan</li>
                            </ul>
                        </div>
                    )}
                </li>
                <li className='cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md'>
                    Providers
                </li>
                <li className='cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md'>
                    About Us
                </li>
                <li className='relative flex gap-1 items-center cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md' onClick={toggleResources}>
                    Resources <FaChevronDown className='text-[.7rem]'/>
                    {resourcesOpen && (
                        <div className='absolute top-10 left-0 bg-white shadow-lg rounded-md py-4 pl-1 z-10 w-full'>
                            <ul className='flex flex-col gap-3 text-[15px]'>
                                <li className='py-1 px-2 hover:bg-[#c9e3f866] rounded-md'>Blog</li>
                                <li className='py-1 px-2 hover:bg-[#c9e3f866] rounded-md'>FAQs</li>
                            </ul>
                        </div>
                    )}
                </li>
                <li className='cursor-pointer hover:bg-[#c9e3f866] px-2 py-2 rounded-md'>
                    Contact Us
                </li>
            </ul>
            <button className='w-[120px] h-[38px]'>
                Login
            </button>
        </nav>
    )
}

export default NavBar