import "@/styles/globals.css";
import NavBar from "@/Components/NavBar";
import SmallFooter from "@/Components/SmallFooter";
import { AuthProvider } from "@/context/Authcontext";

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={`antialiased`}>
      <NavBar />
      <AuthProvider>
        {children}
      </AuthProvider>
      <SmallFooter />
    </body>
  );
}
