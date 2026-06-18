import ProviderHeader from "../../Components/ProviderHeader";

export default function NotificationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] space-y-4">
      <div className="sticky top-0 z-20">
         <ProviderHeader title="Notifications" />
      </div>
      <div className="px-2 md:px-4">{children}</div>
    </div>
    </>
  );
}