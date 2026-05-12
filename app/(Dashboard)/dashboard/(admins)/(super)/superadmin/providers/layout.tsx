import { ProvidersStatsProvider } from './ProvidersStatsContext';

export default function ProviderAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProvidersStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
        <div className="md:px-4">{children}</div>
      </div>
    </ProvidersStatsProvider>
  );
}