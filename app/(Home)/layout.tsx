import "@/styles/globals.css";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
    <body className={`antialiased`}>
      <NavBar />
        {children}
      <Footer />
    </body>
    </html>
    );
}
