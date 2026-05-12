import { PaCodesStatsProvider } from './PaCodesStatsContext';

export default function PaCodesAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PaCodesStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
        <div className="md:px-4">{children}</div>
      </div>
    </PaCodesStatsProvider>
  );
}