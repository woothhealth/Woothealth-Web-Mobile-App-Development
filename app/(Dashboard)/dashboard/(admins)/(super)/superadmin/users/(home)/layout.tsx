import "@/styles/globals.css";
import Title from "../../UIs/Title";

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Title title="User Management"/>
      <div className="md:px-4">{children}</div>
    </div>
  );
}