export default function PrescriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
      <div className="md:px-4">{children}</div>
    </div>
  );
}