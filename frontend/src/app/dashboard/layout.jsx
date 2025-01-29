const { default: Navbar } = require("../ui/dashboard/navbar/navbar");
const { default: Sidebar } = require("../ui/dashboard/sidebar/sidebar");

const layout = ({ children }) => {
  return (
    <div className="flex">
      <div className="sm:flex-3 md:flex-1 bg-bg-lightSoft p-[20px]">
        <Sidebar />
      </div>
      <div className="sm:flex-1 md:flex-4">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default layout;

