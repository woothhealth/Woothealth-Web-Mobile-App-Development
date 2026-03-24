'use client';

import { EmployeeStatsProvider } from './EmployeeStatsContext';

export default function DashboardLayout({
  children,
  active,
  slot,
  enroll,
  header,
}: Readonly<{
  children: React.ReactNode;
  active: React.ReactNode;
  slot: React.ReactNode;
  enroll: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <EmployeeStatsProvider>
      <div className="relative w-full bg-[#FAFAFA] pb-6 space-y-4 md:space-y-0">
        <div className="sticky top-0">{header}</div>
        <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{enroll}</div>
          <div>{active}</div>
          <div>{slot}</div>
        </div>
        <div className="md:px-4 px-3">{children}</div>
      </div>
    </EmployeeStatsProvider>
  );
}
