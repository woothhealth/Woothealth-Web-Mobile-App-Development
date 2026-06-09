import "@/styles/globals.css";
import Title from "../UIs/Title";
import { BenefitsStatsProvider } from './BenefitsStatsContext';
import { EnrolleesStatsProvider } from "../enrollees/(home)/EnrolleesStatsContext";

export default function BenefitsLayout({
  total,
  active,
  totalEnrollees,
  children,
}: Readonly<{
  active: React.ReactNode;
  total: React.ReactNode;
  totalEnrollees: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <BenefitsStatsProvider>
      <EnrolleesStatsProvider>
      <div className="w-full bg-[#FAFAFA] space-y-2">
        <Title title="Benefits / Plan"/>
        <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{total}</div>
          <div>{active}</div>
          <div>{totalEnrollees}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
      </EnrolleesStatsProvider>
    </BenefitsStatsProvider>
  );
}