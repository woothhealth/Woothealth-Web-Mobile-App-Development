import "@/styles/globals.css";
import { TelemedicineStatsProvider } from './TelemedicineStatsContext';

export default function TelemedicineAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TelemedicineStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
        <div className="">{children}</div>
      </div>
    </TelemedicineStatsProvider>
  );
}