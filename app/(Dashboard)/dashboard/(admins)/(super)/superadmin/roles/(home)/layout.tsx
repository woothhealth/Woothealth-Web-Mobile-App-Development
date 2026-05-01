import Title from "../../UIs/Title";

export default function RolesHomeLayout({
  children,
  totalPlans,
  superadmin,
  customRoles,
  totalUsers,
}: Readonly<{
  children: React.ReactNode;
  totalPlans: React.ReactNode;
  superadmin: React.ReactNode;
  customRoles: React.ReactNode;
  totalUsers: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4">
        <Title title="Roles & Permissions" />
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
        <div>{totalPlans}</div>
        <div>{superadmin}</div>
        <div>{customRoles}</div>
        <div>{totalUsers}</div>
      </div>
      <div className="md:px-4 px-2">{children}</div>
    </div>
  );
}