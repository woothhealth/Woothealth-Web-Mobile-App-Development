import "@/styles/globals.css";
import Title from "../../UIs/Title";
import { LeadsStatsProvider } from './LeadsStatsContext';

export default function LeadsHomeAdminLayout({
  newLeads,
  contacted,
  converted,
  lost,
  children,
}: Readonly<{
  newLeads: React.ReactNode;
  contacted: React.ReactNode;
  converted: React.ReactNode;
  lost: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <LeadsStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
        <Title title="Leads Management" />
        <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{newLeads}</div>
          <div>{contacted}</div>
          <div>{converted}</div>
          <div>{lost}</div>
        </div>
        <div className="px-4">{children}</div>
      </div>
    </LeadsStatsProvider>
  );
}
