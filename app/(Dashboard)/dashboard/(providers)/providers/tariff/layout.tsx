import ProviderHeader from "../../Components/ProviderHeader";

export default function TariffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] mt-4">
      <div className="sticky top-0 z-20">
         <ProviderHeader title="Add Tariff" />
      </div>
      <div className="md:p-4">{children}</div>
    </div>
    </>
  );
}