import "@/styles/globals.css";
import Title from "../UIs/Title";

export default function TicketsLayout({
  header,
  children,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
      <div className="w-full bg-[#FAFAFA] space-y-2">
        <div className="sticky top-0 z-20">{header}</div>
        <Title title="Employees Directory"/>
        <div className="md:px-4">{children}</div>
      </div>
  );
}