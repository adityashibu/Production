const { default: Navbar } = require("../ui/dashboard/navbar/navbar");
const { default: Sidebar } = require("../ui/dashboard/sidebar/sidebar");

const layout = ({ children }) => {
  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default layout;
