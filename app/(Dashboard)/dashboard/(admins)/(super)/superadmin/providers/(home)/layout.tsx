import Title from "../../UIs/Title";

export default function ProviderLayout({
  active,
  inactive,
  children,
}: Readonly<{
  active: React.ReactNode;
  inactive: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
      <div className="">
        <Title title="Providers Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-2 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{active}</div>
          <div>{inactive}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
  );
}