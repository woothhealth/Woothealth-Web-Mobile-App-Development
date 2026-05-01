import "@/styles/globals.css";
import Title from "../UIs/Title";
import { ValidationsStatsProvider } from './ValidationsStatsContext';

export default function ValidationsLayout({
  header,
  children,
  approved,
  declined,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
  approved: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
    <ValidationsStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4">
        <div className="sticky top-0 z-50">{header}</div>
        <Title title="Validations Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-2 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{approved}</div>
          <div>{declined}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
    </ValidationsStatsProvider>
  );
}