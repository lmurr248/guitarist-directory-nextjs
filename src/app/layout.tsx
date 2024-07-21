import HeaderMain from "./components/header/HeaderMain";
import NavMenu from "./components/header/navMenu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HeaderMain />
        {children}
      </body>
    </html>
  );
}
