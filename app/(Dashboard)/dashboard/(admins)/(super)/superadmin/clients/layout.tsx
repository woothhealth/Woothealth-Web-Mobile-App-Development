export default function ClientsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="w-full bg-[#FAFAFA] mt-2">
        <div className="md:px-4">{children}</div>
      </div>
  );
}