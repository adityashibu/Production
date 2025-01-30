import { createTheme } from "@mui/material/styles";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1F99FC",
    },
    secondary: {
      main: "#DEDEDE",
    },
    typography: {
      fontFamily: jetBrainsMono.style.fontFamily,
    },
  },
});

export default theme;
