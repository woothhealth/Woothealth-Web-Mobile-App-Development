import "@/styles/globals.css";

export default function AboutLayout({
  children,
  medical,
  dependant,
  claimsSummary,
  welcome,
  user,
  active,
  wallet,
  learn,
  payment,
  upcoming
}: Readonly<{
  children: React.ReactNode;
  medical: React.ReactNode;
  dependant: React.ReactNode;
  claimsSummary: React.ReactNode;
  welcome: React.ReactNode;
  user: React.ReactNode;
  active: React.ReactNode;
  wallet: React.ReactNode;
  learn: React.ReactNode;
  payment: React.ReactNode;
  upcoming: React.ReactNode;
}>) {
  return (
    <>
    <div className="relative w-full bg-[#FAFAFA]">
        <div className="sticky top-0">{welcome}</div>
        {user && <div>{user}</div>}
        <div className="flex gap-2 md:grid md:grid-cols-4 lg:gap-0 lg:ml-6 mx-auto overflow-x-auto w-[95%] formDiv">
          {active && <div>{active}</div>}
          {wallet && <div>{wallet}</div>}
          <div>{dependant}</div>
          <div>{learn}</div>
        </div>
        <div className="px-4">{children}</div>
        <div className="px-4 flex flex-col md:flex-row gap-4 md:gap-10">
          <div className="md:w-[60%] md:space-y-4">
            <div>{claimsSummary}</div>
            <div>{medical}</div>
          </div>
          <div className="md:w-[39%] md:space-y-4">
            <div>{payment}</div>
            <div>{upcoming}</div>
          </div>
        </div>
      </div>
    </>
  );
}