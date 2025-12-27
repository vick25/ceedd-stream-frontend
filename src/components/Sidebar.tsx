import React from "react";
import NavMenu from "./NavMenu";

const Sidebar = () => {
  return (
    <div className="w-20 md:w-72 pt-2 py-2 min-h-screen bg-white shadow-lg">
      <div>
        <h1 className="hidden md:p-6 md:block font-semibold">Navigation</h1>
        <NavMenu />
      </div>
    </div>
  );
};

export default Sidebar;
