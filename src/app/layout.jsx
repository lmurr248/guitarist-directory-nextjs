import HeaderMain from "./components/header/HeaderMain";
import FooterMain from "./components/footer/FooterMain";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HeaderMain />
        {children}
        <FooterMain />
      </body>
    </html>
  );
}
