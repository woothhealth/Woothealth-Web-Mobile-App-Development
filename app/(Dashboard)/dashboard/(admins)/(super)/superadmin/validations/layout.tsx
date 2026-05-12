import Title from "../UIs/Title";
import { ValidationsStatsProvider } from './ValidationsStatsContext';

export default function ValidationsLayout({
  children,
  approved,
  declined,
}: Readonly<{
  children: React.ReactNode;
  approved: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
    <ValidationsStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
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