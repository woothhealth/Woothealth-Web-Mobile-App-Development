// 'use client';

import { AdminOverviewProvider } from "@/Components/AdminOverviewContext";

export default function OverviewAdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminOverviewProvider>
      <div className="relative w-full bg-[#FAFAFA] pb-4 mt-4 md:mt-0 space-y-2">
        {children}
      </div>
    </AdminOverviewProvider>
  );
}

// export default function OverviewAdminDashboardLayout({
//   children,
//   totalUsers,
//   pending,
//   activeClient,
//   activities,
//   enrollees,
//   tracking,
//   telemedicineStats,
//   head,
//   revenue,
// }: Readonly<{
//   children: React.ReactNode;
//   totalUsers: React.ReactNode;
//   pending: React.ReactNode;
//   head: React.ReactNode;
//   activeClient: React.ReactNode;
//   activities: React.ReactNode;
//   enrollees: React.ReactNode;
//   tracking: React.ReactNode;
//   revenue: React.ReactNode;
//   telemedicineStats: React.ReactNode;
// }>) {
//   return (
//     <AdminOverviewProvider>
//     <>
//     <div className="relative w-full bg-[#FAFAFA] pb-4 space-y-2">
//       <div className="sticky">{head}</div>
//       <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-1 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[96%] formDiv">
//         <div>{totalUsers}</div>
//         <div>{enrollees}</div>
//         <div>{activeClient}</div>
//         <div>{telemedicineStats}</div>
//       </div>
//       <div className="px-2 md:px-4 flex flex-col md:flex-row gap-4 md:gap-6">
//         <div className="md:w-[58%] border border-[#D9D9D9] rounded-[10px] bg-[#FFFFFF]">{revenue}</div>
//         <div className="md:w-[40%] border border-[#D9D9D9] rounded-[10px] bg-[#FFFFFF]">{children}</div>
//       </div>
//       <div className="px-2 md:px-4 flex flex-col md:flex-row gap-4 md:gap-6">
//         <div className="md:w-[58%] md:space-y-4 border border-[#D9D9D9] rounded-[10px]">{activities}</div>
//         <div className="md:w-[40%] space-y-4">
//           <div className="border border-[#D9D9D9] rounded-[10px]">{pending}</div>
//           <div className="border border-[#D9D9D9] rounded-[10px]">{tracking}</div>
//         </div>
//       </div>
//     </div>
//     </>
//     </AdminOverviewProvider>
//   );
// }
