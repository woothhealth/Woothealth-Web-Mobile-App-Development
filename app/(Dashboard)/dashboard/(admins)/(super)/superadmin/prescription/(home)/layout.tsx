import Title from "../../UIs/Title";

export default function PrescriptionAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4">
        <Title title="Prescriptions"/>
      <div className="md:px-4">{children}</div>
    </div>
  );
}