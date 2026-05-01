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
        <Title title="PA Codes Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{approved}</div>
          <div>{underReview}</div>
          <div>{declined}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
    </PaCodesStatsProvider>
  );
}