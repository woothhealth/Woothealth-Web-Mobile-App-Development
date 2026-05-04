'use client'

import React, { useState } from 'react'
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '../../../UI/LogOut';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { HiOutlineBell, HiOutlineClipboardList, HiOutlineDocumentAdd, HiOutlineDocumentText, HiOutlineKey } from 'react-icons/hi';
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

const path = [
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
                icon: <HiOutlineDocumentAdd />
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
        url: '/test/providers/billing',
        icon: <HiMiniUserGroup/>
    },
    {
        name: 'Notifications',
        // url: '/dashboard/providers/notifications',
        url: '/test/providers/notifications',
        icon: <HiOutlineBell/>
    }
]

const path2 = [
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

const AdminToggle = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
    const pathname = usePathname()
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    }

    if (!isOpen) return null

    const [pressedUrl, setPressedUrl] = useState<string | null>(null)
    
    const handleItemClick = (url: string) => {
        setPressedUrl(url)
        onClose?.()
        setTimeout(() => setPressedUrl(null), 400)
    }
  
    return (
    <>
    <div className='absolute top-18 left-0 z-50 flex flex-col md:hidden gap-6 h-[95svh] bg-[#FFFFFF] w-[70%] px-4 pt-4 pb-14 overflow-y-scroll custom-scrollbar mb-4'>
        <div className='flex flex-col gap-1'>
            {path.map((path, index) => {
                const isActive = path.url ? pathname === path.url : false
                const isDropdownOpen = openDropdown === path.name;
                
                if (path.isDropdown) {
                    return (
                        <div key={index}>
                            <div 
                                className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl hover:bg-gray-100 pl-5 cursor-pointer`}
                                onClick={() => toggleDropdown(path.name)}
                            >
                                <div className='text-xl'>
                                    {path.icon}
                                </div>
                                {path.name}
                                <div className='ml-auto'>
                                    {isDropdownOpen ? <MdKeyboardArrowDown size={20} /> : <MdKeyboardArrowRight size={20} />}
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <div className='ml-8 mt-1 flex flex-col gap-1'>
                                    {path.children.map((child, childIndex) => {
                                        const isChildActive = pathname === child.url;
                                        return (
                                            <Link key={childIndex} href={child.url} onClick={() => handleItemClick(child.url)}>
                                                <div className={`flex gap-4 py-2 items-center text-[#00000077] font-semibold rounded-2xl hover:bg-gray-100 pl-5 ${isChildActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                                                    {child.name}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }
                
                return (
                    <Link key={index} href={path.url!} onClick={() => handleItemClick(path.url!)}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl hover:bg-gray-100 pl-5 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
                );
            })}
        </div>
        <div className='flex flex-col gap-1 h-full'>
            {path2.map((path, index) => {
                const isActive = pathname === path.url
                return (
                    <Link key={index} href={path.url} onClick={() => handleItemClick(path.url)}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-gray-100 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {path.icon}
                            </div>
                            {path.name}
                        </div>
                    </Link>
            )})}
            <div className={`text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-500/70 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                <LogoutButton />
            </div>
        </div>
    </div>
    <div className='absolute top-18 h-screen w-full bg-[#FFFFFF] opacity-25'></div>

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
    </>
  )
}

export default AdminToggle