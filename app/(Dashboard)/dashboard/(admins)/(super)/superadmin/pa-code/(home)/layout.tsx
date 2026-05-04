import "@/styles/globals.css";
import Title from "../../UIs/Title";

export default function PaCodesLayout({
  children,
  approved,
  underReview,
  declined,
}: Readonly<{
  children: React.ReactNode;
  approved: React.ReactNode;
  underReview: React.ReactNode;
  declined: React.ReactNode;
}>) {
  return (
      <div className="w-full bg-[#FAFAFA] space-y-4">
        <Title title="PA Codes"/>
        <div className="flex gap-2 md:grid md:grid-cols-3 lg:gap-4 lg:ml-4 lg:mt-4 mx-auto overflow-x-auto w-[93%] md:w-[96%] formDiv">
          <div>{approved}</div>
          <div>{underReview}</div>
          <div>{declined}</div>
        </div>
        <div className="md:px-4">{children}</div>
      </div>
  );
}