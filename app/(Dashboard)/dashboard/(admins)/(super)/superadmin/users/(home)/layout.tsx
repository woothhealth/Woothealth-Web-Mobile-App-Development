import Title from "../../UIs/Title";

export default function UsersAdminLayout({
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