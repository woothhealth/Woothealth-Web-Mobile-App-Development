import Title from "../../UIs/Title";

export default function TelemedicineAdminHomeLayout({
  children,
  accepted,
  declined,
}: Readonly<{
  children: React.ReactNode;
  accepted: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
      <div className="">
        <Title title="Telemedicine Management"/>
        <div className="flex gap-2 md:grid md:grid-cols-2 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{accepted}</div>
          <div>{declined}</div>
        </div>
        <div className="md:px-4 px-2">{children}</div>
      </div>
  );
}