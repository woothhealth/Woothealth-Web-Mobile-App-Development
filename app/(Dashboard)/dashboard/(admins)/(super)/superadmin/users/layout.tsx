import "@/styles/globals.css";
import Title from "../UIs/Title";

export default function UsersLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
}>) {
  return (
    <>
    <div className="w-full bg-[#FAFAFA] space-y-2">
      <div className="sticky top-0">{header}</div>
      <Title title="User Management"/>
      <div className="md:px-4">{children}</div>
    </div>
    </>
  );
}