import HeaderMain from "./components/header/HeaderMain";
import FooterMain from "./components/footer/FooterMain";
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <HeaderMain />
          {children}
          <FooterMain />
        </Providers>
      </body>
    </html>
  );
}
