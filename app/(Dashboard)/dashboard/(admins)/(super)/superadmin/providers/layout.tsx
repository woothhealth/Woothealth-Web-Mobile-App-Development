import "@/styles/globals.css";
import Title from "../UIs/Title";
import { ProvidersStatsProvider } from './ProvidersStatsContext';

export default function ProviderLayout({
  header,
  children,
  active,
  inactive,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
  active: React.ReactNode;
  inactive: React.ReactNode;
}>) {
  return (
    <ProvidersStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4">
        <div className="sticky top-0 z-50">{header}</div>
        <Title title="Providers Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-2 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{active}</div>
          <div>{inactive}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
    </ProvidersStatsProvider>
  );
}