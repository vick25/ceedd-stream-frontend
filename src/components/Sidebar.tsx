import NavMenu from "./NavMenu";

const Sidebar = () => {
  return (
    <div className="w-20 md:w-72 pt-16 py-6 min-h-screen bg-white shadow-lg">
      <h1 className="hidden md:p-6 md:block font-semibold">Navigation</h1>
      <NavMenu />
    </div>
  );
};

export default Sidebar;
