import "@/styles/globals.css";

export default function RolesLayout({
  header,
  children,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4">
      <div className="sticky top-0 z-50">{header}</div>
      <div className="md:px-4">{children}</div>
    </div>
  );
}