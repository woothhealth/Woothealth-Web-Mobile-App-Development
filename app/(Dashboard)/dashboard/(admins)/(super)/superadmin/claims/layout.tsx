import { AdminClaimsProvider } from '@/Components/AdminClaimsContext'
import { ClaimsStatsProvider } from './ClaimsStatsContext';

export default function DashboardLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <AdminClaimsProvider>
      <ClaimsStatsProvider>
        <div className="relative w-full bg-[#FAFAFA] pb-6 space-y-4">
          <div className="sticky top-0">{header}</div>
          <div className="md:px-4">{children}</div>
        </div>
      </ClaimsStatsProvider>
    </AdminClaimsProvider>
  );
}
