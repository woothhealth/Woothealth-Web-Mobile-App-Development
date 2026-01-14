import "@/styles/globals.css";
import NavBar from "@/Components/NavBar";
import SmallFooter from "@/Components/SmallFooter";
import ScrollToTop from "@/Components/ScrollToTop";

export default function OthersLayout({
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
      <SmallFooter />
    </body>
    </html>
  );
}
