'use client';

import Title from '../../UIs/Title';
import { EnrolleesStatsProvider } from './EnrolleesStatsContext';
import { AdminEnrolleesProvider } from '@/Components/AdminEnrolleesContext';

export default function DashboardLayout({
  children,
  active,
  inactive,
  enroll,
  header,
}: Readonly<{
  children: React.ReactNode;
  active: React.ReactNode;
  inactive: React.ReactNode;
  enroll: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <AdminEnrolleesProvider>
      <EnrolleesStatsProvider>
        <div className="relative w-full bg-[#FAFAFA] pb-6 space-y-4 md:space-y-0">
          <Title title="Enrollees"/>
          <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
            <div>{enroll}</div>
            <div>{active}</div>
            <div>{inactive}</div>
          </div>
          <div className="md:px-4 px-3">{children}</div>
        </div>
      </EnrolleesStatsProvider>
    </AdminEnrolleesProvider>
  );
}
