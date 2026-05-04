import "@/styles/globals.css";
import Title from "../UIs/Title";
import { PaCodesStatsProvider } from './PaCodesStatsContext';

export default function PaCodesLayout({
  header,
  children,
  approved,
  underReview,
  declined,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
  approved: React.ReactNode;
  underReview: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
    <PaCodesStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4">
        <div className="sticky top-0 z-50">{header}</div>
        <div className="md:px-4">{children}</div>
      </div>
    </PaCodesStatsProvider>
  );
}