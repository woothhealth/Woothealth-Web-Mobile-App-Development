'use client'

import React, { useState } from 'react'
import { FaUserAlt, FaUsers } from "react-icons/fa";
import { RiLayoutMasonryFill } from "react-icons/ri";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/UI/LogOut';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { HiOutlineAcademicCap, HiOutlineBell, HiOutlineCamera, HiOutlineCash, HiOutlineChatAlt2, HiOutlineCheckCircle, HiOutlineChip, HiOutlineClipboardCheck, HiOutlineClipboardList, HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineKey, HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineTicket, HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineUsers } from 'react-icons/hi';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import { can } from '@/lib/rbac';

const navItems = [
    {
        name: 'Overview',
        url: '/dashboard/superadmin',
        icon: <RiLayoutMasonryFill/>,
        permission: 'overview',
    },
    {
        name: 'Users',
        url: '/dashboard/superadmin/users',
        icon: <HiOutlineUsers/>,
        permission: 'users',
    },
    {
        name: 'Enrollees',
        url: '/dashboard/superadmin/enrollees',
        icon: <FaUsers/>,
        permission: 'enrollees',
    },
    {
        name: 'Clients',
        url: '/dashboard/superadmin/clients',
        icon: <HiMiniUserGroup/>,
        permission: 'clients',
    },
    {
        name: 'Benefits/Plan',
        url: '/dashboard/superadmin/benefits',
        icon: <HiOutlineClipboardList/>,
        permission: 'benefits',
    },
    {
        name: 'Finance',
        url: '/dashboard/superadmin/finance',
        icon: <HiOutlineCash/>,
        permission: 'finance',
    },
    {
        name: 'Leads',
        url: '/dashboard/superadmin/leads',
        icon: <HiOutlineTrendingUp/>,
        permission: 'leads',
    },
    {
        name: 'Feedback',
        url: '/dashboard/superadmin/coming',
        icon: <HiOutlineChatAlt2/>,
        permission: 'customerFeeds',
    },
    {
        name: 'Tickets',
        url: '/dashboard/superadmin/tickets',
        icon: <HiOutlineTicket/>,
        permission: 'tickets',
    },
    {
        name: 'Employee',
        url: '/dashboard/superadmin/employees',
        icon: <HiOutlineUserGroup/>,
        permission: 'employees',
    },
    {
        name: 'Providers',
        url: '/dashboard/superadmin/providers',
        icon: <HiOutlineOfficeBuilding/>,
        permission: 'providers',
    },
    {
        name: 'Claims',
        url: '/dashboard/superadmin/claims',
        icon: <HiOutlineDocumentText/>,
        permission: 'claims',
    },
    {
        name: 'Reimbursement',
        url: '/dashboard/superadmin/reimbursement',
        icon: <HiOutlineCreditCard/>,
        permission: 'reimbursement',
    },
    {
        name: 'Validations',
        url: '/dashboard/superadmin/validations',
        icon: <HiOutlineCheckCircle/>,
        permission: 'validations',
    },
    {
        name: 'PA Codes',
        url: '/dashboard/superadmin/pa-code',
        icon: <HiOutlineKey/>,
        permission: 'paCodes',
    },
    {
        name: 'Prescription',
        url: '/dashboard/superadmin/prescription',
        icon: <HiOutlineClipboardCheck/>,
        permission: 'prescription',
    },
    {
        name: 'Telemedicine',
        url: '/dashboard/superadmin/telemedicine',
        icon: <HiOutlineCamera/>,
        permission: 'telemedicine',
    },
    {
        name: 'Pre-Employment Tests',
        url: '/dashboard/superadmin/pre-employment',
        icon: <HiOutlineAcademicCap/>,
        permission: 'preEmployment',
    },
    {
        name: 'Notification',
        url: '/dashboard/superadmin/notification',
        icon: <HiOutlineBell/>,
        permission: 'notification',
    },
    {
        name: 'Roles',
        url: '/dashboard/superadmin/roles',
        icon: <HiOutlineShieldCheck/>,
        permission: 'roles',
    },
    {
        name: 'Product & Tech',
        url: '/dashboard/superadmin/products',
        icon: <HiOutlineChip/>,
        permission: 'product',
    }
];

const actionItems = [
    {
        name: 'Profile',
        url: '/dashboard/superadmin/profile',
        icon: <FaUserAlt/>,
        permission: 'profile',
    }
]

const AdminToggle = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
    if (!isOpen) return null;

    const pathname = usePathname();
    const user = useAdminDashboardUser();
    const [pressedUrl, setPressedUrl] = useState<string | null>(null);
    const visibleNavItems = navItems.filter((item) => can(user, item.permission));
    const visibleActionItems = actionItems.filter((item) => can(user, item.permission));
    
    const handleItemClick = (url: string) => {
        setPressedUrl(url);
        onClose?.();
        setTimeout(() => setPressedUrl(null), 400);
    };
  
    return (
    <>
    <div className='absolute top-18 left-0 z-50 flex flex-col md:hidden gap-6 h-[95svh] bg-[#FFFFFF] w-[70%] px-4 pt-4 pb-14 overflow-y-scroll custom-scrollbar mb-4'>
        <div className='flex flex-col gap-1'>
            {visibleNavItems.map((item, index) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/superadmin")
                return (
                    <Link key={index} href={item.url} onClick={() => handleItemClick(item.url)}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl hover:bg-primary/70 hover:text-[#FFFFFF] pl-5 ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {item.icon}
                            </div>
                            {item.name}
                        </div>
                    </Link>
            )})}
        </div>
        <div className='flex flex-col gap-1 h-full'>
            {visibleActionItems.map((item, index) => {
                const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard/superadmin")
                return (
                    <Link key={index} href={item.url} onClick={() => handleItemClick(item.url)}>
                        <div className={`flex gap-4 py-3 items-center text-[#00000077] font-semibold rounded-2xl pl-5 hover:bg-primary/70 hover:text-[#FFFFFF] ${isActive ? 'bg-[#49A5EF] text-[#FFFFFF] font-semibold' : ''}`}>
                            <div className='text-xl'>
                                {item.icon}
                            </div>
                            {item.name}
                        </div>
                    </Link>
            )})}
            <div className={`text-[#00000077] font-semibold rounded-2xl justify-center hover:bg-red-500/70 hover:text-[#FFFFFF] text-center cursor-pointer`}>
                <LogoutButton />
            </div>
        </div>
    </div>
    <div className='absolute top-18 h-screen w-full bg-[#FFFFFF] opacity-25' onClick={() => onClose?.()}></div>

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