import { ReimbursementStatsProvider } from "./ReimbursementStatsContext";

export default function ReimbursementAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full bg-[#FAFAFA] pb-6 space-y-4 mt-4">
      <ReimbursementStatsProvider>
        {children}
      </ReimbursementStatsProvider>
    </div>
  );
}
