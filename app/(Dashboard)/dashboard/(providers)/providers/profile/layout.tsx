import ProviderHeader from "@/app/(providers)/Components/ProviderHeader";

export default function ProfileLayout({
  children,
  accountDetails,
}: Readonly<{
  children: React.ReactNode;
  accountDetails: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] mt-4">
      <div className="sticky top-0 z-20">
         <ProviderHeader title="Profile" />
      </div>
      <div className="p-4">{children}</div>
      <div className="px-4 mb-4">{accountDetails}</div>
    </div>
    </>
  );
}