import "@/styles/globals.css";

export default function UsersLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] space-y-4">
      <div className="sticky top-0 z-20">{header}</div>
      <div className="md:px-4">{children}</div>
    </div>
    </>
  );
}