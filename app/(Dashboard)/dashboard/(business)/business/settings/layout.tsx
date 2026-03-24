import "@/styles/globals.css";
import { SettingsProvider } from "./SettingsContext";

export default function SettingsLayout({
  header,
  children
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <div className="w-full bg-[#FAFAFA]">
        <div className="sticky top-0 z-20">{header}</div>
        <div className="relative md:px-6">
          {children}
        </div>
      </div>
    </SettingsProvider>
  );
}