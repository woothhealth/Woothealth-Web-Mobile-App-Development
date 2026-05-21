export default function PACodeCreationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] space-y-2">
      <div className="md:px-4">{children}</div>
    </div>
    </>
  );
}