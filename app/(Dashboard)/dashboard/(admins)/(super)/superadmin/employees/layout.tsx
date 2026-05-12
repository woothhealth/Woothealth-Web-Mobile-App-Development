import Title from "../UIs/Title";

export default function EmployeesAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-2">
      <Title title="Employees Directory"/>
      <div className="md:px-4">{children}</div>
    </div>
  );
}