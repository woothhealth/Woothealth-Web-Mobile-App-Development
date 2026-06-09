import ProviderHeader from "../../Components/ProviderHeader";


export default function VerificationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] space-y-2">
      <div className="sticky top-0 z-20">
         <ProviderHeader title="Enrollee Verification" />
      </div>
      <div className="md:px-4">{children}</div>
    </div>
    </>
  );
}