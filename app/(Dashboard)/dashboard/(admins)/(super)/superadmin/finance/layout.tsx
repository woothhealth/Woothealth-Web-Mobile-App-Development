import Title from "../UIs/Title";
import { FinanceStatsProvider } from './FinanceStatsContext';

export default function FinanceAdminLayout({
  moneyGenerated,
  receivables,
  totalRevenue,
  refundRequest,
  children,
}: Readonly<{
  moneyGenerated: React.ReactNode;
  receivables: React.ReactNode;
  totalRevenue: React.ReactNode;
  refundRequest: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <FinanceStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
        <Title title="Finance Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{moneyGenerated}</div>
          <div>{receivables}</div>
          <div>{totalRevenue}</div>
          <div>{refundRequest}</div>
        </div>
        <div className="px-4">{children}</div>
      </div>
    </FinanceStatsProvider>
  );
}