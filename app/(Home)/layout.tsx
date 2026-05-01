import "@/styles/globals.css";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/Footer";
import ScrollToTop from "@/Components/ScrollToTop";
import BitrixChat from "@/Components/BitrixChat";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
        <ScrollToTop/>
        {children}
        <BitrixChat />
      <Footer />
    </div>
    );
}
