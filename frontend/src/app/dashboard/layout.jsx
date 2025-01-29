import ThemeRegistry from "../themeRegistery";

const { default: Navbar } = require("../ui/dashboard/navbar/navbar");
// const { default: Sidebar } = require("../ui/dashboard/sidebar/sidebar");

const layout = ({ children }) => {
  return (
    <ThemeRegistry>
      <div>
        {/* <div className="sm:flex-3 md:flex-1 bg-bg-lightSoft p-[20px]">
        <Sidebar />
      </div> */}
        <div>
          <Navbar />
          {children}
        </div>
      </div>
    </ThemeRegistry>
  );
};

export default layout;
