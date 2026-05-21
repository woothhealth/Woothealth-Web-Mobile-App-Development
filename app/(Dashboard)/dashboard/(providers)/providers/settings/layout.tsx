import ProviderHeader from "@/app/(providers)/Components/ProviderHeader";
import { SettingsProvider } from "./SettingsContext";

export default function SettingsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <div className="w-full bg-[#FAFAFA]">
        <div className="sticky top-0 z-20">
          <ProviderHeader title="Settings" />
        </div>
        <div className="relative md:px-6">
          {children}
        </div>
      </div>
    </SettingsProvider>
  );
}