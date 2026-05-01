import "@/styles/globals.css";
import Title from "../UIs/Title";

export default function PreEmploymentLayout({
  header,
  children,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4">
      <div className="sticky top-0 z-50">{header}</div>
      <Title title="Pre-Employment Tests" />
      <div className="md:px-4">{children}</div>
    </div>
  );
}