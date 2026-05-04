import "@/styles/globals.css";

export default function PaCodesLayout({
  children,
  approved,
  underReview,
  declined,
}: Readonly<{
  children: React.ReactNode;
  approved: React.ReactNode;
  underReview: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
      <div className="w-full bg-[#FAFAFA] space-y-4">
        <div className="md:px-4">{children}</div>
      </div>
  );
}