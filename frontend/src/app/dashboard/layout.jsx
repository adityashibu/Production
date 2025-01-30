import { Box } from "@mui/material";
import ThemeRegistry from "../themeRegistery";
import Sidebar from "../ui/dashboard/navbar/sidebar";

const layout = ({ children }) => {
  return (
    <ThemeRegistry>
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
