import HeaderMain from "./components/header/HeaderMain";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HeaderMain />
        {children}
      </body>
    </html>
  );
}
