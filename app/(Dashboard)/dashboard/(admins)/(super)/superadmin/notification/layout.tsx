import Title from "../UIs/Title";

export default function NotificationAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-[#FAFAFA] space-y-4 mt-4">
      <Title title="Notifications" />
      <div className="md:px-4">{children}</div>
    </div>
  );
}