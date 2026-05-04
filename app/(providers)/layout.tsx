import "@/styles/globals.css";
import { Toaster } from "sonner";
import ScrollToTop from "@/Components/ScrollToTop";

export default function ProvidersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ScrollToTop/>
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
