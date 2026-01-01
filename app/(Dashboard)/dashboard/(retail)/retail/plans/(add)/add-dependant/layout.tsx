import "@/styles/globals.css";

export default function AddDependantLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="px-4">{children}</div>
    </div>
    </>
  );
}