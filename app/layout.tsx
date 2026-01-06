import "@/styles/globals.css";

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
    <body className={`antialiased`}>
        {children}
    </body>
    </html>
  );
}