import { AdminClaimsProvider } from '@/Components/AdminClaimsContext'
import { ClaimsStatsProvider } from '../ClaimsStatsContext';
import Title from '../../UIs/Title';

export default function DashboardLayout({
  children,
  pending,
  total,
  rejected,
  approved,
}: Readonly<{
  children: React.ReactNode;
  pending: React.ReactNode;
  rejected: React.ReactNode;
  total: React.ReactNode;
  approved: React.ReactNode;
}>) {
  return (
    <div className="">
      <Title title="Claims" />
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
        <div>{total}</div>
        <div>{pending}</div>
        <div>{approved}</div>
        <div>{rejected}</div>
      </div>
      <div className="md:px-4 px-3">{children}</div>
    </div>
  );
}
