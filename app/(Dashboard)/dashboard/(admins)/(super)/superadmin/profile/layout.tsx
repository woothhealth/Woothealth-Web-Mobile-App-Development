export default function ProfileAdminLayout({
  children,
  // accountDetails,
}: Readonly<{
  children: React.ReactNode;
  // accountDetails: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] mt-4">
      <div className="p-4">{children}</div>
      {/* <div className="px-4">{accountDetails}</div> */}
    </div>
    </>
  );
}