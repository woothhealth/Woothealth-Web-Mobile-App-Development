import "@/styles/globals.css";
import NavBar from "@/Components/NavBar";
import SmallFooter from "@/Components/SmallFooter";

export default function OthersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
        {children}
      <SmallFooter />
    </>
  );
}
