export default function PreEmploymentHomeLayout({
  children,
  totalTest,
  pending,
  completed,
  overdue,
}: Readonly<{
  children: React.ReactNode;
  totalTest: React.ReactNode;
  pending: React.ReactNode;
  completed: React.ReactNode;
  overdue: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4">
      <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
        <div>{totalTest}</div>
        <div>{pending}</div>
        <div>{completed}</div>
        <div>{overdue}</div>
      </div>
      <div className="md:px-4 px-2">{children}</div>
    </div>
  );
}
