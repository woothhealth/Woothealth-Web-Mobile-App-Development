import "@/styles/globals.css";
import NavBar from "@/Components/NavBar";
import SmallFooter from "@/Components/SmallFooter";
import { Toaster } from "sonner";
import ScrollToTop from "@/Components/ScrollToTop";

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
    <body className={`antialiased`}>
      <NavBar />
        <ScrollToTop/>
        {children}
      <Toaster richColors position="top-right" />
      <SmallFooter />
    </body>
    </html>
    );
}