"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme";

// Create a Context for theme mode
const ThemeContext = createContext();

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState(() => {
    // Load saved theme from localStorage or default to system preference
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    // Save mode to localStorage
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={getTheme(mode)} noSsr>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook to access the theme context
export const useThemeMode = () => useContext(ThemeContext);
