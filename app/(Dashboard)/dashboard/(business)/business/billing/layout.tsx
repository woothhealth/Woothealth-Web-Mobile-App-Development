import "@/styles/globals.css";

export default function WalletLayout({
  children,
  header,
  transaction,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
  transaction: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA]">
      <div className="sticky top-0">{header}</div>
      <div className="md:px-4 px-3">{transaction}</div>
    </div>
    </>
  );
}