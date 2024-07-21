import { AppProps } from "next/app";
import Head from "next/head";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../app/globals.css";
import { metadata } from "../app/metadata";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>{metadata.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description || "Default description"}
        />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
