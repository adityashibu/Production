"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import Head from "next/head";

export default function Providers({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FaviconUpdater mode={mode} />
      {children}
    </ThemeProvider>
  );
}

function FaviconUpdater({ mode }) {
  useEffect(() => {
    const favicon =
      mode === "dark" ? "/favicon-dark.ico" : "/favicon-light.ico";
    document.querySelector("link[rel='icon']")?.setAttribute("href", favicon);
  }, [mode]);

  return (
    <Head>
      <link rel="icon" href="/favicon-light.ico" />
    </Head>
  );
}
