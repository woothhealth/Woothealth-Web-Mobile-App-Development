import "@/styles/globals.css";
import Title from "../UIs/Title";
import { TelemedicineStatsProvider } from './TelemedicineStatsContext';

export default function TelemedicineLayout({
  header,
  children,
  accepted,
  declined,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
  accepted: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
    <TelemedicineStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4">
        <div className="sticky top-0 z-50">{header}</div>
        <Title title="Telemedicine Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-2 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{accepted}</div>
          <div>{declined}</div>
        </div>
        <div className="md:px-4 px-2">{children}</div>
      </div>
    </TelemedicineStatsProvider>
  );
}