import "@/styles/globals.css";

export default function ProvidersLayout({
  children,
  header,
  administrators,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
  administrators: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="p-4">{children}</div>
      <div className="px-4">{administrators}</div>
    </div>
    </>
  );
}