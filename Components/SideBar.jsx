'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { FaWallet, FaTv, FaUserAlt } from "react-icons/fa";
import { RiLayoutMasonryFill, RiLogoutBoxRLine } from "react-icons/ri";
import { ImLocation2 } from "react-icons/im";
import { GrPlan } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";

import Link from 'next/link';

const path = [
    {
        name: 'Overview',
        url: '/overview',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'My Plans',
        url: '/plans',
        icon: <GrPlan/>
    },
    {
        name: 'Wallet',
        url: '/wallet',
        icon: <FaWallet/>
    },
    {
        name: 'Providers',
        url: '/providers',
        icon: <ImLocation2/>
    },
    {
        name: 'Telemedicine',
        url: '/telemedicine',
        icon: <FaTv/>
    }
]

const path2 = [
    {
        name: 'Profile',
        url: '/profile',
        icon: <FaUserAlt/>
    },
    {
        name: 'Settings',
        url: '/settings',
        icon: <IoMdSettings/>
    },
    {
        name: 'Logout',
        url: '/logout',
        icon: <RiLogoutBoxRLine/>
    }
]

const SideBar = () => {
    const [istoggle, setIsToggle] = useState(false);

    const click = () => {
        setIsToggle(!istoggle)
    }

  return (
    <section className='sticky left-0 top-0 px-6 h-screen w-[20vw] border-r border-[#D9D9D9] py-8'>
        <div className='flex flex-col gap-10 h-full'>
            <div className='flex justify-between items-center'>
                <Image src='/Logo2.png' height={100} width={500} alt='WootHealth Logo' className='h-10 w-fit' loading='eager' />
                <GoSidebarExpand className='w-6 h-6 text-[#00000066]' />
            </div>
            <div className='flex flex-col gap-2'>
                {path.map((path, index) => (
                    <div key={index} className='flex gap-4 py-3 items-center text-[#B6B6B9] px-3'>
                        <div className='text-xl'>
                            {path.icon}
                        </div>
                        <Link href={path.url}>{path.name}</Link>
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-2 h-full'>
                {path2.map((path, index) => {
                    const last = index === 2;
                    return (
                        <div key={index} className={`flex gap-4 py-2 items-center text-[#B6B6B9] px-3 ${last ? 'mt-10' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            <Link href={path.url}>{path.name}</Link>
                        </div>
                )})}
            </div>

            {istoggle && (
                <>
                    <div className='flex justify-between items-center'>
                        <Image src='/Logo2.png' height={100} width={500} alt='WootHealth Logo' className='h-10 w-fit' loading='eager' />
                        <GoSidebarExpand className='w-6 h-6 text-[#00000066]' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        {path.map((path, index) => (
                            <div key={index} className='flex gap-4 py-3 items-center text-[#B6B6B9] px-3'>
                                <div className='text-xl'>
                                    {path.icon}
                                </div>
                                <Link href={path.url}>{path.name}</Link>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col gap-2 h-full'>
                        {path2.map((path, index) => {
                            const last = index === 2;
                            return (
                                <div key={index} className={`flex gap-4 py-2 items-center text-[#B6B6B9] px-3 ${last ? 'mt-10' : ''}`}>
                                    <div className='text-xl'>
                                        {path.icon}
                                    </div>
                                    <Link href={path.url}>{path.name}</Link>
                                </div>
                        )})}
                    </div>
                </>
            )
            }
        </div>
    </section>
  )
}

export default SideBar