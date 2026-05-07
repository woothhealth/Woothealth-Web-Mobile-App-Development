import "@/styles/globals.css";

export default function ProvidersLayout({
  children,
  header,
  // accountDetails,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
  // accountDetails: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="p-4">{children}</div>
      {/* <div className="px-4">{accountDetails}</div> */}
    </div>
    </>
  );
}