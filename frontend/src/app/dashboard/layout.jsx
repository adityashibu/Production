import { Box } from "@mui/material";
import ThemeRegistry from "../themeRegistery";
import Sidebar from "../ui/dashboard/navbar/sidebar";
import Navbar from "../ui/dashboard/navbar/navbar";

const layout = ({ children }) => {
  return (
    <ThemeRegistry>
      <Navbar />
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </ThemeRegistry>
  );
};

export default layout;
