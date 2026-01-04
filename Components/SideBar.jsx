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
import { usePathname } from 'next/navigation';

const path = [
    {
        name: 'Overview',
        url: '/dashboard/retail',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'My Plans',
        url: '/dashboard/retail/plans',
        icon: <GrPlan/>
    },
    {
        name: 'Wallet',
        url: '/dashboard/retail/wallet',
        icon: <FaWallet/>
    },
    {
        name: 'Providers',
        url: '/dashboard/retail/providers',
        icon: <ImLocation2/>
    },
    {
        name: 'Telemedicine',
        url: '/dashboard/retail/telemedicine',
        icon: <FaTv/>
    }
]

const path2 = [
    {
        name: 'Profile',
        url: '/dashboard/retail/profile',
        icon: <FaUserAlt/>
    },
    {
        name: 'Settings',
        url: '/dashboard/retail/settings',
        icon: <IoMdSettings/>
    },
    {
        name: 'Logout',
        url: '/login',
        icon: <RiLogoutBoxRLine/>
    }
]

const SideBar = () => {
    const [isToggle, setIsToggle] = useState(false);

    const click = () => {
        setIsToggle(!isToggle)
    }

    const pathname = usePathname()

  return (
    <section className='hidden lg:block lg:sticky lg:left-0 lg:top-0 px-6 h-screen w-fit border-r border-[#D9D9D9] py-8'>
        {!isToggle && 
        <>
        <div className='flex flex-col gap-6 h-fit w-[20vw]'>
            <div className='flex justify-between items-center'>
                <Image src='/Logo2.png' height={100} width={500} alt='WootHealth Logo' className='h-10 w-fit' loading='eager' />
                <GoSidebarExpand className='text-3xl cursor-pointer text-[#00000066]' onClick={click} />
            </div>
            <div className='flex flex-col gap-1'>
                {path.map((path, index) => {
                    const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                return (
                    <Link key={index} href={path.url}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000033] rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
                )})}
            </div>
            <div className='flex flex-col gap-2 h-full'>
                {path2.map((path, index) => {
                    const last = index === 2;
                    const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                    return (
                        <Link key={index} href={path.url}>
                            <div className={`flex gap-4 py-3 items-center text-[#00000033] rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''} ${last ? 'mt-8' : ''}`}>
                                <div className='text-xl'>
                                    {path.icon}
                                </div>
                                {path.name}
                            </div>
                        </Link>
                )})}
            </div>
        </div>
        </>
        }
       {isToggle && (
            <>
            <div className='flex flex-col gap-6 h-fit w-fit'>
                    <div className='flex justify-between items-center gap-4'>
                        <Image src='/Woot_collapse.png' height={100} width={500} alt='WootHealth Logo' className='h-9 w-fit' loading='eager' />
                        <GoSidebarCollapse className='text-3xl text-[#00000066] cursor-pointer' onClick={click} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        {path.map((path, index) => {
                        const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/dashboard/retail")
                        return (
                            <Link key={index} href={path.url}>
                                <div className={`flex gap-4 py-3 items-center text-[#00000033] rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                    <div className='text-2xl'>
                                        {path.icon}
                                    </div>
                                </div>
                            </Link>
                        )})}
                    </div>
                    <div className='flex flex-col gap-1 h-full'>
                        {path2.map((path, index) => {
                            const last = index === 2;
                            const isActive = pathname === path.url || (pathname.startsWith(path.url) && path.url !== "/")
                            return (
                                <Link key={index} href={path.url}>
                                    <div className={`flex gap-4 py-3 items-center text-[#00000033] rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''} ${last ? 'mt-8' : ''}`}>
                                        <div className='text-2xl'>
                                            {path.icon}
                                        </div>
                                    </div>
                                </Link>
                        )})}
                    </div>
            </div>
            </>
        )
        }
    </section>
  )
}

export default SideBar