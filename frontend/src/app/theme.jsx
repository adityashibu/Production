import { createTheme } from "@mui/material/styles";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1F99FC",
      },
      secondary: {
        main: "#197AC9",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#000000",
      },
    },
    typography: {
      fontFamily: jetBrainsMono.style.fontFamily,
    },
  });

export default getTheme;
