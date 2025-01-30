import ThemeRegistry from "../themeRegistery";

const { default: Navbar } = require("../ui/dashboard/navbar/navbar");

const layout = ({ children }) => {
  return (
    <ThemeRegistry>
      <div>
        <div>
          <Navbar />
          {children}
        </div>
      </div>
    </ThemeRegistry>
  );
};

export default layout;
