import { BenefitsStatsProvider } from '../benefits/BenefitsStatsContext';
import { AdminOverviewProvider } from "@/Components/AdminOverviewContext";

export default function RolesAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminOverviewProvider>
      <BenefitsStatsProvider>    
        <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
          <div className="md:px-4">{children}</div>
        </div>
      </BenefitsStatsProvider>
    </AdminOverviewProvider>
  );
}