'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { usePathname } from 'next/navigation';
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';

import { HiMiniUserGroup } from 'react-icons/hi2';
import { HiOutlineBell, HiOutlineClipboardList, HiOutlineDocumentText, HiOutlineKey, HiOutlinePencil } from 'react-icons/hi';
import LogoutButton from '../../../../UI/LogOut';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

type pathType = {
    name: string,
    url?: string,
    icon: React.ReactNode,
    isDropdown?: boolean,
    children?: {
        name?: string,
        url?: string,
        icon?: React.ReactNode,
    }[]
}

const path : pathType[] = [
    {
        name: 'Enrollee Verification',
        // url: '/dashboard/providers',
        url: '/test/providers',
        icon: <RiLayoutMasonryFill/>
    },
    {
        name: 'PA Code',
        icon: <HiOutlineKey/>,
        isDropdown: true,
        children: [
            {
                name: 'PA Code Creation',
                url: '/test/providers/pa-code',
                icon: <HiOutlinePencil />
            },
            {
                name: 'PA Code Tracking',
                url: '/test/providers/pa-code/tracking',
                icon: <HiOutlineClipboardList />
            }
        ]
    },
    {
        name: 'Claims',
        // url: '/dashboard/providers/claims',
        url: '/test/providers/claims',
        icon: <HiOutlineDocumentText/>
    },
    {
        name: 'Billing',
        // url: '/dashboard/providers/billing',
        url: '/test/providers/billings',
        icon: <HiMiniUserGroup/>
    },
    {
        name: 'Notifications',
        // url: '/dashboard/providers/notifications',
        url: '/test/providers/notifications',
        icon: <HiOutlineBell/>
    }
]

const path2 : pathType[] = [
    {
        name: 'Profile',
        // url: '/dashboard/providers/profile',
        url: '/test/providers/profile',
        icon: <FaUserAlt/>
    },
    {
        name: 'Settings',
        // url: '/dashboard/providers/settings',
        url: '/test/providers/settings',
        icon: <IoMdSettings/>
    }
]

const SideBar = () => {
    const [isToggle, setIsToggle] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const click = () => {
        setIsToggle(!isToggle)
    }

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    }

    const pathname = usePathname()

  return (
    <section className='hidden lg:block lg:sticky lg:left-0 lg:top-0 px-6 h-screen w-fit border-r border-[#D9D9D9] pb-8'>
        {!isToggle && 
        <>
        <div className='relative flex flex-col gap-6 h-full w-[18vw]'>
            <div className='flex justify-between pt-8 pb-2 items-center'>
                <Image src='/Logo2.png' height={100} width={500} alt='WootHealth Logo' className='h-10 w-fit' loading='eager' />
                <GoSidebarExpand className='text-3xl cursor-pointer text-[#00000077] font-semibold' onClick={click} />
            </div>
            <div className='flex flex-col gap-6 overflow-y-scroll custom-scrollbar h-[80vh] pr-2'>
            <div className='flex flex-col gap-1'>
                {path.map((path, index) => {
                    const isActive = path.url ? pathname === path.url : false
                    const isDropdownActive = path.isDropdown && path.children?.some(child => pathname === child.url)
                    
                    if (path.isDropdown) {
                        return (
                            <div key={index}>
                                <div 
                                    className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 pr-3 hover:bg-gray-100 cursor-pointer ${isDropdownActive ? 'bg-[#49A5EF] text-[#FFFFFF]' : ''}`}
                                    onClick={() => toggleDropdown(path.name)}
                                >
                                    <div className='text-xl'>
                                        {path.icon}
                                    </div>
                                    <span className='flex-1'>{path.name}</span>
                                    {openDropdown === path.name ? 
                                        <MdKeyboardArrowDown className='text-xl' /> : 
                                        <MdKeyboardArrowRight className='text-xl' />
                                    }
                                </div>
                                {openDropdown === path.name && (
                                    <div className='ml-4 mt-1 space-y-1'>
                                        {path.children?.map((child, childIndex) => {
                                            const isChildActive = pathname === child.url
                                            return (
                                                <Link key={childIndex} href={child.url!}>
                                                    <div className={`flex p-3 items-center text-[15px] text-[#000000]/70 font-medium rounded-[15px] hover:bg-gray-100 ${isChildActive ? 'bg-[#49A5EF] text-[#FFFFFF]' : ''}`}>
                                                        {child.icon && <div className='text-lg text-center mr-2'>{child.icon}</div>}
                                                        {child.name}
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    
                    return (
                        <Link key={index} href={path.url!}>
                            <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                <div className='text-xl'>
                                    {path.icon}
                                </div>
                                {path.name}
                            </div>
                        </Link>
                    )})}
            </div>
            <div className='flex flex-col gap-1 h-full'>
                {path2.map((path, index) => {
                    const isActive = pathname === path.url
                    return (
                        <Link key={index} href={path.url!}>
                            <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                <div className='text-xl'>
                                    {path.icon}
                                </div>
                                {path.name}
                            </div>
                        </Link>
                )})}
                <div className={`text-[#00000077] font-semibold rounded-2xl hover:bg-red-400/50 hover:text-[#FFFFFF] cursor-pointer`}>
                    <LogoutButton/>
                </div>
            </div>
            </div>
        </div>
        </>
        }
       {isToggle && (
            <>
            <div className='flex flex-col gap-6 h-full w-fit'>
                    <div className='sticky bg-[#FAFAFA] top-0 flex justify-between pt-8 pb-2 items-center gap-4'>
                        <Image src='/Woot_collapse.png' height={100} width={500} alt='WootHealth Logo' className='h-9 w-fit' loading='eager' />
                        <GoSidebarCollapse className='text-3xl text-[#00000077] font-semibold cursor-pointer' onClick={click} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        {path.map((path, index) => {
                        const isActive = pathname === path.url
                        const isDropdownActive = path.isDropdown && path.children?.some(child => pathname === child.url)
                        
                        if (path.isDropdown) {
                            return (
                                <div key={index}>
                                    <div 
                                        className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 cursor-pointer ${isDropdownActive ? 'bg-[#49A5EF] text-[#FFFFFF]' : ''}`}
                                        onClick={() => toggleDropdown(path.name)}
                                    >
                                        <div className='text-2xl'>
                                            {path.icon}
                                        </div>
                                    </div>
                                    {openDropdown === path.name && (
                                        <div className='mt-1 space-y-1'>
                                            {path.children?.map((child, childIndex) => {
                                                const isChildActive = pathname === child.url
                                                return (
                                                    <Link key={childIndex} href={child.url!}>
                                                        <div className={`flex py-2 px-3 items-center justify-center text-sm text-[#00000077] font-medium rounded-lg hover:bg-gray-100 ${isChildActive ? 'bg-[#49A5EF] text-[#FFFFFF]' : ''}`}>
                                                            <div className='text-xs text-center'>
                                                                {child.name!.split(' ').map(word => word[0]).join('')}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        }
                        
                        return (
                            <Link key={index} href={path.url!}>
                                <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                    <div className='text-2xl'>
                                        {path.icon}
                                    </div>
                                </div>
                            </Link>
                        )})}
                    </div>
                    <div className='flex flex-col gap-1 h-full'>
                        {path2.map((path, index) => {
                            const isActive = pathname === path.url
                            return (
                                <Link key={index} href={path.url!}>
                                    <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                        <div className='text-2xl'>
                                            {path.icon}
                                        </div>
                                    </div>
                                </Link>
                        )})}
                        <div className={`flex items-center text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-400/50 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                            <LogoutButton collapsed />
                        </div>
                    </div>
            </div>
            </>
        )
        }

        <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </section>
  )
}

export default SideBar