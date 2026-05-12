import Title from "../UIs/Title";
import { TicketsStatsProvider } from './TicketsStatsContext';

export default function TicketsAdminLayout({
  total,
  open,
  progress,
  resolved,
  children,
}: Readonly<{
  total: React.ReactNode;
  open: React.ReactNode;
  progress: React.ReactNode;
  resolved: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <TicketsStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-2">
        <Title title="Tickets"/>
        <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{total}</div>
          <div>{open}</div>
          <div>{progress}</div>
          <div>{resolved}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
    </TicketsStatsProvider>
  );
}