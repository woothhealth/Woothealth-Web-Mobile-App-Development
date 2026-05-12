import { AdminClaimsProvider } from '@/Components/AdminClaimsContext'
import { ClaimsStatsProvider } from './ClaimsStatsContext';

export default function ClaimsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminClaimsProvider>
      <ClaimsStatsProvider>
        <div className="relative w-full bg-[#FAFAFA] pb-6 mt-4">
          <div className="md:px-4">{children}</div>
        </div>
      </ClaimsStatsProvider>
    </AdminClaimsProvider>
  );
}
